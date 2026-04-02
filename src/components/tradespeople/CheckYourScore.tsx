'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NE_TOWNS, TRADES, getBandColor } from '@/lib/constants';
import FadeIn from '../shared/FadeIn';

/* ── Types ── */

interface Candidate {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
}

interface ScoreResult {
  name: string;
  score: number;
  band: string;
  placeId: string;
  breakdown: {
    starScore: number;
    reviewScore: number;
    recencyScore: number;
    completenessScore: number;
    responseScore: number;
  };
  rating: number;
  reviewCount: number;
}

interface ClaimResult {
  slug: string;
  rank: number;
  totalInTrade: number;
}

type Step = 'search' | 'candidates' | 'score' | 'claimed';

/* ── Constants ── */

const BAND_LABELS: Record<string, string> = {
  poor: 'Poor',
  fair: 'Fair',
  good: 'Good',
  excellent: 'Excellent',
};

const BREAKDOWN_ITEMS: { key: keyof ScoreResult['breakdown']; label: string; max: number }[] = [
  { key: 'starScore', label: 'Star Rating', max: 40 },
  { key: 'reviewScore', label: 'Review Volume', max: 25 },
  { key: 'recencyScore', label: 'Review Recency', max: 15 },
  { key: 'completenessScore', label: 'Profile Completeness', max: 10 },
  { key: 'responseScore', label: 'Response Rate', max: 10 },
];

/* ── Helpers ── */

function scoreBarColor(band: string) {
  switch (band) {
    case 'excellent': return 'bg-emerald-500';
    case 'good': return 'bg-amber-500';
    case 'fair': return 'bg-orange';
    case 'poor': return 'bg-red-500';
    default: return 'bg-orange';
  }
}

function scoreTextColor(band: string) {
  switch (band) {
    case 'excellent': return 'text-emerald-400';
    case 'good': return 'text-amber-400';
    case 'fair': return 'text-orange';
    case 'poor': return 'text-red-400';
    default: return 'text-orange';
  }
}

function getWeakest(breakdown: ScoreResult['breakdown']): string {
  let worst = BREAKDOWN_ITEMS[0];
  let worstRatio = 1;
  for (const item of BREAKDOWN_ITEMS) {
    const ratio = breakdown[item.key] / item.max;
    if (ratio < worstRatio) {
      worstRatio = ratio;
      worst = item;
    }
  }
  return worst.label;
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}

/* ── Component ── */

