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

export async function POST(req: NextRequest) {
  const { businessName, town, trade } = await req.json();

  if (!businessName || !town || !trade) {
    return NextResponse.json({ candidates: [], error: 'Missing fields' }, { status: 400 });
  }

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: `${businessName} ${trade} in ${town}, UK`,
      maxResultCount: 5,
    }),
  });

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
