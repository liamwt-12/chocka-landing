import { NextRequest, NextResponse } from 'next/server';

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

function getBand(score: number): string {
  if (score >= 81) return 'excellent';
  if (score >= 61) return 'good';
  if (score >= 41) return 'fair';
  return 'poor';
}

export async function POST(req: NextRequest) {
  const { placeId } = await req.json();

  if (!placeId) {
    return NextResponse.json({ found: false, error: 'Missing placeId' }, { status: 400 });
  }

  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': DETAILS_MASK,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ found: false });
  }

  const place = await res.json();
  const name = place.displayName?.text ?? '';
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

  const total = Math.min(
    starScore + reviewScore + recencyScore + completenessScore + responseScore,
    100,
  );
  const band = getBand(total);

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
    placeId,
    isLive: true,
  });
}
