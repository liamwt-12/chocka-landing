import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  NE_TOWNS,
  TRADES,
  TRADE_EMOJIS,
  findTown,
  findTrade,
  townSlug,
  tradeSlug,
} from '@/lib/constants';
import { getTopBusinessForTownTrade } from '@/lib/data';
import IndexSearch from '@/components/shared/IndexSearch';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const town of NE_TOWNS) {
    params.push({ slug: townSlug(town) });
  }
  for (const trade of TRADES) {
    params.push({ slug: tradeSlug(trade) });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const town = findTown(params.slug);
  if (town) {
    return {
      title: `Best Tradespeople in ${town} — Chocka Index`,
      description: `Find the top-rated plumbers, electricians, builders and more in ${town}. Ranked by the Chocka Index. Updated weekly.`,
    };
  }
  const trade = findTrade(params.slug);
  if (trade) {
    return {
      title: `Best ${trade}s in the UK — Chocka Index`,
      description: `Find the top-rated ${trade.toLowerCase()}s across the UK. Ranked by the Chocka Index. Updated weekly.`,
    };
  }
  return {};
}

export default async function SlugPage({ params }: Props) {
  const town = findTown(params.slug);
  const trade = findTrade(params.slug);

  if (town) return <TownHub town={town} />;
  if (trade) return <TradeHub trade={trade} />;
  notFound();
}

async function TownHub({ town }: { town: string }) {
  const tradeCards = await Promise.all(
    TRADES.map(async (trade) => {
      const top = await getTopBusinessForTownTrade(town, trade);
      return { trade, top };
    })
  );

  return (
    <main>
      <section className="bg-black text-white section-padding pt-16">
        <div className="container-max">
          <Link
            href="/index"
            className="font-mono text-orange text-sm mb-4 inline-block"
          >
            ← Back to Index
          </Link>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">
            Best tradespeople in{' '}
            <span className="text-orange">{town}</span>
          </h1>
          <p className="text-soft text-lg mb-8">
            Browse all {TRADES.length} trades. Rankings updated weekly.
          </p>
          <div className="max-w-2xl">
            <IndexSearch defaultTown={town} />
          </div>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-max">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {tradeCards.map(({ trade, top }) => (
              <Link
                key={trade}
                href={`/index/${townSlug(town)}/${tradeSlug(trade)}`}
                className="bg-white rounded-xl p-5 hover:shadow-md hover:ring-2 hover:ring-orange/20 transition-all border border-soft/20"
              >
                <div className="text-2xl mb-2">{TRADE_EMOJIS[trade]}</div>
                <div className="font-heading font-bold text-black mb-1">
                  {trade}
                </div>
                {top ? (
                  <div className="text-mid text-sm">
                    #1: {top.name} ({top.score}/100)
                  </div>
                ) : (
                  <div className="text-soft text-sm">No data yet</div>
                )}
              </Link>
            ))}
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

async function TradeHub({ trade }: { trade: string }) {
  const townCards = await Promise.all(
    NE_TOWNS.map(async (town) => {
      const top = await getTopBusinessForTownTrade(town, trade);
      return { town, top };
    })
  );

  return (
    <main>
      <section className="bg-black text-white section-padding pt-16">
        <div className="container-max">
          <Link
            href="/index"
            className="font-mono text-orange text-sm mb-4 inline-block"
          >
            ← Back to Index
          </Link>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">
            {TRADE_EMOJIS[trade]} Best{' '}
            <span className="text-orange">{trade}s</span> in the UK
          </h1>
          <p className="text-soft text-lg mb-8">
            Browse rankings in {NE_TOWNS.length} towns. Updated weekly.
          </p>
          <div className="max-w-2xl">
            <IndexSearch defaultTrade={trade} />
          </div>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-max">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {townCards.map(({ town, top }) => (
              <Link
                key={town}
                href={`/index/${townSlug(town)}/${tradeSlug(trade)}`}
                className="bg-white rounded-xl p-5 hover:shadow-md hover:ring-2 hover:ring-orange/20 transition-all border border-soft/20"
              >
                <div className="font-heading font-bold text-black mb-1">
                  {town}
                </div>
                {top ? (
                  <div className="text-mid text-sm">
                    #1: {top.name} ({top.score}/100)
                  </div>
                ) : (
                  <div className="text-soft text-sm">No data yet</div>
                )}
              </Link>
            ))}
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
