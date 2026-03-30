import { supabase } from './supabase';
import { LeagueTableEntry, Business, Score, BusinessWithScore } from './types';

export async function getLeagueTable(
  town: string,
  trade: string,
  order: 'asc' | 'desc' = 'asc',
  limit: number = 10
): Promise<LeagueTableEntry[]> {
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
    .eq('trade', trade)
    .order('rank', { ascending: order === 'asc' })
    .limit(limit);

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

  return data.map((row) => {
    const business = row.business as unknown as Business;
    const score = scoresMap.get(row.business_id) as Score;
    const claim = claimsMap.get(row.business_id);

    return {
      rank: row.rank,
      previous_rank: row.previous_rank,
      movement: row.movement,
      business,
      score: score || {
        id: '',
        business_id: row.business_id,
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
      },
      is_claimed: !!claim,
      is_chocka_customer: claim?.chocka_customer || false,
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
  return data as unknown as BusinessWithScore;
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
