import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateChockaScore } from '@/lib/scoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY not set' }, { status: 500 });
  }

  try {
    // Fetch all businesses
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*');

    if (error || !businesses) {
      return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
    }

    let updated = 0;
    let failed = 0;
    const weekOf = new Date().toISOString().split('T')[0];

    for (const biz of businesses) {
      try {
        // Fetch updated place details from Google
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${biz.google_place_id}&fields=rating,user_ratings_total,opening_hours,formatted_phone_number,website,editorial_summary,photos,reviews&key=${apiKey}`;
        const detailsRes = await fetch(detailsUrl);
        const detailsData = await detailsRes.json();
        const place = detailsData.result;

        if (!place) {
          failed++;
          continue;
        }

        // Count recent reviews (within last 90 days)
        const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
        const recentReviews = (place.reviews || []).filter(
          (r: { time: number }) => r.time * 1000 > ninetyDaysAgo
        ).length;

        // Calculate score
        const result = calculateChockaScore({
          starRating: place.rating || 0,
          reviewCount: place.user_ratings_total || 0,
          recentReviews,
          hasDescription: !!place.editorial_summary?.overview,
          hasHours: !!place.opening_hours,
          hasPhone: !!place.formatted_phone_number,
          hasWebsite: !!place.website,
          photoCount: place.photos?.length || 0,
          responseRate: 0.5, // Default — not available from Places API
          lastPostDays: 365, // Default — not available from Places API
        });

        // Upsert score
        await supabase.from('scores').upsert(
          {
            business_id: biz.id,
            score: result.score,
            band: result.band,
            star_rating: place.rating,
            review_count: place.user_ratings_total,
            recency_score: result.components.recencyScore,
            completeness_score: result.components.completeness,
            response_rate_score: result.components.responseScore,
            activity_score: result.components.activityScore,
            calculated_at: new Date().toISOString(),
          },
          { onConflict: 'business_id' }
        );

        // Record history
        await supabase.from('score_history').insert({
          business_id: biz.id,
          score: result.score,
          week_of: weekOf,
        });

        updated++;

        // Rate limit: ~10 req/s
        await new Promise((r) => setTimeout(r, 100));
      } catch {
        failed++;
      }
    }

    // Recalculate rankings per town+trade
    const { data: allScores } = await supabase
      .from('scores')
      .select('business_id, score, businesses(trade, town)')
      .order('score', { ascending: false });

    if (allScores) {
      const grouped: Record<string, typeof allScores> = {};
      for (const s of allScores) {
        const biz = s.businesses as unknown as { trade: string; town: string };
        const key = `${biz.town}::${biz.trade}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(s);
      }

      for (const [key, entries] of Object.entries(grouped)) {
        const [town, trade] = key.split('::');
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          // Get previous rank
          const { data: prevRanking } = await supabase
            .from('rankings')
            .select('rank')
            .eq('business_id', entry.business_id)
            .eq('trade', trade)
            .eq('town', town)
            .single();

          const newRank = i + 1;
          const previousRank = prevRanking?.rank || null;
          const movement = previousRank ? previousRank - newRank : null;

          await supabase.from('rankings').upsert(
            {
              business_id: entry.business_id,
              trade,
              town,
              rank: newRank,
              previous_rank: previousRank,
              movement,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'business_id,trade,town' }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      failed,
      total: businesses.length,
      week_of: weekOf,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Refresh failed', details: String(err) },
      { status: 500 }
    );
  }
}
