import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

const DETAILS_MASK = [
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
].join(',');

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
  const { placeId, town, trade, email } = await req.json();

  if (!placeId || !town || !trade || !email) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
  }

  // Fetch place details from Google
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': DETAILS_MASK,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ success: false, error: 'Could not fetch place details' }, { status: 502 });
  }

  const place = await res.json();
  const name = place.displayName?.text ?? '';
  const rating = place.rating ?? 0;
  const reviewCount = place.userRatingCount ?? 0;

  // Calculate score
  const starScore = Math.round((rating / 5) * 40);
  const reviewScore = Math.round(Math.min(reviewCount / 100, 1) * 25);
  const recencyScore = 8;
  const completenessScore =
    (place.editorialSummary?.text ? 3 : 0) +
    (place.regularOpeningHours ? 2 : 0) +
    (place.nationalPhoneNumber ? 2 : 0) +
    (place.websiteUri ? 1 : 0) +
    ((place.photos?.length ?? 0) >= 3 ? 2 : 0);
  const responseScore = 5;
  const activityScore = 0;

  const total = Math.min(
    starScore + reviewScore + recencyScore + completenessScore + responseScore + activityScore,
    100,
  );
  const band = getBand(total);

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
    return NextResponse.json({ success: false, error: bizError?.message ?? 'Insert failed' }, { status: 500 });
  }

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

  // Upsert claimed listing
  await sb.from('claimed_listings').upsert(
    {
      business_id: biz.id,
      email,
      claimed_at: new Date().toISOString(),
      chocka_customer: false,
    },
    { onConflict: 'business_id' },
  );

  // Recalculate rankings for this town + trade
  const { data: allScores } = await sb
    .from('scores')
    .select('business_id, score, review_count, businesses!inner(trade, town)')
    .eq('businesses.town', town)
    .eq('businesses.trade', trade)
    .order('score', { ascending: false });

  let rank = 0;
  let totalInTrade = 0;

  if (allScores?.length) {
    allScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.review_count ?? 0) - (a.review_count ?? 0);
    });

    totalInTrade = allScores.length;

    for (let i = 0; i < allScores.length; i++) {
      const { data: existing } = await sb
        .from('rankings')
        .select('rank')
        .eq('business_id', allScores[i].business_id)
        .eq('town', town)
        .eq('trade', trade)
        .single();

      const previousRank = existing?.rank ?? null;
      const newRank = i + 1;
      const movement = previousRank !== null ? previousRank - newRank : null;

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

      if (allScores[i].business_id === biz.id) {
        rank = newRank;
      }
    }
  }

  return NextResponse.json({
    success: true,
    slug,
    rank,
    totalInTrade,
  });
}
