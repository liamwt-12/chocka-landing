import { NextRequest, NextResponse } from 'next/server';
import { calculateChockaScore } from '@/lib/scoring';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

const DETAILS_MASK = [
  'id',
  'displayName',
  'rating',
  'userRatingCount',
  'regularOpeningHours',
  'nationalPhoneNumber',
  'websiteUri',
  'editorialSummary',
  'photos',
].join(',');

export async function POST(req: NextRequest) {
  const { placeId } = await req.json();

  if (!placeId) {
    return NextResponse.json(
      { found: false, error: 'Missing placeId' },
      { status: 400 }
    );
  }

  const res = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': DETAILS_MASK,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ found: false });
  }

  const place = await res.json();
  const name = place.displayName?.text ?? '';
  const rating = place.rating ?? 0;
  const reviewCount = place.userRatingCount ?? 0;
  const photoCount = place.photos?.length ?? 0;

  const result = calculateChockaScore({
    starRating: rating,
    reviewCount,
    recentReviews: 0,
    hasDescription: !!place.editorialSummary?.text,
    hasHours: !!place.regularOpeningHours,
    hasPhone: !!place.nationalPhoneNumber,
    hasWebsite: !!place.websiteUri,
    photoCount,
    responseRate: 0,
    lastPostDays: 365,
  });

  return NextResponse.json({
    found: true,
    name,
    score: result.score,
    band: result.band,
    components: result.components,
    hiddenComponents: ['recency', 'response', 'activity'],
    rating,
    reviewCount,
    placeId,
    isLive: true,
  });
}
