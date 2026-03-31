import { supabase } from './supabase';
import { LeagueTableEntry, Business, Score, BusinessWithScore } from './types';

export async function getLeagueTable(
  town: string,
  trade: string,
  order: 'asc' | 'desc' = 'asc',
  limit: number = 10
): Promise<LeagueTableEntry[]> {
  // Fetch ALL rankings for this town/trade (no DB limit — sort in JS for unique ranks)
  const { data, error } = await supabase
    .from('rankings')
    .select(
      `
      rank,
      previous_rank,
      movement,
      business:businesses!inner(
        id,
        google_place_id,
        name,
        slug,
        trade,
        town,
        address,
        phone,
        website,
        google_maps_url,
        lat,
        lng,
        created_at,
        updated_at
      ),
      business_id
    `
    )
    .eq('town', town)
    .eq('trade', trade);

  if (error || !data) return [];

  const businessIds = data.map((r) => r.business_id);

  const [scoresResult, claimsResult] = await Promise.all([
    supabase.from('scores').select('*').in('business_id', businessIds),
    supabase.from('claimed_listings').select('*').in('business_id', businessIds),
  ]);

  const scoresMap = new Map(
    (scoresResult.data || []).map((s) => [s.business_id, s])
  );
  const claimsMap = new Map(
    (claimsResult.data || []).map((c) => [c.business_id, c])
  );

  // Build entries with score data
  const all = data.map((row) => {
    const business = row.business as unknown as Business;
    const score = scoresMap.get(row.business_id) as Score | undefined;
    const claim = claimsMap.get(row.business_id);
    return { row, business, score, claim };
  });

  // Sort by score DESC, then review_count DESC as tiebreaker
  all.sort((a, b) => {
    const scoreA = a.score?.score ?? 0;
    const scoreB = b.score?.score ?? 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    const reviewA = a.score?.review_count ?? 0;
    const reviewB = b.score?.review_count ?? 0;
    return reviewB - reviewA;
  });

  // Assign unique sequential ranks (1 = best score)
  const ranked = all.map((item, index) => ({
    ...item,
    computedRank: index + 1,
  }));

  // Select the right slice based on order
  let slice: typeof ranked;
  if (order === 'asc') {
    slice = ranked.slice(0, limit);
  } else {
    slice = ranked.slice(Math.max(0, ranked.length - limit)).reverse();
  }

  return slice.map((item) => {
    const defaultScore: Score = {
      id: '',
      business_id: item.row.business_id,
      score: 0,
      band: 'poor' as const,
      star_rating: null,
      review_count: null,
      recency_score: null,
      completeness_score: null,
      response_rate_score: null,
      activity_score: null,
      last_active_at: null,
      calculated_at: new Date().toISOString(),
    };

    return {
      rank: item.computedRank,
      previous_rank: item.row.previous_rank,
      movement: item.row.movement,
      business: item.business,
      score: item.score || defaultScore,
      is_claimed: !!item.claim,
      is_chocka_customer: item.claim?.chocka_customer || false,
    };
  });
}

export async function getBusinessBySlug(
  slug: string
): Promise<BusinessWithScore | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select(
      `
      *,
      scores(*),
      rankings(*),
      claimed_listings(*)
    `
    )
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  // Normalize: Supabase may return one-to-many joins as arrays
  const raw = data as Record<string, unknown>;
  return {
    ...raw,
    scores: Array.isArray(raw.scores)
      ? raw.scores[0] || null
      : raw.scores || null,
    rankings: Array.isArray(raw.rankings)
      ? raw.rankings[0] || null
      : raw.rankings || null,
  } as unknown as BusinessWithScore;
}

export async function getCompetitorContext(
  businessId: string,
  town: string,
  trade: string
): Promise<{
  above: { name: string; score: number; rank: number; slug: string } | null;
  current: { name: string; score: number; rank: number; slug: string };
  below: { name: string; score: number; rank: number; slug: string } | null;
  total: number;
} | null> {
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, slug')
    .eq('town', town)
    .eq('trade', trade);

  if (!businesses?.length) return null;

  const ids = businesses.map((b) => b.id);
  const { data: scores } = await supabase
    .from('scores')
    .select('business_id, score')
    .in('business_id', ids);

  const scoresMap = new Map(
    (scores || []).map((s) => [s.business_id, s.score as number])
  );

  const sorted = businesses
    .map((b) => ({ ...b, score: scoresMap.get(b.id) ?? 0 }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

  const currentIndex = sorted.findIndex((b) => b.id === businessId);
  if (currentIndex === -1) return null;

  const current = sorted[currentIndex];
  const above = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const below =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return {
    above: above
      ? {
          name: above.name,
          score: above.score,
          rank: currentIndex,
          slug: above.slug,
        }
      : null,
    current: {
      name: current.name,
      score: current.score,
      rank: currentIndex + 1,
      slug: current.slug,
    },
    below: below
      ? {
          name: below.name,
          score: below.score,
          rank: currentIndex + 2,
          slug: below.slug,
        }
      : null,
    total: sorted.length,
  };
}

export async function getTopBusinessForTownTrade(
  town: string,
  trade: string
): Promise<{ name: string; score: number; slug: string } | null> {
  const { data } = await supabase
    .from('rankings')
    .select('business:businesses!inner(name, slug), business_id')
    .eq('town', town)
    .eq('trade', trade)
    .eq('rank', 1)
    .single();

  if (!data) return null;

  const { data: score } = await supabase
    .from('scores')
    .select('score')
    .eq('business_id', data.business_id)
    .single();

  const biz = data.business as unknown as { name: string; slug: string };
  return {
    name: biz.name,
    score: score?.score || 0,
    slug: biz.slug,
  };
}

export async function getTradesForTown(town: string): Promise<string[]> {
  const { data } = await supabase
    .from('rankings')
    .select('trade')
    .eq('town', town);

  if (!data) return [];
  return [...new Set(data.map((r) => r.trade))];
}

export async function getTownsForTrade(trade: string): Promise<string[]> {
  const { data } = await supabase
    .from('rankings')
    .select('town')
    .eq('trade', trade);

  if (!data) return [];
  return [...new Set(data.map((r) => r.town))];
}

export async function getScoreHistory(businessId: string) {
  const { data } = await supabase
    .from('score_history')
    .select('*')
    .eq('business_id', businessId)
    .order('week_of', { ascending: true })
    .limit(12);

  return data || [];
}
