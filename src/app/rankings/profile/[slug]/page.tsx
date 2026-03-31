import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBusinessBySlug, getCompetitorContext } from '@/lib/data';
import { townSlug, tradeSlug, getBandColor } from '@/lib/constants';
import ScoreArc from '@/components/shared/ScoreArc';
import ChockaBadge from '@/components/shared/ChockaBadge';

export const revalidate = 604800;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const biz = await getBusinessBySlug(params.slug);
  if (!biz) return {};
  return {
    title: `${biz.name} — ${biz.trade} in ${biz.town} — Chocka Index`,
    description: `${biz.name} is a ${biz.trade.toLowerCase()} in ${biz.town}. See their Chocka Score, reviews, and ranking.`,
  };
}

function signalBarColor(score: number, max: number): string {
  const pct = max > 0 ? score / max : 0;
  if (pct > 0.8) return 'bg-emerald-500';
  if (pct >= 0.5) return 'bg-amber-500';
  return 'bg-red-500';
}

function signalBgColor(score: number, max: number): string {
  const pct = max > 0 ? score / max : 0;
  if (pct > 0.8) return 'bg-emerald-50 border-emerald-200';
  if (pct >= 0.5) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export default async function ProfilePage({ params }: Props) {
  const biz = await getBusinessBySlug(params.slug);
  if (!biz) notFound();

  const score = biz.scores;
  const ranking = biz.rankings;
  const isClaimed = biz.claimed_listings && biz.claimed_listings.length > 0;
  const isCustomer =
    biz.claimed_listings?.some((c) => c.chocka_customer) || false;

  const competitors = await getCompetitorContext(biz.id, biz.town, biz.trade);

  // Score breakdown signals
  const signals = score
    ? [
        {
          name: 'Star Rating',
          score: Math.round(((score.star_rating ?? 0) / 5) * 40),
          max: 40,
        },
        {
          name: 'Review Volume',
          score: Math.round(
            Math.min((score.review_count ?? 0) / 100, 1) * 25
          ),
          max: 25,
        },
        {
          name: 'Review Recency',
          score: score.recency_score ?? 0,
          max: 15,
        },
        {
          name: 'Profile Completeness',
          score: score.completeness_score ?? 0,
          max: 10,
        },
        {
          name: 'Response Rate',
          score: score.response_rate_score ?? 0,
          max: 10,
        },
      ]
    : [];

  const weakestSignal = signals.length
    ? signals.reduce((weakest, signal) => {
        const ratio = signal.max > 0 ? signal.score / signal.max : 1;
        const weakestRatio =
          weakest.max > 0 ? weakest.score / weakest.max : 1;
        return ratio < weakestRatio ? signal : weakest;
      })
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: biz.name,
    address: biz.address,
    telephone: biz.phone,
    url: biz.website,
    aggregateRating: score?.star_rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: score.star_rating,
          reviewCount: score.review_count,
        }
      : undefined,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="bg-black text-white section-padding pt-16 pb-12">
        <div className="container-max">
          <div className="flex items-center gap-2 text-sm text-soft mb-4">
            <Link href="/index" className="hover:text-orange">
              Index
            </Link>
            <span>/</span>
            <Link
              href={`/index/${townSlug(biz.town)}`}
              className="hover:text-orange"
            >
              {biz.town}
            </Link>
            <span>/</span>
            <Link
              href={`/index/${townSlug(biz.town)}/${tradeSlug(biz.trade)}`}
              className="hover:text-orange"
            >
              {biz.trade}s
            </Link>
            <span>/</span>
            <span className="text-white">{biz.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl">
              {biz.name}
            </h1>
            {isCustomer && <ChockaBadge />}
          </div>
          <p className="text-soft text-lg">
            {biz.trade} · {biz.town}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-cream py-6 border-b border-soft/20">
        <div className="container-max flex flex-wrap gap-8 px-6 md:px-12 lg:px-20">
          {score?.star_rating != null && (
            <div>
              <div className="font-heading font-bold text-2xl text-black">
                {score.star_rating.toFixed(1)}★
              </div>
              <div className="text-mid text-sm">Rating</div>
            </div>
          )}
          {score?.review_count != null && (
            <div>
              <div className="font-heading font-bold text-2xl text-black">
                {score.review_count}
              </div>
              <div className="text-mid text-sm">Reviews</div>
            </div>
          )}
          {ranking && (
            <div>
              <div className="font-heading font-bold text-2xl text-orange">
                #{ranking.rank}
              </div>
              <div className="text-mid text-sm">
                {biz.trade} in {biz.town}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-warm">
        <div className="container-max grid md:grid-cols-3 gap-12">
          {/* Left column — details */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="font-heading font-bold text-2xl text-black mb-4">
                Business Details
              </h2>
              <div className="bg-white rounded-xl p-6 border border-soft/20 space-y-3">
                {biz.address && (
                  <div className="flex justify-between">
                    <span className="text-mid">Address</span>
                    <span className="text-black font-medium">
                      {biz.address}
                    </span>
                  </div>
                )}
                {biz.phone && (
                  <div className="flex justify-between">
                    <span className="text-mid">Phone</span>
                    <a
                      href={`tel:${biz.phone}`}
                      className="text-orange font-medium hover:underline"
                    >
                      {biz.phone}
                    </a>
                  </div>
                )}
                {biz.website && (
                  <div className="flex justify-between">
                    <span className="text-mid">Website</span>
                    <a
                      href={biz.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange font-medium hover:underline truncate max-w-[200px]"
                    >
                      {biz.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {biz.google_maps_url && (
                  <div className="flex justify-between">
                    <span className="text-mid">Google Maps</span>
                    <a
                      href={biz.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange font-medium hover:underline"
                    >
                      View on Maps →
                    </a>
                  </div>
                )}
              </div>
            </div>

            {!isClaimed && (
              <div className="bg-orange/10 border border-orange/20 rounded-xl p-6 text-center">
                <h3 className="font-heading font-bold text-xl text-black mb-2">
                  Is this your business?
                </h3>
                <p className="text-mid mb-4">
                  Claim your profile to update your details and improve your
                  Chocka Score.
                </p>
                <Link
                  href={`/index/claim/${biz.slug}`}
                  className="btn-primary"
                >
                  Claim This Profile →
                </Link>
                <p className="text-soft text-sm mt-3">
                  Free to claim · Managed by Chocka from £29/mo
                </p>
              </div>
            )}

            {/* Score Breakdown — BUG 5 */}
            {score && signals.length > 0 && (
              <div>
                <h2 className="font-heading font-bold text-2xl text-black mb-4">
                  Score Breakdown
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {signals.map((signal) => {
                    const pct =
                      signal.max > 0
                        ? Math.round((signal.score / signal.max) * 100)
                        : 0;
                    return (
                      <div
                        key={signal.name}
                        className={`rounded-xl p-5 border ${signalBgColor(
                          signal.score,
                          signal.max
                        )}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-heading font-bold text-sm text-black">
                            {signal.name}
                          </span>
                          <span className="font-mono text-xs text-mid">
                            {signal.score}/{signal.max}pts
                          </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${signalBarColor(
                              signal.score,
                              signal.max
                            )}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {weakestSignal && (
                  <p className="text-mid text-sm mt-4">
                    Your weakest area is{' '}
                    <span className="font-bold text-black">
                      {weakestSignal.name.toLowerCase()}
                    </span>
                    . Chocka improves this automatically.
                  </p>
                )}
              </div>
            )}

            {/* Competitor Context — BUG 6 */}
            {competitors && (
              <div>
                <h2 className="font-heading font-bold text-2xl text-black mb-4">
                  How you compare
                </h2>
                <div className="bg-white rounded-xl border border-soft/20 overflow-hidden">
                  {competitors.above && (
                    <Link
                      href={`/rankings/profile/${competitors.above.slug}`}
                      className="flex items-center justify-between px-5 py-4 border-b border-soft/10 hover:bg-cream/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-extrabold text-lg text-soft/60 w-8">
                          {competitors.above.rank}
                        </span>
                        <span className="font-heading font-bold text-black">
                          {competitors.above.name}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-heading font-bold ${getBandColor(
                          competitors.above.score >= 81
                            ? 'excellent'
                            : competitors.above.score >= 61
                            ? 'good'
                            : competitors.above.score >= 41
                            ? 'fair'
                            : 'poor'
                        )}`}
                      >
                        {competitors.above.score}
                      </span>
                    </Link>
                  )}
                  <div className="flex items-center justify-between px-5 py-4 bg-orange/5 border-l-4 border-l-orange border-b border-soft/10">
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-extrabold text-lg text-orange w-8">
                        {competitors.current.rank}
                      </span>
                      <span className="font-heading font-bold text-black">
                        {competitors.current.name}
                      </span>
                      <span className="text-xs text-mid font-mono">YOU</span>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-heading font-bold ${getBandColor(
                        competitors.current.score >= 81
                          ? 'excellent'
                          : competitors.current.score >= 61
                          ? 'good'
                          : competitors.current.score >= 41
                          ? 'fair'
                          : 'poor'
                      )}`}
                    >
                      {competitors.current.score}
                    </span>
                  </div>
                  {competitors.below && (
                    <Link
                      href={`/rankings/profile/${competitors.below.slug}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-cream/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-extrabold text-lg text-soft/60 w-8">
                          {competitors.below.rank}
                        </span>
                        <span className="font-heading font-bold text-black">
                          {competitors.below.name}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-heading font-bold ${getBandColor(
                          competitors.below.score >= 81
                            ? 'excellent'
                            : competitors.below.score >= 61
                            ? 'good'
                            : competitors.below.score >= 41
                            ? 'fair'
                            : 'poor'
                        )}`}
                      >
                        {competitors.below.score}
                      </span>
                    </Link>
                  )}
                </div>
                <div className="mt-4 bg-black rounded-xl p-6 text-center">
                  <p className="text-white font-heading font-bold mb-2">
                    Want to move up?
                  </p>
                  <p className="text-soft text-sm mb-4">
                    Chocka improves your score automatically. £29/month.
                  </p>
                  <Link
                    href="/for-tradespeople"
                    className="btn-primary text-sm py-3 px-6"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right column — score */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-soft/20 text-center">
              <h3 className="font-heading font-bold text-lg text-black mb-4">
                Chocka Score
              </h3>
              {score ? (
                <ScoreArc
                  score={score.score}
                  band={score.band as 'poor' | 'fair' | 'good' | 'excellent'}
                />
              ) : (
                <div className="text-mid">No score yet</div>
              )}
            </div>

            {ranking && (
              <div className="bg-white rounded-2xl p-6 border border-soft/20 text-center">
                <div className="font-heading font-extrabold text-3xl text-orange mb-1">
                  #{ranking.rank}
                </div>
                <div className="text-mid text-sm">
                  {biz.trade} in {biz.town}
                </div>
                {ranking.movement != null && ranking.movement !== 0 ? (
                  <div
                    className={`mt-2 font-heading font-bold ${
                      ranking.movement > 0 ? 'text-green' : 'text-orange'
                    }`}
                  >
                    {ranking.movement > 0 ? '↑' : '↓'}{' '}
                    {Math.abs(ranking.movement)} places this week
                  </div>
                ) : (
                  <div className="mt-2 text-soft text-sm font-mono">—</div>
                )}
              </div>
            )}

            {!isClaimed && (
              <Link
                href={`/index/claim/${biz.slug}`}
                className="btn-primary w-full justify-center"
              >
                Claim This Profile →
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="bg-black py-8 text-center">
        <Link
          href={`/index/${townSlug(biz.town)}/${tradeSlug(biz.trade)}`}
          className="font-mono text-orange text-sm hover:underline"
        >
          ← Back to {biz.trade}s in {biz.town}
        </Link>
      </section>
    </main>
  );
}
