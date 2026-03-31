/**
 * Fix Rankings — backfill missing rankings rows
 *
 * The rankings table has fewer rows than businesses/scores.
 * This script queries all businesses joined to scores, groups by
 * town + trade, ranks by score DESC (review_count DESC tiebreaker),
 * and upserts every row into the rankings table.
 *
 * Usage: npx tsx scripts/fix-rankings.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // 1. Get current rankings count
  const { count: beforeCount } = await supabase
    .from('rankings')
    .select('*', { count: 'exact', head: true });
  console.log(`Rankings before: ${beforeCount}`);

  // 2. Fetch all businesses with their scores
  //    Supabase caps .select() at 1000 rows by default — paginate to get all
  const allBusinesses: {
    id: string;
    trade: string;
    town: string;
    score: number;
    review_count: number;
  }[] = [];

  let offset = 0;
  const PAGE = 1000;

  while (true) {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, trade, town, scores(score, review_count)')
      .range(offset, offset + PAGE - 1);

    if (error) {
      console.error('Error fetching businesses:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;

    for (const biz of data) {
      const scores = biz.scores as unknown;
      let score = 0;
      let reviewCount = 0;

      if (Array.isArray(scores) && scores.length > 0) {
        score = (scores[0] as { score: number; review_count: number }).score ?? 0;
        reviewCount = (scores[0] as { score: number; review_count: number }).review_count ?? 0;
      } else if (scores && typeof scores === 'object' && !Array.isArray(scores)) {
        score = (scores as { score: number; review_count: number }).score ?? 0;
        reviewCount = (scores as { score: number; review_count: number }).review_count ?? 0;
      }

      allBusinesses.push({
        id: biz.id,
        trade: biz.trade,
        town: biz.town,
        score,
        review_count: reviewCount,
      });
    }

    if (data.length < PAGE) break;
    offset += PAGE;
  }

  console.log(`Fetched ${allBusinesses.length} businesses with scores`);

  // 3. Group by town + trade
  const groups = new Map<string, typeof allBusinesses>();
  for (const biz of allBusinesses) {
    const key = `${biz.town}|||${biz.trade}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(biz);
  }

  console.log(`Found ${groups.size} town/trade groups`);

  // 4. Within each group, sort and assign ranks, then upsert
  let totalUpserted = 0;

  for (const [key, businesses] of groups) {
    const [town, trade] = key.split('|||');

    // Sort by score DESC, then review_count DESC
    businesses.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.review_count - a.review_count;
    });

    // Build upsert rows
    const rows = businesses.map((biz, index) => ({
      business_id: biz.id,
      trade,
      town,
      rank: index + 1,
      previous_rank: null as number | null,
      movement: null as number | null,
      updated_at: new Date().toISOString(),
    }));

    // Upsert in batches of 500 (Supabase limit)
    const BATCH = 500;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const { error } = await supabase
        .from('rankings')
        .upsert(batch, { onConflict: 'business_id,trade,town' });

      if (error) {
        console.error(`Error upserting ${town} / ${trade}:`, error.message);
      } else {
        totalUpserted += batch.length;
      }
    }
  }

  console.log(`Upserted ${totalUpserted} ranking rows`);

  // 5. Verify final count
  const { count: afterCount } = await supabase
    .from('rankings')
    .select('*', { count: 'exact', head: true });
  console.log(`Rankings after: ${afterCount}`);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
