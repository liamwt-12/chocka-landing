import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getWeakestComponent } from '@/lib/scoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const businessId = request.nextUrl.searchParams.get('business_id');
  if (!businessId) {
    return NextResponse.json({ error: 'business_id required' }, { status: 400 });
  }

  // Fetch business + score + ranking
  const { data: biz } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();

  if (!biz) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }

  const { data: score } = await supabase
    .from('scores')
    .select('*')
    .eq('business_id', businessId)
    .single();

  const { data: ranking } = await supabase
    .from('rankings')
    .select('*')
    .eq('business_id', businessId)
    .eq('trade', biz.trade)
    .eq('town', biz.town)
    .single();

  // Get top scorer in same town+trade
  const { data: topRanking } = await supabase
    .from('rankings')
    .select('business_id')
    .eq('trade', biz.trade)
    .eq('town', biz.town)
    .eq('rank', 1)
    .single();

  let topScore = 100;
  if (topRanking) {
    const { data: topScoreData } = await supabase
      .from('scores')
      .select('score')
      .eq('business_id', topRanking.business_id)
      .single();
    if (topScoreData) topScore = topScoreData.score;
  }

  // Find weakest component
  const components = score
    ? {
        starScore: Math.round((score.star_rating || 0) / 5 * 40),
        reviewScore: Math.round(Math.min((score.review_count || 0) / 100, 1) * 25),
        recencyScore: score.recency_score || 0,
        completeness: score.completeness_score || 0,
        responseScore: score.response_rate_score || 0,
        activityScore: score.activity_score || 0,
      }
    : null;

  const weakest = components ? getWeakestComponent(components) : 'overall profile';

  const emailContent = `Hi ${biz.name},

You're ranked #${ranking?.rank || '?'} in ${biz.town} for ${biz.trade} this week.

Your Chocka Score is ${score?.score || 0}/100.

${biz.town}'s top-ranked ${biz.trade} scores ${topScore}. The gap is mostly in ${weakest}.

We can fix this automatically. £29/month.

chocka.co.uk/index/claim/${biz.slug}

— The Chocka Team`;

  return NextResponse.json({
    business: biz.name,
    trade: biz.trade,
    town: biz.town,
    rank: ranking?.rank,
    score: score?.score,
    top_score: topScore,
    weakest_area: weakest,
    email_content: emailContent,
  });
}
