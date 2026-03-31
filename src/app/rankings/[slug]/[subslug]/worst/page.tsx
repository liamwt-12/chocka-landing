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
    title: `Lowest-Scoring ${trade}s in ${town} — Chocka Index`,
    description: `The lowest-scoring ${trade.toLowerCase()}s in ${town} according to the Chocka Index.`,
  };
}

export default async function WorstPage({ params }: Props) {
  const town = findTown(params.slug);
  const trade = findTrade(params.subslug);
  if (!town || !trade) notFound();

  const entries = await getLeagueTable(town, trade, 'desc', 10);

  return (
    <main>
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
            <Link
              href={`/index/${townSlug(town)}/${tradeSlug(trade)}`}
              className="hover:text-orange"
            >
              {trade}s
            </Link>
            <span>/</span>
            <span className="text-white">Lowest Scoring</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-2">
            Lowest-Scoring <span className="text-orange">{trade}s</span> in{' '}
            {town}
          </h1>
          <p className="text-soft">
            These businesses have the most room for improvement.
          </p>
        </div>
      </section>

      <section className="section-padding bg-warm pt-8">
        <div className="container-max">
          {entries.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-mid text-lg">No businesses found yet.</p>
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
                        className="border-b border-soft/10 hover:bg-cream/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <span className="font-heading font-extrabold text-xl text-mid">
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/index/profile/${entry.business.slug}`}
                            className="hover:text-orange transition-colors"
                          >
                            <div className="font-heading font-bold text-black">
                              {entry.business.name}
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

          <div className="mt-8 text-center">
            <Link
              href={`/index/${townSlug(town)}/${tradeSlug(trade)}`}
              className="text-orange font-heading font-bold hover:underline"
            >
              ← View top-rated {trade}s in {town}
            </Link>
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
