import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  NE_TOWNS,
  TRADES,
  findTown,
  findTrade,
  townSlug,
  tradeSlug,
} from '@/lib/constants';
import { getLeagueTable } from '@/lib/data';
import ScorePill from '@/components/shared/ScorePill';
import MovementIndicator from '@/components/shared/MovementIndicator';
import ChockaBadge from '@/components/shared/ChockaBadge';
import EmailCapture from '@/components/shared/EmailCapture';

export const revalidate = 604800;

interface Props {
  params: { slug: string; subslug: string };
}

export async function generateStaticParams() {
  const params: { slug: string; subslug: string }[] = [];
  for (const town of NE_TOWNS) {
    for (const trade of TRADES) {
      params.push({ slug: townSlug(town), subslug: tradeSlug(trade) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const town = findTown(params.slug);
  const trade = findTrade(params.subslug);
  if (!town || !trade) return {};

  return {
    title: `Best ${trade}s in ${town} 2026 — Chocka Index`,
    description: `Top-rated ${trade.toLowerCase()}s in ${town}, ranked by the Chocka Index. Reviews, ratings, and response times compared. Updated weekly.`,
  };
}

export default async function LeagueTablePage({ params }: Props) {
  const town = findTown(params.slug);
  const trade = findTrade(params.subslug);
  if (!town || !trade) notFound();

  const entries = await getLeagueTable(town, trade, 'asc', 10);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${trade}s in ${town}`,
    itemListElement: entries.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: entry.business.name,
        address: entry.business.address,
        telephone: entry.business.phone,
        url: entry.business.website,
        aggregateRating: entry.score.star_rating
          ? {
              '@type': 'AggregateRating',
              ratingValue: entry.score.star_rating,
              reviewCount: entry.score.review_count,
            }
          : undefined,
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="bg-black border-b border-white/10">
        <div className="container-max flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
          <Link href="/" className="font-heading font-extrabold text-2xl text-orange tracking-tight">
            CHOCKA
          </Link>
          <Link
            href="/for-tradespeople"
            className="text-soft hover:text-orange text-sm font-medium transition-colors"
          >
            For tradespeople →
          </Link>
        </div>
      </nav>

      <section className="bg-black text-white section-padding pt-16 pb-12">
        <div className="container-max">
          <div className="flex items-center gap-2 text-sm text-soft mb-4">
            <Link href="/index" className="hover:text-orange">
              Index
            </Link>
            <span>/</span>
            <Link
              href={`/index/${townSlug(town)}`}
              className="hover:text-orange"
            >
              {town}
            </Link>
            <span>/</span>
            <span className="text-white">{trade}s</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-2">
            Top <span className="text-orange">{trade}s</span> in {town}
          </h1>
          <p className="text-soft">
            Ranked by the Chocka Index · Updated weekly · {entries.length}{' '}
            businesses
          </p>
        </div>
      </section>

      <section className="section-padding bg-warm pt-8">
        <div className="container-max">
          {entries.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mid text-lg">
                No businesses found yet for this area.
              </p>
              <p className="text-soft mt-2">
                Check back soon — we update weekly.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-soft/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-soft/20 text-left">
                      <th className="px-4 py-3 text-xs text-mid font-medium uppercase tracking-wider w-16">
                        #
                      </th>
                      <th className="px-4 py-3 text-xs text-mid font-medium uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-4 py-3 text-xs text-mid font-medium uppercase tracking-wider hidden sm:table-cell">
                        Rating
                      </th>
                      <th className="px-4 py-3 text-xs text-mid font-medium uppercase tracking-wider hidden md:table-cell">
                        Reviews
                      </th>
                      <th className="px-4 py-3 text-xs text-mid font-medium uppercase tracking-wider text-center">
                        Move
                      </th>
                      <th className="px-4 py-3 text-xs text-mid font-medium uppercase tracking-wider text-right">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr
                        key={entry.business.id}
                        className={`border-b border-soft/10 hover:bg-cream/50 transition-colors ${
                          entry.rank === 1 ? 'bg-orange/5' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <span
                            className={`font-heading font-extrabold text-xl ${
                              entry.rank === 1 ? 'text-orange' : 'text-mid'
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/index/profile/${entry.business.slug}`}
                            className="hover:text-orange transition-colors"
                          >
                            <div className="font-heading font-bold text-black flex items-center gap-2">
                              {entry.business.name}
                              {entry.is_chocka_customer && <ChockaBadge />}
                            </div>
                          </Link>
                          {entry.business.address && (
                            <div className="text-soft text-xs mt-0.5">
                              {entry.business.address}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          {entry.score.star_rating ? (
                            <span className="font-heading font-bold">
                              {entry.score.star_rating.toFixed(1)}★
                            </span>
                          ) : (
                            <span className="text-soft">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-mid">
                            {entry.score.review_count ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <MovementIndicator movement={entry.movement} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <ScorePill
                            score={entry.score.score}
                            band={entry.score.band}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 bg-black rounded-2xl p-8 text-center text-white">
            <h3 className="font-heading font-bold text-xl mb-2">
              Is your business missing?
            </h3>
            <p className="text-soft mb-4">
              Claim your free profile and see your Chocka Score.
            </p>
            <Link href="/index" className="btn-primary">
              Claim your free profile →
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href={`/index/${townSlug(town)}/${tradeSlug(trade)}/worst`}
              className="text-mid hover:text-orange text-sm transition-colors"
            >
              Lowest-rated {trade}s in {town} →
            </Link>
          </div>

          <div className="mt-12">
            <EmailCapture town={town} trade={trade} />
          </div>
        </div>
      </section>

      <section className="bg-black py-8 text-center">
        <Link
          href="/index"
          className="font-mono text-orange text-sm hover:underline"
        >
          ← Back to Index
        </Link>
      </section>
    </main>
  );
}
