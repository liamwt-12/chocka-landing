'use client';

import { useState, useEffect } from 'react';

/* ── Types ── */

interface Candidate {
  placeId: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
}

interface ScoreComponents {
  starScore: number;
  reviewScore: number;
  recencyScore: number;
  completeness: number;
  responseScore: number;
  activityScore: number;
}

interface ScoreResult {
  name: string;
  score: number;
  band: string;
  placeId: string;
  components: ScoreComponents;
  hiddenComponents: string[];
  rating: number;
  reviewCount: number;
}

type Step = 'search' | 'candidates' | 'score';

/* ── Constants ── */

const UK_POSTCODE_HINT = 'e.g. NE1 4ST';

const BAND_LABELS: Record<string, string> = {
  poor: 'Poor',
  fair: 'Fair',
  good: 'Good',
  excellent: 'Excellent',
};

const VISIBLE_COMPONENTS: {
  key: keyof ScoreComponents;
  label: string;
  max: number;
}[] = [
  { key: 'starScore', label: 'Star Rating', max: 40 },
  { key: 'reviewScore', label: 'Review Volume', max: 25 },
  { key: 'completeness', label: 'Profile Completeness', max: 10 },
];

const HIDDEN_COMPONENTS: { label: string; max: number }[] = [
  { label: 'Review Recency', max: 15 },
  { label: 'Response Rate', max: 10 },
  { label: 'Activity', max: 6 },
];

/* ── Helpers ── */

