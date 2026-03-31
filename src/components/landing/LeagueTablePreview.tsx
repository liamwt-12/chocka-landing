'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { townSlug, tradeSlug, getBandColor } from '@/lib/constants';
import FadeIn from '../shared/FadeIn';

const TABS = ['Plumber', 'Electrician', 'Gas Engineer', 'Roofer'];
const TOWN = 'Newcastle upon Tyne';

interface TableEntry {
  rank: number;
  name: string;
  slug: string;
  star_rating: number | null;
  review_count: number | null;
  score: number;
  band: string;
  is_claimed: boolean;
}

export default function LeagueTablePreview() {
  const [activeTrade, setActiveTrade] = useState('Plumber');
  const [entries, setEntries] = useState<TableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchData(activeTrade);
  }, [activeTrade]);

  async function fetchData(trade: string) {
    setLoading(true);

    const { data: rankings } = await supabase
      .from('rankings')
      .select(
        'rank, business_id, updated_at, business:businesses!inner(name, slug)'
      )
      .eq('town', TOWN)
      .eq('trade', trade)
      .order('rank', { ascending: true })
      .limit(5);

    if (!rankings?.length) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const businessIds = rankings.map((r) => r.business_id);

    const [scoresResult, claimsResult] = await Promise.all([
      supabase
        .from('scores')
        .select('business_id, score, band, star_rating, review_count')
        .in('business_id', businessIds),
      supabase
        .from('claimed_listings')
        .select('business_id')
        .in('business_id', businessIds),
    ]);

    const scoresMap = new Map(
      (scoresResult.data || []).map((s) => [s.business_id, s])
    );
    const claimsSet = new Set(
      (claimsResult.data || []).map((c) => c.business_id)
    );

    if (rankings[0]?.updated_at) {
      setLastUpdated(
        new Date(rankings[0].updated_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    }

    setEntries(
      rankings.map((r) => {
        const biz = r.business as unknown as { name: string; slug: string };
        const score = scoresMap.get(r.business_id);
        return {
          rank: r.rank,
          name: biz.name,
          slug: biz.slug,
          star_rating: score?.star_rating ?? null,
          review_count: score?.review_count ?? null,
          score: score?.score ?? 0,
          band: score?.band ?? 'poor',
          is_claimed: claimsSet.has(r.business_id),
        };
      })
    );
    setLoading(false);
  }

  return (
    <FadeIn>
      <section className="section-padding bg-cream" id="league-table">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-black">
                  Top {activeTrade}s in {TOWN}
                </h2>
                <span className="inline-flex items-center gap-1.5 bg-green/10 text-green text-xs font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-dot" />
                  LIVE
                </span>
              </div>
              {lastUpdated && (
                <p className="text-mid text-sm">Last updated {lastUpdated}</p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
            {TABS.map((trade) => (
              <button
                key={trade}
                onClick={() => setActiveTrade(trade)}
                className={`px-5 py-2.5 rounded-lg font-heading font-bold text-sm whitespace-nowrap transition-all ${
                  activeTrade === trade
                    ? 'bg-orange text-white'
                    : 'bg-white text-mid hover:text-black hover:bg-white/80'
                }`}
              >
                {trade}s
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-soft/20 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-mid">
                Loading rankings...
              </div>
            ) : entries.length === 0 ? (
              <div className="p-12 text-center text-mid">
                No rankings available yet.
              </div>
            ) : (
              <div className="divide-y divide-soft/10">
                {entries.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/rankings/profile/${entry.slug}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-cream/50 transition-colors"
                  >
                    {/* Rank */}
                    <div className="font-heading font-extrabold text-2xl text-soft/60 w-8 text-center shrink-0">
                      {entry.rank}
                    </div>

                    {/* Name + details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-bold text-black text-lg flex items-center gap-2">
                        <span className="truncate">{entry.name}</span>
                        {entry.is_claimed && (
                          <span className="inline-flex items-center gap-1 bg-green/10 text-green text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-mid">
                        {entry.star_rating != null && (
                          <span>{entry.star_rating.toFixed(1)}★</span>
                        )}
                        {entry.review_count != null && (
                          <span>{entry.review_count} reviews</span>
                        )}
                      </div>
                    </div>

                    {/* Score pill */}
                    <div
                      className={`shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-heading font-bold ${getBandColor(
                        entry.band
                      )}`}
                    >
                      {entry.score}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 bg-cream/30 border-t border-soft/10">
              <Link
                href={`/index/${townSlug(TOWN)}/${tradeSlug(activeTrade)}`}
                className="text-orange font-heading font-bold text-sm hover:underline"
              >
                See full {activeTrade.toLowerCase()} rankings in {TOWN} →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
