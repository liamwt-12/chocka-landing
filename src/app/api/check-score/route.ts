import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.regularOpeningHours',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.editorialSummary',
  'places.photos',
].join(',');

async function geocodePostcode(
  postcode: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode)},+UK&key=${API_KEY}`
    );
    const data = await res.json();
    const location = data.results?.[0]?.geometry?.location;
    if (location) return { lat: location.lat, lng: location.lng };
  } catch {
    // Fall through to null
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { businessName, postcode } = await req.json();

  if (!businessName || !postcode) {
    return NextResponse.json(
      { candidates: [], error: 'Missing fields' },
      { status: 400 }
    );
  }

  const coords = await geocodePostcode(postcode);

  const body: Record<string, unknown> = {
    textQuery: coords
      ? businessName
      : `${businessName} ${postcode}, UK`,
    maxResultCount: 5,
  };

  if (coords) {
    body.locationBias = {
      circle: {
        center: { latitude: coords.lat, longitude: coords.lng },
        radiusMeters: 5000,
      },
    };
  }

  const res = await fetch(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  const places = data.places ?? [];

  const candidates = places.map((p: Record<string, unknown>) => ({
    placeId: p.id as string,
    name: (p.displayName as { text: string })?.text ?? '',
    address: (p.formattedAddress as string) ?? '',
    rating: (p.rating as number) ?? 0,
    reviewCount: (p.userRatingCount as number) ?? 0,
    photoCount: ((p.photos as unknown[]) ?? []).length,
    hasHours: !!p.regularOpeningHours,
    hasPhone: !!p.nationalPhoneNumber,
    hasWebsite: !!p.websiteUri,
    hasDescription: !!(p.editorialSummary as { text?: string })?.text,
  }));

  return NextResponse.json({ candidates });
}