function bandBarColor(band: string) {
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

function bandTextColor(band: string) {
  switch (band) {
    case 'excellent':
      return 'text-emerald-600';
    case 'good':
      return 'text-amber-600';
    case 'fair':
      return 'text-orange';
    case 'poor':
      return 'text-red-600';
    default:
      return 'text-orange';
  }
}

function bandBgColor(band: string) {
  switch (band) {
    case 'excellent':
      return 'bg-emerald-50 text-emerald-800';
    case 'good':
      return 'bg-amber-50 text-amber-800';
    case 'fair':
      return 'bg-orange/10 text-orange';
    case 'poor':
      return 'bg-red-50 text-red-800';
    default:
      return 'bg-orange/10 text-orange';
  }
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin ${className}`}
    />
  );
}

/* ── Component ── */

export default function ScoreChecker() {
  const [step, setStep] = useState<Step>('search');

  // Form
  const [businessName, setBusinessName] = useState('');
  const [postcode, setPostcode] = useState('');

  // Candidates
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Score
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  // Loading / error
  const [searching, setSearching] = useState(false);
  const [scoringId, setScoringId] = useState<string | null>(null);
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

  /* ── Search ── */
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim() || !postcode.trim()) return;

    setSearching(true);
    setError('');
    setCandidates([]);
    setScoreResult(null);

    try {
      const res = await fetch('/api/check-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: businessName.trim(),
          postcode: postcode.trim(),
        }),
      });
      const data = await res.json();

      if (data.candidates?.length) {
        setCandidates(data.candidates);
        setStep('candidates');
      } else {
        setError(
          'We couldn\u2019t find your business. Try a different spelling or a closer postcode.'
        );
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
        components: data.components,
        hiddenComponents: data.hiddenComponents,
        rating: data.rating,
        reviewCount: data.reviewCount,
      });

      setStep('score');
    } catch {
      setError('Something went wrong. Please try again.');
    }

    setScoringId(null);
  }

  /* ── Reset ── */
  function startOver() {
    setStep('search');
    setCandidates([]);
    setScoreResult(null);
    setError('');
    setDisplayScore(0);
  }

  /* ── Render ── */
  return (
    <section className="section-padding pt-10 md:pt-14">
      <div className="container-max max-w-2xl mx-auto">
        {/* ── Search Form ── */}
        {step === 'search' && (
          <div className="animate-fade-in-up">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl p-6 md:p-8 border border-soft/20 shadow-sm"
            >
              <div className="grid gap-4 mb-5">
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium text-mid mb-1.5"
                  >
                    Business name
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business name"
                    className="w-full px-4 py-3.5 rounded-xl border border-soft/30 bg-warm text-black placeholder:text-soft font-body focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="postcode"
                    className="block text-sm font-medium text-mid mb-1.5"
                  >
                    Postcode
                  </label>
                  <input
                    id="postcode"
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder={UK_POSTCODE_HINT}
                    className="w-full px-4 py-3.5 rounded-xl border border-soft/30 bg-warm text-black placeholder:text-soft font-body focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-orange/40"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={searching}
                className="btn-primary w-full justify-center"
              >
                {searching ? (
                  <>
                    <Spinner /> Looking up your profile...
                  </>
                ) : (
                  'Check my score'
                )}
              </button>
            </form>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm animate-fade-in-up">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── Candidates ── */}
        {step === 'candidates' && (
          <div className="animate-fade-in-up">
            <h2 className="font-heading font-bold text-2xl text-black mb-2 text-center">
              Is this your business?
            </h2>
            <p className="text-mid text-sm mb-6 text-center">
              Pick the right one and we&apos;ll score it instantly.
            </p>
            <div className="space-y-3 mb-6">
              {candidates.map((c) => (
                <div
                  key={c.placeId}
                  className="bg-white rounded-xl p-5 border border-soft/20 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-black truncate">
                      {c.name}
                    </div>
                    <div className="text-mid text-sm truncate">{c.address}</div>
                    <div className="text-soft text-xs mt-1">
                      {c.rating > 0 && <>{c.rating.toFixed(1)} stars</>}
                      {c.reviewCount > 0 && <> · {c.reviewCount} reviews</>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelect(c.placeId)}
                    disabled={scoringId === c.placeId}
                    className="btn-secondary py-2.5 px-5 rounded-xl text-sm flex-shrink-0 flex items-center gap-2"
                  >
                    {scoringId === c.placeId ? (
                      <>
                        <Spinner /> Scoring...
                      </>
                    ) : (
                      "That's me"
                    )}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={startOver}
              className="block mx-auto text-mid hover:text-black text-sm transition-colors"
            >
              Search again
            </button>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── Score Result ── */}
        {step === 'score' && scoreResult && (
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-soft/20 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-heading font-bold text-xl text-black">
                    {scoreResult.name}
                  </h2>
                  <div className="text-soft text-xs mt-1 flex items-center gap-2">
                    {scoreResult.rating > 0 && (
                      <span>
                        {scoreResult.rating.toFixed(1)} stars on Google
                      </span>
                    )}
                    {scoreResult.reviewCount > 0 && (
                      <span>· {scoreResult.reviewCount} reviews</span>
                    )}
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex-shrink-0 ml-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Big score */}
              <div className="text-center mb-6">
                <div
                  className={`font-heading font-extrabold text-7xl md:text-8xl ${bandTextColor(scoreResult.band)} transition-colors duration-300`}
                >
                  {displayScore}
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex px-3 py-1.5 rounded-full text-sm font-heading font-bold ${bandBgColor(scoreResult.band)}`}
                  >
                    {BAND_LABELS[scoreResult.band]}
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full bg-cream rounded-full h-3 mb-8 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${bandBarColor(scoreResult.band)}`}
                  style={{ width: `${displayScore}%` }}
                />
              </div>

              {/* Visible component breakdown */}
              <h3 className="font-heading font-bold text-sm text-black mb-3 uppercase tracking-wider">
                Your breakdown
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {VISIBLE_COMPONENTS.map(({ key, label, max }) => (
                  <div
                    key={key}
                    className="bg-warm rounded-xl px-3 py-4 text-center"
                  >
                    <div className="text-mid text-[10px] font-mono uppercase mb-1 leading-tight">
                      {label}
                    </div>
                    <div className="font-heading font-bold text-xl text-black">
                      {scoreResult.components[key]}
                      <span className="text-soft text-xs">/{max}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hidden components */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {HIDDEN_COMPONENTS.map(({ label, max }) => (
                  <div
                    key={label}
                    className="bg-cream/50 rounded-xl px-3 py-4 text-center border border-dashed border-soft/30"
                  >
                    <div className="text-soft text-[10px] font-mono uppercase mb-1 leading-tight">
                      {label}
                    </div>
                    <div className="font-heading font-bold text-xl text-soft">
                      ?<span className="text-xs">/{max}</span>
                    </div>
                    <div className="text-soft text-[9px] mt-1">
                      Unlock with full connection
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip */}
              <div className="bg-orange/5 border border-orange/15 rounded-xl px-4 py-3 text-sm text-mid mb-8">
                Your score only includes publicly visible data. Connect your
                profile to unlock recency, response rate, and activity scoring
                for a complete picture.
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://app.chocka.co.uk/login"
                  className="btn-primary justify-center flex-1"
                >
                  Fix my profile · from £29/mo
                </a>
                <a
                  href="/for-tradespeople"
                  className="btn-secondary justify-center flex-1"
                >
                  Learn more
                </a>
              </div>
            </div>

            <button
              onClick={startOver}
              className="block mx-auto mt-5 text-mid hover:text-black text-sm transition-colors"
            >
              Check another business
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
