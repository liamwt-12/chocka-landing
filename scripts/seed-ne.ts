/**
 * NE England Seeding Script — Google Places API (New)
 *
 * Usage: npx tsx scripts/seed-ne.ts
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   GOOGLE_PLACES_API_KEY
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

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

const TRADE_QUERIES: Record<string, string[]> = {
  'Plumber': ['plumber', 'plumbing services', 'plumbing and heating'],
  'Electrician': ['electrician', 'electrical services', 'electrical contractor'],
  'Gas Engineer': ['gas engineer', 'gas safe engineer', 'boiler repair', 'heating engineer'],
  'Roofer': ['roofer', 'roofing contractor', 'roofing services', 'roof repair'],
  'Builder': ['builder', 'building contractor', 'construction'],
  'Locksmith': ['locksmith', 'lock repair'],
  'Carpenter': ['carpenter', 'joiner', 'carpentry'],
  'Plasterer': ['plasterer', 'plastering services'],
  'Painter and Decorator': ['painter decorator', 'painting and decorating'],
  'Tiler': ['tiler', 'tiling services'],
  'Landscaper': ['landscaper', 'landscape gardener', 'garden services'],
  'Handyman': ['handyman', 'odd jobs', 'general maintenance'],
  'Bathroom Fitter': ['bathroom fitter', 'bathroom installer', 'bathroom renovation'],
  'Flooring Fitter': ['flooring fitter', 'flooring installer', 'floor fitting'],
  'Solar Installer': ['solar installer', 'solar panels', 'solar panel installation'],
  'HVAC Engineer': ['hvac', 'air conditioning', 'ventilation engineer'],
  'Damp Specialist': ['damp specialist', 'damp proofing', 'damp treatment'],
  'Drainage Engineer': ['drainage engineer', 'drain unblocking', 'drainage services'],
  'Bricklayer': ['bricklayer', 'brickwork', 'bricklaying'],
  'Kitchen Fitter': ['kitchen fitter', 'kitchen installer', 'kitchen renovation'],
};

const SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.regularOpeningHours',
  'places.editorialSummary',
  'places.photos',
  'places.location',
  'places.googleMapsUri',
].join(',');

const DETAILS_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'nationalPhoneNumber',
  'websiteUri',
  'rating',
  'userRatingCount',
  'regularOpeningHours',
  'editorialSummary',
  'photos',
  'location',
  'googleMapsUri',
  'reviews',
].join(',');

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

// --- Google Places API (New) helpers ---

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  regularOpeningHours?: object;
  editorialSummary?: { text: string };
  photos?: object[];
  location?: { latitude: number; longitude: number };
  googleMapsUri?: string;
  reviews?: { publishTime: string }[];
}

async function textSearch(query: string): Promise<PlaceResult[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': googleApiKey,
      'X-Goog-FieldMask': SEARCH_FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 20 }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.log(`    Search API error (${res.status}): ${err.slice(0, 200)}`);
    return [];
  }

  const data = await res.json();
  return data.places || [];
}

async function getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': googleApiKey,
      'X-Goog-FieldMask': DETAILS_FIELD_MASK,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    console.log(`    Details API error (${res.status}): ${err.slice(0, 200)}`);
    return null;
  }

  return await res.json();
}

// --- Seeding logic ---

async function seedTownTrade(town: string, trade: string) {
  const queries = TRADE_QUERIES[trade] || [trade.toLowerCase()];
  console.log(`  Searching: ${trade} in ${town} (${queries.length} queries)...`);

  // Run all query variations and deduplicate by place ID
  const seenIds = new Set<string>();
  const allResults: PlaceResult[] = [];

  for (const query of queries) {
    const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleApiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.regularOpeningHours,places.editorialSummary,places.photos,places.location,places.googleMapsUri',
      },
      body: JSON.stringify({
        textQuery: `${query} in ${town}, UK`,
        maxResultCount: 20,
      }),
    });

    const searchText = await searchRes.text();
    if (!searchRes.ok) {
      console.log(`    Search API error for "${query}" (${searchRes.status}): ${searchText.slice(0, 200)}`);
      continue;
    }
    const searchData = JSON.parse(searchText);
    const places: PlaceResult[] = searchData.places || [];
    let newCount = 0;
    for (const p of places) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        allResults.push(p);
        newCount++;
      }
    }
    console.log(`    "${query}": ${places.length} results, ${newCount} new`);

    await sleep(100); // Rate limit between queries
  }

  if (allResults.length === 0) {
    console.log(`    No results for ${trade} in ${town}`);
    return 0;
  }

  console.log(`    Total unique: ${allResults.length}`);
  let inserted = 0;

  for (const searchResult of allResults) {
    try {
      await sleep(100); // Rate limit ~10 req/s

      // Fetch full details (includes reviews not returned in search)
      const place = await getPlaceDetails(searchResult.id);
      if (!place) continue;

      const name = place.displayName?.text;
      if (!name) continue;

      // Count recent reviews (last 90 days)
      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const recentReviews = (place.reviews || []).filter(
        (r) => new Date(r.publishTime).getTime() > ninetyDaysAgo
      ).length;

      // Calculate score
      const scoreResult = calculateChockaScore({
        starRating: place.rating || 0,
        reviewCount: place.userRatingCount || 0,
        recentReviews,
        hasDescription: !!place.editorialSummary?.text,
        hasHours: !!place.regularOpeningHours,
        hasPhone: !!place.nationalPhoneNumber,
        hasWebsite: !!place.websiteUri,
        photoCount: place.photos?.length || 0,
        responseRate: 0.5, // Not available from API
        lastPostDays: 365, // Not available from API
      });

      // Generate unique slug
      const baseSlug = slugify(`${name}-${town}`);
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
            google_place_id: place.id,
            name,
            slug,
            trade,
            town,
            address: place.formattedAddress || null,
            phone: place.nationalPhoneNumber || null,
            website: place.websiteUri || null,
            google_maps_url: place.googleMapsUri || null,
            lat: place.location?.latitude || null,
            lng: place.location?.longitude || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'google_place_id' }
        )
        .select()
        .single();

      if (bizError || !biz) {
        console.log(`    Error inserting ${name}: ${bizError?.message}`);
        continue;
      }

      // Upsert score
      await supabase.from('scores').upsert(
        {
          business_id: biz.id,
          score: scoreResult.score,
          band: scoreResult.band,
          star_rating: place.rating || null,
          review_count: place.userRatingCount || null,
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

  const { data: allScores } = await supabase
    .from('scores')
    .select('business_id, score, businesses(trade, town)')
    .order('score', { ascending: false });

  if (!allScores) return;

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
  // Check for --test flag: only run Newcastle + Plumber
  const testMode = process.argv.includes('--test');

  const towns = testMode ? ['Newcastle upon Tyne'] : NE_TOWNS;
  const trades = testMode ? ['Plumber'] : TRADES;

  if (testMode) {
    console.log('=== TEST MODE: Newcastle + Plumber only ===\n');
  } else {
    console.log('=== Chocka Index: NE England Seeding ===\n');
  }

  let totalInserted = 0;

  for (const town of towns) {
    console.log(`\n📍 ${town}`);
    for (const trade of trades) {
      const count = await seedTownTrade(town, trade);
      totalInserted += count;
      console.log(`    ✓ ${trade}: ${count} businesses`);
    }
  }

  await updateRankings();

  console.log(`\n=== Done! ${totalInserted} businesses seeded ===`);
}

main().catch(console.error);
