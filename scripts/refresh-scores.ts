/**
 * Weekly Score Refresh Script
 *
 * Usage: npx tsx scripts/refresh-scores.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_PLACES_API_KEY
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const googleApiKey = process.env.GOOGLE_PLACES_API_KEY!;

if (!supabaseUrl || !supabaseKey || !googleApiKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MAX_BUSINESSES = 500;

function calculateChockaScore(data: {
  starRating: number;
  reviewCount: number;
  recentReviews: number;
  hasDescription: boolean;
  hasHours: boolean;
  hasPhone: boolean;
  hasWebsite: boolean;
  photoCount: number;
  responseRate: number;
  lastPostDays: number;
}) {
  const starScore = Math.round((data.starRating / 5) * 40);
  const reviewScore = Math.round(Math.min(data.reviewCount / 100, 1) * 25);
  const recencyScore = Math.round(Math.min(data.recentReviews / 10, 1) * 15);

  let completeness = 0;
  if (data.hasDescription) completeness += 3;
  if (data.hasHours) completeness += 2;
  if (data.hasPhone) completeness += 2;
  if (data.hasWebsite) completeness += 1;
  if (data.photoCount >= 3) completeness += 2;

  const responseScore = Math.round(data.responseRate * 10);

  let activityScore = 0;
  if (data.lastPostDays <= 30) activityScore = 6;
  else if (data.lastPostDays <= 60) activityScore = 3;
  else if (data.lastPostDays <= 90) activityScore = 1;

  const total = Math.min(100, starScore + reviewScore + recencyScore + completeness + responseScore + activityScore);
  const band = total >= 81 ? 'excellent' : total >= 61 ? 'good' : total >= 41 ? 'fair' : 'poor';

  return { score: total, band, components: { starScore, reviewScore, recencyScore, completeness, responseScore, activityScore } };
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== Chocka Index: Weekly Score Refresh ===\n');

  const weekOf = new Date().toISOString().split('T')[0];

  // Fetch all businesses
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('*');

  if (error || !businesses) {
    console.error('Failed to fetch businesses:', error?.message);
    process.exit(1);
  }

  console.log(`Found ${businesses.length} businesses to refresh.\n`);

  let updated = 0;
  let failed = 0;

  for (const biz of businesses) {
    try {
      await sleep(100); // Rate limit

      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${biz.google_place_id}&fields=rating,user_ratings_total,opening_hours,formatted_phone_number,website,editorial_summary,photos,reviews&key=${googleApiKey}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();
      const place = detailsData.result;

      if (!place) {
        console.log(`  ✗ ${biz.name}: No data from Google`);
        failed++;
        continue;
      }

      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const recentReviews = (place.reviews || []).filter(
        (r: { time: number }) => r.time * 1000 > ninetyDaysAgo
      ).length;

      const result = calculateChockaScore({
        starRating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
        recentReviews,
        hasDescription: !!place.editorial_summary?.overview,
        hasHours: !!place.opening_hours,
        hasPhone: !!place.formatted_phone_number,
        hasWebsite: !!place.website,
        photoCount: place.photos?.length || 0,
        responseRate: 0.5,
        lastPostDays: 365,
      });

      // Update score
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
      if (updated % 50 === 0) {
        console.log(`  Progress: ${updated}/${businesses.length}`);
      }

      if (updated >= MAX_BUSINESSES) {
        console.log(`\nRate limit reached — run again tomorrow to continue`);
        break;
      }
    } catch (err) {
      console.log(`  ✗ ${biz.name}: ${err}`);
      failed++;
    }
  }

  // Recalculate rankings
  console.log('\nRecalculating rankings...');

  const { data: allScores } = await supabase
    .from('scores')
    .select('business_id, score, businesses(trade, town)')
    .order('score', { ascending: false });

  if (allScores) {
    const grouped: Record<string, typeof allScores> = {};
    for (const s of allScores) {
      const b = s.businesses as unknown as { trade: string; town: string };
      const key = `${b.town}::${b.trade}`;
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

        // Update score_history with rank
        await supabase
          .from('score_history')
          .update({ rank_in_town_trade: newRank })
          .eq('business_id', entry.business_id)
          .eq('week_of', weekOf);
      }
    }
  }

  console.log(`\n=== Done! Updated: ${updated}, Failed: ${failed}, Total: ${businesses.length} ===`);
}

main().catch(console.error);
