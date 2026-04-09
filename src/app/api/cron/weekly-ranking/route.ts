import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = 'https://chocka.co.uk';
const FROM = 'Liam at Chocka <hello@getchocka.co.uk>';
const REPLY_TO = 'hello@getchocka.co.uk';
const BATCH_SIZE = 100;

// --- Auth ---

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const fromHeader = request.headers.get('x-cron-secret');
  const fromQuery = request.nextUrl.searchParams.get('secret');
  return fromHeader === secret || fromQuery === secret;
}

// --- Resend ---

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<{ id: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      reply_to: REPLY_TO,
      to: [to],
      subject,
      html,
      text,
      headers: {
        'List-Unsubscribe': `<${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(to)}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }

  return res.json();
}

// --- Email template ---

function makeEmailId(email: string, bizId: string): string {
  const ts = Date.now().toString(36);
  const hash = Buffer.from(email).toString('base64url').slice(0, 12);
  return `weekly-${hash}-${bizId.slice(0, 8)}-${ts}`;
}

function buildEmail(
  biz: { name: string; slug: string; trade: string; town: string },
  email: string,
  score: number,
  rank: number,
  total: number,
  competitor: { name: string; score: number; rank: number } | null,
  emailId: string
): { subject: string; html: string; text: string } {
  const trade = biz.trade.toLowerCase();
  const firstName = biz.name;
  const profileUrl = `${BASE_URL}/rankings/profile/${biz.slug}`;
  const unsubUrl = `${BASE_URL}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  const trackUrl = `${BASE_URL}/api/track-open?id=${encodeURIComponent(emailId)}&e=${encodeURIComponent(email)}`;

  const subject = `Your Chocka ranking this week \u2014 #${rank} of ${total} ${trade}s in ${biz.town}`;

  // Competitor section
  let competitorHtml = '';
  let competitorText = '';
  if (rank === 1) {
    competitorHtml =
      `<p>You\u2019re top of the rankings for ${trade}s in ${biz.town} this week. Keep it up.</p>`;
    competitorText =
      `You're top of the rankings for ${trade}s in ${biz.town} this week. Keep it up.`;
  } else if (competitor) {
    const gap = competitor.score - score;
    competitorHtml =
      `<p><strong>${competitor.name}</strong> is ranked #${competitor.rank} above you with a score of ${competitor.score}/100. The gap is ${gap} point${gap === 1 ? '' : 's'}.</p>`;
    competitorText =
      `${competitor.name} is ranked #${competitor.rank} above you with a score of ${competitor.score}/100. The gap is ${gap} point${gap === 1 ? '' : 's'}.`;
  }

  const html =
    '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>' +
    '<body style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:20px;">' +
    `<p>Hi ${firstName},</p>` +
    `<p>Quick update on your Chocka ranking this week.</p>` +
    `<p>You\u2019re currently ranked <strong>#${rank} of ${total}</strong> ${trade}s in ${biz.town}. Your Chocka Score is <strong>${score}/100</strong>.</p>` +
    competitorHtml +
    `<p><a href="${profileUrl}" style="color:#E8501A;">Your profile \u2192</a></p>` +
    `<p>Liam<br><a href="${BASE_URL}" style="color:#E8501A;">chocka.co.uk</a></p>` +
    `<div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e5e5;font-size:12px;color:#999;">` +
    `<a href="${unsubUrl}" style="color:#999;">Unsubscribe</a> \u00b7 Chocka \u00b7 Newcastle upon Tyne` +
    `</div>` +
    `<img src="${trackUrl}" width="1" height="1" style="display:none;" alt="" />` +
    '</body></html>';

  const text =
    `Hi ${firstName},\n\n` +
    `Quick update on your Chocka ranking this week.\n\n` +
    `You're currently ranked #${rank} of ${total} ${trade}s in ${biz.town}. Your Chocka Score is ${score}/100.\n\n` +
    (competitorText ? competitorText + '\n\n' : '') +
    `Your profile: ${profileUrl}\n\n` +
    `Liam\nchocka.co.uk\n\n` +
    `---\nUnsubscribe: ${unsubUrl}\nChocka \u00b7 Newcastle upon Tyne`;

  return { subject, html, text };
}

// --- Main handler ---

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
  }

  try {
    // 1. Get cursor
    const { data: cursorRow } = await supabase
      .from('cron_settings')
      .select('value')
      .eq('key', 'weekly_ranking_last_id')
      .single();

    const lastId = cursorRow?.value || null;

    // 2. Get next batch of claimed businesses with emails
    let query = supabase
      .from('claimed_listings')
      .select('business_id, email')
      .not('email', 'is', null)
      .order('business_id', { ascending: true })
      .limit(BATCH_SIZE);

    if (lastId) {
      query = query.gt('business_id', lastId);
    }

    const { data: claims, error: claimsError } = await query;

    if (claimsError) {
      return NextResponse.json({ error: 'Failed to fetch claims', details: claimsError.message }, { status: 500 });
    }

    // If no more claims, reset cursor for next week
    if (!claims || claims.length === 0) {
      await supabase.from('cron_settings').upsert(
        { key: 'weekly_ranking_last_id', value: '', updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
      return NextResponse.json({ done: true, message: 'All businesses processed for this week', sent: 0 });
    }

    const businessIds = claims.map(c => c.business_id);
    const emailMap = new Map(claims.map(c => [c.business_id, c.email as string]));

    // 3. Batch-fetch businesses, scores, rankings
    const [bizResult, scoreResult, rankResult] = await Promise.all([
      supabase.from('businesses').select('id, name, slug, trade, town').in('id', businessIds),
      supabase.from('scores').select('business_id, score').in('business_id', businessIds),
      supabase.from('rankings').select('business_id, rank, trade, town').in('business_id', businessIds),
    ]);

    const businesses = new Map((bizResult.data || []).map(b => [b.id, b]));
    const scores = new Map((scoreResult.data || []).map(s => [s.business_id, s.score as number]));
    const rankings = new Map(
      (rankResult.data || []).map(r => [r.business_id, { rank: r.rank as number, trade: r.trade as string, town: r.town as string }])
    );

    // 4. Collect unique town+trade pairs and fetch totals + competitors
    const townTradePairs = new Set<string>();
    for (const r of rankResult.data || []) {
      townTradePairs.add(`${r.town}::${r.trade}`);
    }

    // For each pair, fetch all rankings to get totals and competitor lookup
    const competitorData = new Map<string, { name: string; score: number; rank: number }>();
    const totalCounts = new Map<string, number>();

    for (const pair of townTradePairs) {
      const [town, trade] = pair.split('::');
      const { data: pairRankings } = await supabase
        .from('rankings')
        .select('business_id, rank')
        .eq('town', town)
        .eq('trade', trade)
        .order('rank', { ascending: true });

      if (!pairRankings) continue;
      totalCounts.set(pair, pairRankings.length);

      // Build rank-to-business_id map for competitor lookups
      for (const pr of pairRankings) {
        competitorData.set(`${pair}::${pr.rank}`, {
          name: '', // fill below
          score: 0,
          rank: pr.rank,
        });
      }

      // Fetch names and scores for competitors
      const competitorIds = pairRankings.map(pr => pr.business_id);
      const [compBiz, compScores] = await Promise.all([
        supabase.from('businesses').select('id, name').in('id', competitorIds),
        supabase.from('scores').select('business_id, score').in('business_id', competitorIds),
      ]);

      const compBizMap = new Map((compBiz.data || []).map(b => [b.id, b.name as string]));
      const compScoreMap = new Map((compScores.data || []).map(s => [s.business_id, s.score as number]));

      for (const pr of pairRankings) {
        competitorData.set(`${pair}::${pr.rank}`, {
          name: compBizMap.get(pr.business_id) || 'Unknown',
          score: compScoreMap.get(pr.business_id) || 0,
          rank: pr.rank,
        });
      }
    }

    // 5. Check suppressions for all emails in batch
    const allEmails = [...emailMap.values()].map(e => e.toLowerCase());
    const { data: suppressions } = await supabase
      .from('email_suppressions')
      .select('email')
      .in('email', allEmails);

    const suppressedSet = new Set((suppressions || []).map(s => s.email));

    // 6. Send emails
    let sent = 0;
    let skipped = 0;
    let failed = 0;
    let lastProcessedId = lastId || '';

    for (const bizId of businessIds) {
      const biz = businesses.get(bizId);
      const email = emailMap.get(bizId);
      const score = scores.get(bizId);
      const ranking = rankings.get(bizId);

      if (!biz || !email || score == null || !ranking) {
        skipped++;
        lastProcessedId = bizId;
        continue;
      }

      if (suppressedSet.has(email.toLowerCase())) {
        skipped++;
        lastProcessedId = bizId;
        continue;
      }

      const pair = `${ranking.town}::${ranking.trade}`;
      const total = totalCounts.get(pair) || 1;

      // Find competitor directly above
      let competitor: { name: string; score: number; rank: number } | null = null;
      if (ranking.rank > 1) {
        competitor = competitorData.get(`${pair}::${ranking.rank - 1}`) || null;
      }

      const emailId = makeEmailId(email, bizId);
      const { subject, html, text } = buildEmail(biz, email, score, ranking.rank, total, competitor, emailId);

      try {
        await sendViaResend(email, subject, html, text);

        // Log to email_opens table for tracking
        await supabase.from('email_opens').insert({
          email_id: emailId,
          recipient_email: email,
          opened_at: null, // will be set when actually opened
        });

        sent++;
      } catch (err) {
        console.error(`FAILED ${email}:`, err);
        failed++;
      }

      lastProcessedId = bizId;

      // Rate limit: 2 per second
      await new Promise(r => setTimeout(r, 500));
    }

    // 7. Update cursor
    await supabase.from('cron_settings').upsert(
      { key: 'weekly_ranking_last_id', value: lastProcessedId, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

    const hasMore = claims.length === BATCH_SIZE;

    return NextResponse.json({
      success: true,
      sent,
      skipped,
      failed,
      batch_size: claims.length,
      has_more: hasMore,
      last_processed_id: lastProcessedId,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Weekly ranking failed', details: String(err) },
      { status: 500 }
    );
  }
}
