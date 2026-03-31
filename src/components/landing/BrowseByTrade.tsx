import Link from 'next/link';
import { TRADES, TRADE_EMOJIS, tradeSlug } from '@/lib/constants';
import FadeIn from '../shared/FadeIn';

export default function BrowseByTrade() {
  return (
    <FadeIn>
      <section id="trades" className="section-padding bg-cream">
        <div className="container-max">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-4">
            Browse by trade
          </h2>
          <p className="text-mid text-lg mb-12">
            20 trades ranked across NE England.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {TRADES.map((trade) => (
              <Link
                key={trade}
                href={`/index/newcastle-upon-tyne/${tradeSlug(trade)}`}
                className="bg-white rounded-xl px-4 py-4 flex items-center gap-3 border border-soft/15 hover:border-orange/30 hover:shadow-md transition-all group"
              >
                <span className="text-xl">{TRADE_EMOJIS[trade]}</span>
                <span className="font-heading font-bold text-sm text-black group-hover:text-orange transition-colors">
                  {trade}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
