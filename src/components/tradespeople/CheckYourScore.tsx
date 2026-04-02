'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { NE_TOWNS, getBandColor } from '@/lib/constants';
import FadeIn from '../shared/FadeIn';

interface ScoreResult {
  name: string;
  score: number;
  band: string;
  rank: number;
  total_in_trade: number;
  trade: string;
  town: string;
  isLive: boolean;
  breakdown?: {
    starScore: number;
    reviewScore: number;
    recencyScore: number;
    completenessScore: number;
    responseScore: number;
  };
  rating?: number;
  reviewCount?: number;
}

const BAND_LABELS: Record<string, string> = {
  poor: 'Poor',
  fair: 'Fair',
  good: 'Good',
  excellent: 'Excellent',
};

function scoreBarColor(band: string) {
  switch (band) {
    case 'excellent':
      return 'bg-emerald-500';
    case 'good':
      return 'bg-amber-500';
    case 'fair':
      return 'bg-orange';
    case 'poor':
      return 'bg-red-500';
    default:
      return 'bg-orange';
  }
}

function scoreTextColor(band: string) {
  switch (band) {
    case 'excellent':
      return 'text-emerald-400';
    case 'good':
      return 'text-amber-400';
    case 'fair':
      return 'text-orange';
    case 'poor':
      return 'text-red-400';
    default:
      return 'text-orange';
  }
}

const BREAKDOWN_LABELS: { key: string; label: string; max: number }[] = [
  { key: 'starScore', label: 'Star Rating', max: 40 },
  { key: 'reviewScore', label: 'Review Volume', max: 25 },
  { key: 'recencyScore', label: 'Review Recency', max: 15 },
  { key: 'completenessScore', label: 'Profile Completeness', max: 10 },
  { key: 'responseScore', label: 'Response Rate', max: 10 },
];

