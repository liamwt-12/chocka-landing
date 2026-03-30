/**
 * NE England Seeding Script
 *
 * Usage: npx tsx scripts/seed-ne.ts
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

const NE_TOWNS = [
  'Newcastle upon Tyne', 'Sunderland', 'Gateshead', 'Middlesbrough',
  'Durham', 'Darlington', 'Hartlepool', 'Stockton-on-Tees',
  'South Shields', 'North Shields', 'Whitley Bay', 'Hexham',
  'Morpeth', 'Blyth', 'Chester-le-Street',
];

const TRADES = [
  'Plumber', 'Electrician', 'Gas Engineer', 'Roofer', 'Builder',
  'Locksmith', 'Carpenter', 'Plasterer', 'Painter and Decorator',
  'Tiler', 'Landscaper', 'Handyman', 'Bathroom Fitter',
  'Flooring Fitter', 'Solar Installer', 'HVAC Engineer',
  'Damp Specialist', 'Drainage Engineer', 'Bricklayer', 'Kitchen Fitter',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

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

async function seedTownTrade(town: string, trade: string) {
  console.log(`  Searching: ${trade} in ${town}...`);

  // Text search
  const query = encodeURIComponent(`${trade} in ${town}, UK`);
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${googleApiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (!searchData.results || searchData.results.length === 0) {
    console.log(`    No results for ${trade} in ${town}`);
    return 0;
  }

  const results = searchData.results.slice(0, 20);
  let inserted = 0;

  for (const result of results) {
    try {
      // Rate limit
      await sleep(100);

      // Get place details
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,editorial_summary,photos,reviews,url,geometry&key=${googleApiKey}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();
      const place = detailsData.result;

      if (!place) continue;

      // Count recent reviews
      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const recentReviews = (place.reviews || []).filter(
        (r: { time: number }) => r.time * 1000 > ninetyDaysAgo
      ).length;

      // Calculate score
      const scoreResult = calculateChockaScore({
        starRating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
        recentReviews,
        hasDescription: !!place.editorial_summary?.overview,
        hasHours: !!place.opening_hours,
        hasPhone: !!place.formatted_phone_number,
        hasWebsite: !!place.website,
        photoCount: place.photos?.length || 0,
        responseRate: 0.5, // Not available from API
        lastPostDays: 365, // Not available from API
      });

      // Generate unique slug
      const baseSlug = slugify(`${place.name}-${town}`);
      let slug = baseSlug;
      let suffix = 1;
      while (true) {
        const { data: existing } = await supabase
          .from('businesses')
          .select('id')
          .eq('slug', slug)
          .single();
        if (!existing) break;
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      // Upsert business
      const { data: biz, error: bizError } = await supabase
        .from('businesses')
        .upsert(
          {
            google_place_id: result.place_id,
            name: place.name,
            slug,
            trade,
            town,
            address: place.formatted_address || null,
            phone: place.formatted_phone_number || null,
            website: place.website || null,
            google_maps_url: place.url || null,
            lat: place.geometry?.location?.lat || null,
            lng: place.geometry?.location?.lng || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'google_place_id' }
        )
        .select()
        .single();

      if (bizError || !biz) {
        console.log(`    Error inserting ${place.name}: ${bizError?.message}`);
        continue;
      }

      // Upsert score
      await supabase.from('scores').upsert(
        {
          business_id: biz.id,
          score: scoreResult.score,
          band: scoreResult.band,
          star_rating: place.rating || null,
          review_count: place.user_ratings_total || null,
          recency_score: scoreResult.components.recencyScore,
          completeness_score: scoreResult.components.completeness,
          response_rate_score: scoreResult.components.responseScore,
          activity_score: scoreResult.components.activityScore,
          calculated_at: new Date().toISOString(),
        },
        { onConflict: 'business_id' }
      );

      // Record initial history
      await supabase.from('score_history').insert({
        business_id: biz.id,
        score: scoreResult.score,
        week_of: new Date().toISOString().split('T')[0],
      });

      inserted++;
    } catch (err) {
      console.log(`    Error processing: ${err}`);
    }
  }

  return inserted;
}

async function updateRankings() {
  console.log('\nUpdating rankings...');

  // Get all scores with business info
  const { data: allScores } = await supabase
    .from('scores')
    .select('business_id, score, businesses(trade, town)')
    .order('score', { ascending: false });

  if (!allScores) return;

  // Group by town+trade
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
      await supabase.from('rankings').upsert(
        {
          business_id: entries[i].business_id,
          trade,
          town,
          rank: i + 1,
          previous_rank: null,
          movement: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'business_id,trade,town' }
      );
    }
  }

  console.log('Rankings updated.');
}

async function main() {
  console.log('=== Chocka Index: NE England Seeding ===\n');

  let totalInserted = 0;

  for (const town of NE_TOWNS) {
    console.log(`\n📍 ${town}`);
    for (const trade of TRADES) {
      const count = await seedTownTrade(town, trade);
      totalInserted += count;
      console.log(`    ✓ ${trade}: ${count} businesses`);
    }
  }

  await updateRankings();

  console.log(`\n=== Done! ${totalInserted} businesses seeded ===`);
}

main().catch(console.error);