export default function CheckYourScore() {
  const [step, setStep] = useState<Step>('search');

  // Form
  const [businessName, setBusinessName] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('');

  // Candidates
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Score
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [rankEstimate, setRankEstimate] = useState<{ rank: number; total: number } | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  // Existing DB result (pre-check)
  const [dbResult, setDbResult] = useState<{
    name: string; score: number; band: string; rank: number;
    total_in_trade: number; trade: string; town: string;
  } | null>(null);

  // Claim
  const [email, setEmail] = useState('');
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);

  // Loading / error
  const [searching, setSearching] = useState(false);
  const [scoringId, setScoringId] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');

  // Count-up animation
  useEffect(() => {
    if (!scoreResult) return;
    const target = scoreResult.score;
    const duration = 800;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scoreResult]);

  /* ── Search handler ── */
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !selectedTown || !selectedTrade) return;

    setSearching(true);
    setError('');
    setDbResult(null);
    setCandidates([]);
    setScoreResult(null);
    setClaimResult(null);
    setRankEstimate(null);

    const trimmedName = businessName.trim();

    // Pre-check: is this business already in Supabase?
    let { data: businesses } = await supabase
      .from('businesses')
      .select('id, name, trade, town')
      .eq('town', selectedTown)
      .eq('trade', selectedTrade)
      .ilike('name', `%${trimmedName}%`)
      .limit(1);

    if (!businesses?.length) {
      const firstWord = trimmedName.split(/\s+/)[0];
      if (firstWord && firstWord.length >= 2) {
        const fallback = await supabase
          .from('businesses')
          .select('id, name, trade, town')
          .eq('town', selectedTown)
          .eq('trade', selectedTrade)
          .ilike('name', `%${firstWord}%`)
          .limit(1);
        businesses = fallback.data;
      }
    }

    if (businesses?.length) {
      const biz = businesses[0];
      const [scoreRes, rankRes, countRes] = await Promise.all([
        supabase.from('scores').select('score, band').eq('business_id', biz.id).single(),
        supabase.from('rankings').select('rank').eq('business_id', biz.id).eq('town', biz.town).eq('trade', biz.trade).single(),
        supabase.from('rankings').select('*', { count: 'exact', head: true }).eq('town', biz.town).eq('trade', biz.trade),
      ]);
      setDbResult({
        name: biz.name,
        score: scoreRes.data?.score ?? 0,
        band: scoreRes.data?.band ?? 'poor',
        rank: rankRes.data?.rank ?? 0,
        total_in_trade: countRes.count ?? 0,
        trade: biz.trade,
        town: biz.town,
      });
      setStep('score');
      setSearching(false);
      return;
    }

    // Not in DB — search Google Places
    try {
      const res = await fetch('/api/check-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: trimmedName, town: selectedTown, trade: selectedTrade }),
      });
      const data = await res.json();

      if (data.candidates?.length) {
        setCandidates(data.candidates);
        setStep('candidates');
      } else {
        setError(`We couldn't find "${trimmedName}" in ${selectedTown}. Try a different spelling or check your Google Business Profile is live.`);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setSearching(false);
  }

  /* ── Select candidate ── */
  async function handleSelect(placeId: string) {
    setScoringId(placeId);
    setError('');

    try {
      const res = await fetch('/api/get-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });
      const data = await res.json();

      if (!data.found) {
        setError('Could not calculate score. Please try again.');
        setScoringId(null);
        return;
      }

      setScoreResult({
        name: data.name,
        score: data.score,
        band: data.band,
        placeId: data.placeId,
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

      // Estimate rank from existing Supabase rankings
      const { data: existing, count } = await supabase
        .from('rankings')
        .select('business_id, businesses!inner(trade, town)', { count: 'exact' })
        .eq('businesses.town', selectedTown)
        .eq('businesses.trade', selectedTrade);

      if (existing?.length) {
        const ids = existing.map((r: { business_id: string }) => r.business_id);
        const { data: scores } = await supabase
          .from('scores')
          .select('score')
          .in('business_id', ids)
          .order('score', { ascending: false });

        const sortedScores = (scores ?? []).map((s: { score: number }) => s.score);
        let pos = sortedScores.findIndex((s: number) => data.score >= s);
        if (pos === -1) pos = sortedScores.length;
        setRankEstimate({ rank: pos + 1, total: (count ?? sortedScores.length) + 1 });
      } else {
        setRankEstimate({ rank: 1, total: 1 });
      }

      setStep('score');
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setScoringId(null);
  }

  /* ── Claim handler ── */
  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    if (!scoreResult || !email.trim()) return;

    setClaiming(true);
    setError('');

    try {
      const res = await fetch('/api/claim-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: scoreResult.placeId,
          town: selectedTown,
          trade: selectedTrade,
          email: email.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setClaimResult({ slug: data.slug, rank: data.rank, totalInTrade: data.totalInTrade });
        setStep('claimed');
      } else {
        setError(data.error ?? 'Claim failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setClaiming(false);
  }

  /* ── Reset ── */
  function startOver() {
    setStep('search');
    setCandidates([]);
    setScoreResult(null);
    setDbResult(null);
    setClaimResult(null);
    setRankEstimate(null);
    setError('');
    setEmail('');
    setDisplayScore(0);
  }

  /* ── Render ── */
  return (
    <FadeIn>
      <section id="check-score" className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4">
            See where you actually rank
          </h2>
          <p className="text-white/50 text-lg mb-12">
            Type your business name, pick your trade and town. We&apos;ll
            calculate your real Chocka Score from your Google profile.
          </p>

          {/* ── STATE 1: Search Form ── */}
          {step === 'search' && (
            <>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name..."
                  className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
                />
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
                >
                  <option value="">Select trade...</option>
                  {TRADES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={selectedTown}
                  onChange={(e) => setSelectedTown(e.target.value)}
                  className="px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
                >
                  <option value="">Select town...</option>
                  {NE_TOWNS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={searching}
                  className="btn-primary py-4 px-8 rounded-xl flex items-center justify-center gap-2"
                >
                  {searching ? <><Spinner /> Searching...</> : 'Find My Business →'}
                </button>
              </form>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm animate-fade-in-up">
                  {error}
                </div>
              )}
            </>
          )}

          {/* ── STATE 2: Candidates ── */}
          {step === 'candidates' && (
            <div className="animate-fade-in-up">
              <h3 className="font-heading font-bold text-2xl text-white mb-6">
                Is this your business?
              </h3>
              <div className="space-y-3 mb-6">
                {candidates.map((c) => (
                  <div
                    key={c.placeId}
                    className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 flex items-center justify-between gap-4 text-left"
                  >
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-white truncate">
                        {c.name}
                      </div>
                      <div className="text-white/40 text-sm truncate">
                        {c.address}
                      </div>
                      <div className="text-white/50 text-xs mt-1">
                        {c.rating > 0 && <>{c.rating.toFixed(1)}★</>}
                        {c.reviewCount > 0 && <> · {c.reviewCount} reviews</>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelect(c.placeId)}
                      disabled={scoringId === c.placeId}
                      className="btn-secondary py-2.5 px-5 rounded-xl text-sm flex-shrink-0 flex items-center gap-2"
                    >
                      {scoringId === c.placeId ? <><Spinner /> Scoring...</> : "That's me →"}
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={startOver} className="text-white/40 hover:text-white/60 text-sm transition-colors">
                ← Search again
              </button>
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* ── STATE 3: Score Result ── */}
          {step === 'score' && (dbResult || scoreResult) && (
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 text-left animate-fade-in-up">
              {/* DB result (existing business) */}
              {dbResult && !scoreResult && (
                <>
                  <h3 className="font-heading font-bold text-xl text-white mb-6">
                    {dbResult.name}
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-6 mb-6">
                    <div>
                      <div className="text-white/40 text-xs font-mono uppercase mb-1">Chocka Score</div>
                      <div className={`font-heading font-extrabold text-5xl ${scoreTextColor(dbResult.band)}`}>
                        {dbResult.score}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs font-mono uppercase mb-1">Band</div>
                      <div className={`inline-flex px-3 py-1.5 rounded-full text-sm font-heading font-bold ${getBandColor(dbResult.band)}`}>
                        {BAND_LABELS[dbResult.band]}
                      </div>
                    </div>
                    {dbResult.rank > 0 && (
                      <div>
                        <div className="text-white/40 text-xs font-mono uppercase mb-1">Rank</div>
                        <div className="font-heading font-bold text-2xl text-white">
                          #{dbResult.rank}{' '}
                          <span className="text-white/40 text-base">
                            of {dbResult.total_in_trade} {dbResult.trade}s in {dbResult.town}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-6">
                    <div className={`h-full rounded-full ${scoreBarColor(dbResult.band)}`} style={{ width: `${dbResult.score}%` }} />
                  </div>
                  {dbResult.score < 100 && (
                    <p className="text-white/50 text-sm mb-6">
                      Your score could be{' '}
                      <span className="text-orange font-bold">{100 - dbResult.score} points higher</span>{' '}
                      with Chocka.
                    </p>
                  )}
                  <a href="https://app.chocka.co.uk/login" className="btn-primary inline-flex">
                    Improve Your Score — £29/month →
                  </a>
                  <button onClick={startOver} className="block mt-4 text-white/40 hover:text-white/60 text-sm transition-colors">
                    ← Search again
                  </button>
                </>
              )}

              {/* Live result */}
              {scoreResult && (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="font-heading font-bold text-xl text-white">
                      {scoreResult.name}
                    </h3>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full flex-shrink-0 ml-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  <p className="text-amber-400/70 text-sm mb-6 border border-amber-400/20 rounded-lg px-4 py-3 bg-amber-400/5">
                    Live score — calculated now from your Google profile.
                  </p>

                  {/* Score + Band */}
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-white/40 text-xs font-mono uppercase mb-1">Chocka Score</div>
                      <div className={`font-heading font-extrabold text-5xl ${scoreTextColor(scoreResult.band)}`}>
                        {displayScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/40 text-xs font-mono uppercase mb-1">Band</div>
                      <div className={`inline-flex px-3 py-1.5 rounded-full text-sm font-heading font-bold ${getBandColor(scoreResult.band)}`}>
                        {BAND_LABELS[scoreResult.band]}
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="w-full bg-white/10 rounded-full h-3 mb-6">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(scoreResult.band)}`}
                      style={{ width: `${displayScore}%` }}
                    />
                  </div>

                  {/* Breakdown cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    {BREAKDOWN_ITEMS.map(({ key, label, max }) => (
                      <div key={key} className="bg-white/5 rounded-xl px-3 py-3 text-center">
                        <div className="text-white/40 text-[10px] font-mono uppercase mb-1 leading-tight">
                          {label}
                        </div>
                        <div className="font-heading font-bold text-lg text-white">
                          {scoreResult.breakdown[key]}
                          <span className="text-white/30 text-xs">/{max}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Weakest signal */}
                  <div className="bg-orange/10 border border-orange/20 rounded-lg px-4 py-3 text-sm text-orange mb-6">
                    Your weakest area is <span className="font-bold">{getWeakest(scoreResult.breakdown)}</span>.
                    Chocka improves this automatically.
                  </div>

                  {/* Rank estimate */}
                  {rankEstimate && (
                    <p className="text-white/50 text-sm mb-6">
                      Based on your score, you&apos;d rank approximately{' '}
                      <span className="text-white font-heading font-bold">
                        #{rankEstimate.rank}
                      </span>{' '}
                      of {rankEstimate.total} {selectedTrade}s in {selectedTown}.
                    </p>
                  )}

                  {/* Google stats */}
                  <div className="flex gap-4 text-sm text-white/50 mb-8">
                    {scoreResult.rating > 0 && (
                      <span>Google rating: <span className="text-white font-heading font-bold">{scoreResult.rating.toFixed(1)}★</span></span>
                    )}
                    {scoreResult.reviewCount > 0 && (
                      <span>Reviews: <span className="text-white font-heading font-bold">{scoreResult.reviewCount}</span></span>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://app.chocka.co.uk/login"
                      className="btn-primary py-3.5 px-6 rounded-xl text-center"
                    >
                      Improve Your Score — £29/month →
                    </a>
                    <button
                      onClick={() => setStep('claimed')}
                      className="btn-secondary py-3.5 px-6 rounded-xl"
                    >
                      Claim this profile free →
                    </button>
                  </div>
                  <button onClick={startOver} className="block mt-4 text-white/40 hover:text-white/60 text-sm transition-colors">
                    ← Search again
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STATE 4: Claim Flow ── */}
          {step === 'claimed' && scoreResult && !claimResult && (
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 animate-fade-in-up">
              <h3 className="font-heading font-bold text-xl text-white mb-2">
                Claim {scoreResult.name}
              </h3>
              <p className="text-white/50 text-sm mb-6">
                Enter your email to add this business to the Chocka Index for free.
              </p>
              <form onSubmit={handleClaim} className="flex gap-3 max-w-md mx-auto">
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
                  disabled={claiming}
                  className="btn-primary py-3 px-6 rounded-xl flex items-center gap-2"
                >
                  {claiming ? <><Spinner /> Claiming...</> : 'Claim Profile →'}
                </button>
              </form>
              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button onClick={() => setStep('score')} className="block mt-4 mx-auto text-white/40 hover:text-white/60 text-sm transition-colors">
                ← Back to score
              </button>
            </div>
          )}

          {/* Claim success */}
          {step === 'claimed' && claimResult && scoreResult && (
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 animate-fade-in-up text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-400 text-xl">✓</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">
                {scoreResult.name} has been added to the Chocka Index.
              </h3>
              {claimResult.rank > 0 && (
                <p className="text-white/50 mb-4">
                  Ranked <span className="text-white font-heading font-bold">#{claimResult.rank}</span> of{' '}
                  {claimResult.totalInTrade} {selectedTrade}s in {selectedTown}.
                </p>
              )}
              <p className="text-white/50 text-sm mb-8">
                We&apos;ll email you when your ranking is live.
              </p>
              <a href="https://app.chocka.co.uk/login" className="btn-primary inline-flex">
                Improve Your Score — £29/month →
              </a>
              <button onClick={startOver} className="block mt-4 mx-auto text-white/40 hover:text-white/60 text-sm transition-colors">
                ← Check another business
              </button>
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}