export default function CheckYourScore() {
  const [businessName, setBusinessName] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !selectedTown) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);

    const trimmedName = businessName.trim();

    // Try full name partial match first
    let { data: businesses } = await supabase
      .from('businesses')
      .select('id, name, trade, town')
      .eq('town', selectedTown)
      .ilike('name', `%${trimmedName}%`)
      .limit(1);

    // Fallback: try matching just the first word of the business name
    if (!businesses?.length) {
      const firstWord = trimmedName.split(/\s+/)[0];
      if (firstWord && firstWord.length >= 2) {
        const fallback = await supabase
          .from('businesses')
          .select('id, name, trade, town')
          .eq('town', selectedTown)
          .ilike('name', `%${firstWord}%`)
          .limit(1);
        businesses = fallback.data;
      }
    }

    // Found in Supabase
    if (businesses?.length) {
      const biz = businesses[0];

      const [scoreResult, rankResult, countResult] = await Promise.all([
        supabase
          .from('scores')
          .select('score, band')
          .eq('business_id', biz.id)
          .single(),
        supabase
          .from('rankings')
          .select('rank')
          .eq('business_id', biz.id)
          .eq('town', biz.town)
          .eq('trade', biz.trade)
          .single(),
        supabase
          .from('rankings')
          .select('*', { count: 'exact', head: true })
          .eq('town', biz.town)
          .eq('trade', biz.trade),
      ]);

      setResult({
        name: biz.name,
        score: scoreResult.data?.score ?? 0,
        band: scoreResult.data?.band ?? 'poor',
        rank: rankResult.data?.rank ?? 0,
        total_in_trade: countResult.count ?? 0,
        trade: biz.trade,
        town: biz.town,
        isLive: false,
      });
      setLoading(false);
      return;
    }

    // Not in Supabase — try live Google Places lookup
    try {
      const res = await fetch('/api/check-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: trimmedName, town: selectedTown }),
      });
      const data = await res.json();

      if (data.found) {
        setResult({
          name: data.name,
          score: data.score,
          band: data.band,
          rank: 0,
          total_in_trade: 0,
          trade: '',
          town: selectedTown,
          isLive: true,
          breakdown: {
            starScore: data.starScore,
            reviewScore: data.reviewScore,
            recencyScore: data.recencyScore,
            completenessScore: data.completenessScore,
            responseScore: data.responseScore,
          },
          rating: data.rating,
          reviewCount: data.reviewCount,
        });
        setLoading(false);
        return;
      }
    } catch {
      // Live lookup failed — fall through to not-found
    }

    setNotFound(true);
    setLoading(false);
  }

  return (
    <FadeIn>
      <section
        id="check-score"
        className="py-20 md:py-28 px-6 md:px-12 lg:px-20"
      >
        <div className="container-max max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
            See where you actually rank
          </h2>
          <p className="text-white/50 text-lg mb-12">
            Type your business name and town. We&apos;ll show you your real
            Chocka Score from our Index.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your business name..."
              className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
            />
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
            >
              <option value="">Select town...</option>
              {NE_TOWNS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-4 px-8 rounded-xl"
            >
              {loading ? 'Searching...' : 'Check My Score →'}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 text-left animate-fade-in-up">
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-heading font-bold text-xl text-white">
                  {result.name}
                </h3>
                {result.isLive && (
                  <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full flex-shrink-0 ml-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {result.isLive && (
                <p className="text-amber-400/70 text-sm mb-6 border border-amber-400/20 rounded-lg px-4 py-3 bg-amber-400/5">
                  Live score — calculated now from your Google profile. Not yet
                  in the weekly Index.
                </p>
              )}

              <div className={`grid ${result.isLive ? 'sm:grid-cols-2' : 'sm:grid-cols-3'} gap-6 mb-6`}>
                <div>
                  <div className="text-white/40 text-xs font-mono uppercase mb-1">
                    Chocka Score
                  </div>
                  <div
                    className={`font-heading font-extrabold text-5xl ${scoreTextColor(
                      result.band
                    )}`}
                  >
                    {result.score}
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-xs font-mono uppercase mb-1">
                    Band
                  </div>
                  <div
                    className={`inline-flex px-3 py-1.5 rounded-full text-sm font-heading font-bold ${getBandColor(
                      result.band
                    )}`}
                  >
                    {BAND_LABELS[result.band]}
                  </div>
                </div>
                {!result.isLive && (
                  <div>
                    <div className="text-white/40 text-xs font-mono uppercase mb-1">
                      Rank
                    </div>
                    <div className="font-heading font-bold text-2xl text-white">
                      #{result.rank}{' '}
                      <span className="text-white/40 text-base">
                        of {result.total_in_trade} {result.trade}s in{' '}
                        {result.town}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Score bar */}
              <div className="w-full bg-white/10 rounded-full h-3 mb-6">
                <div
                  className={`h-full rounded-full ${scoreBarColor(
                    result.band
                  )}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>

              {/* Breakdown cards for live results */}
              {result.isLive && result.breakdown && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  {BREAKDOWN_LABELS.map(({ key, label, max }) => {
                    const value = result.breakdown![key as keyof typeof result.breakdown] ?? 0;
                    return (
                      <div
                        key={key}
                        className="bg-white/5 rounded-xl px-3 py-3 text-center"
                      >
                        <div className="text-white/40 text-[10px] font-mono uppercase mb-1 leading-tight">
                          {label}
                        </div>
                        <div className="font-heading font-bold text-lg text-white">
                          {value}
                          <span className="text-white/30 text-xs">/{max}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Google stats for live results */}
              {result.isLive && result.rating !== undefined && (
                <div className="flex gap-4 text-sm text-white/50 mb-6">
                  <span>
                    Google rating:{' '}
                    <span className="text-white font-heading font-bold">
                      {result.rating.toFixed(1)}★
                    </span>
                  </span>
                  <span>
                    Reviews:{' '}
                    <span className="text-white font-heading font-bold">
                      {result.reviewCount}
                    </span>
                  </span>
                </div>
              )}

              {result.score < 100 && (
                <p className="text-white/50 text-sm mb-6">
                  Your score could be{' '}
                  <span className="text-orange font-bold">
                    {100 - result.score} points higher
                  </span>{' '}
                  with Chocka.
                </p>
              )}

              <a
                href="https://app.chocka.co.uk/login"
                className="btn-primary inline-flex"
              >
                Connect Your Google Profile to improve your score →
              </a>
            </div>
          )}

          {/* Not found */}
          {notFound && (
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 animate-fade-in-up">
              <h3 className="font-heading font-bold text-xl text-white mb-2">
                We couldn&apos;t find &ldquo;{businessName}&rdquo;.
              </h3>
              <p className="text-white/50 mb-6">
                We add new businesses every week. Enter your email and
                we&apos;ll notify you when you&apos;re added.
              </p>
              {!emailSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEmailSubmitted(true);
                  }}
                  className="flex gap-3 max-w-md mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
                  />
                  <button
                    type="submit"
                    className="btn-primary py-3 px-6 rounded-xl"
                  >
                    Notify me
                  </button>
                </form>
              ) : (
                <p className="text-emerald-400 font-heading font-bold">
                  We&apos;ll let you know when your business is added.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}
