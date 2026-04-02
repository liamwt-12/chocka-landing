import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

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

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.rating,places.userRatingCount,places.regularOpeningHours,places.nationalPhoneNumber,places.websiteUri,places.editorialSummary,places.photos',
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
    100
  );
  const band = getBand(total);

  return NextResponse.json({
    found: true,
    name: place.displayName?.text ?? businessName,
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
  });
}
