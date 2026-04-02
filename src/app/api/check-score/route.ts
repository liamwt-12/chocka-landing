import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.rating',
  'places.userRatingCount',
  'places.regularOpeningHours',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.editorialSummary',
  'places.photos',
  'places.types',
  'places.primaryType',
  'places.formattedAddress',
  'places.location',
  'places.googleMapsUri',
].join(',');

// Map Google Places types → Chocka trades
const TYPE_TO_TRADE: Record<string, string> = {
  plumber: 'Plumber',
  electrician: 'Electrician',
  roofing_contractor: 'Roofer',
  general_contractor: 'Builder',
  locksmith: 'Locksmith',
  carpenter: 'Carpenter',
  painter: 'Painter and Decorator',
  landscaper: 'Landscaper',
  hvac_contractor: 'HVAC Engineer',
  moving_company: 'Handyman',
  flooring_store: 'Flooring Fitter',
  solar_energy_contractor: 'Solar Installer',
};

function inferTrade(types: string[], primaryType?: string): string | null {
  if (primaryType && TYPE_TO_TRADE[primaryType]) {
    return TYPE_TO_TRADE[primaryType];
  }
  for (const t of types) {
    if (TYPE_TO_TRADE[t]) return TYPE_TO_TRADE[t];
  }
  // Fallback: check if any type contains a keyword
  const typeStr = [...types, primaryType ?? ''].join(' ').toLowerCase();
  if (typeStr.includes('plumb')) return 'Plumber';
  if (typeStr.includes('electri')) return 'Electrician';
  if (typeStr.includes('roof')) return 'Roofer';
  if (typeStr.includes('lock')) return 'Locksmith';
  if (typeStr.includes('paint')) return 'Painter and Decorator';
  if (typeStr.includes('landscap')) return 'Landscaper';
  if (typeStr.includes('solar')) return 'Solar Installer';
  if (typeStr.includes('hvac') || typeStr.includes('heating') || typeStr.includes('air_conditioning'))
    return 'HVAC Engineer';
  if (typeStr.includes('gas')) return 'Gas Engineer';
  return null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getBand(score: number): string {
  if (score >= 81) return 'excellent';
  if (score >= 61) return 'good';
  if (score >= 41) return 'fair';
  return 'poor';
}

export async function POST(req: NextRequest) {
  const { businessName, town } = await req.json();

  if (!businessName || !town) {
    return NextResponse.json({ found: false, error: 'Missing fields' }, { status: 400 });
  }

  // Search Google Places
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: `${businessName} in ${town}, UK`,
      maxResultCount: 1,
    }),
  });

  const data = await res.json();
  const place = data.places?.[0];

  if (!place) {
    return NextResponse.json({ found: false });
  }

  const name = place.displayName?.text ?? businessName;
  const rating = place.rating ?? 0;
  const reviewCount = place.userRatingCount ?? 0;
  const hasHours = !!place.regularOpeningHours;
  const hasPhone = !!place.nationalPhoneNumber;
  const hasWebsite = !!place.websiteUri;
  const hasDescription = !!place.editorialSummary?.text;
  const hasPhotos = (place.photos?.length ?? 0) >= 3;

  const starScore = Math.round((rating / 5) * 40);
  const reviewScore = Math.round(Math.min(reviewCount / 100, 1) * 25);
  const recencyScore = 8;
  const completenessScore =
    (hasDescription ? 3 : 0) +
    (hasHours ? 2 : 0) +
    (hasPhone ? 2 : 0) +
    (hasWebsite ? 1 : 0) +
    (hasPhotos ? 2 : 0);
  const responseScore = 5;
  const activityScore = 0;

  const total = Math.min(
    starScore + reviewScore + recencyScore + completenessScore + responseScore + activityScore,
    100,
  );
  const band = getBand(total);

  // Infer trade from Google Places types
  const trade = inferTrade(place.types ?? [], place.primaryType);

  // Insert into Supabase if we can determine the trade
  let rank = 0;
  let totalInTrade = 0;

  if (trade) {
    try {
      const sb = getServiceClient();

      // Generate unique slug
      const baseSlug = slugify(`${name}-${town}`);
      let slug = baseSlug;
      let suffix = 1;
      while (true) {
        const { data: existing } = await sb
          .from('businesses')
          .select('id')
          .eq('slug', slug)
          .single();
        if (!existing) break;
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      // Upsert business
      const { data: biz, error: bizError } = await sb
        .from('businesses')
        .upsert(
          {
            google_place_id: place.id,
            name,
            slug,
            trade,
            town,
            address: place.formattedAddress ?? null,
            phone: place.nationalPhoneNumber ?? null,
            website: place.websiteUri ?? null,
            google_maps_url: place.googleMapsUri ?? null,
            lat: place.location?.latitude ?? null,
            lng: place.location?.longitude ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'google_place_id' },
        )
        .select()
        .single();

      if (bizError || !biz) {
        console.error('Error inserting business:', bizError?.message);
      } else {
        // Upsert score
        await sb.from('scores').upsert(
          {
            business_id: biz.id,
            score: total,
            band,
            star_rating: rating || null,
            review_count: reviewCount || null,
            recency_score: recencyScore,
            completeness_score: completenessScore,
            response_rate_score: responseScore,
            activity_score: activityScore,
            calculated_at: new Date().toISOString(),
          },
          { onConflict: 'business_id' },
        );

        // Record score history
        await sb.from('score_history').insert({
          business_id: biz.id,
          score: total,
          week_of: new Date().toISOString().split('T')[0],
        });

        // Recalculate all rankings for this town + trade
        const { data: allScores } = await sb
          .from('scores')
          .select('business_id, score, review_count, businesses!inner(trade, town)')
          .eq('businesses.town', town)
          .eq('businesses.trade', trade)
          .order('score', { ascending: false });

        if (allScores?.length) {
          // Sort by score DESC, review_count DESC as tiebreaker
          allScores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.review_count ?? 0) - (a.review_count ?? 0);
          });

          for (let i = 0; i < allScores.length; i++) {
            // Look up existing ranking to set previous_rank
            const { data: existing } = await sb
              .from('rankings')
              .select('rank')
              .eq('business_id', allScores[i].business_id)
              .eq('town', town)
              .eq('trade', trade)
              .single();

            const previousRank = existing?.rank ?? null;
            const newRank = i + 1;
            const movement =
              previousRank !== null ? previousRank - newRank : null;

            await sb.from('rankings').upsert(
              {
                business_id: allScores[i].business_id,
                trade,
                town,
                rank: newRank,
                previous_rank: previousRank,
                movement,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'business_id,trade,town' },
            );

            // Capture the new business's rank
            if (allScores[i].business_id === biz.id) {
              rank = newRank;
            }
          }

          totalInTrade = allScores.length;
        }
      }
    } catch (err) {
      console.error('Error persisting to Supabase:', err);
    }
  }

  return NextResponse.json({
    found: true,
    name,
    score: total,
    band,
    starScore,
    reviewScore,
    recencyScore,
    completenessScore,
    responseScore,
    rating,
    reviewCount,
    isLive: true,
    trade: trade ?? null,
    rank,
    totalInTrade,
  });
}
