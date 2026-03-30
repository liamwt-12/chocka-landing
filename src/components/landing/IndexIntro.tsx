'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TRADES, NE_TOWNS, townSlug, tradeSlug } from '@/lib/constants';

export default function IndexIntro() {
  const router = useRouter();
  const [town, setTown] = useState('');
  const [trade, setTrade] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (town && trade) {
      router.push(`/index/${townSlug(town)}/${tradeSlug(trade)}`);
    } else if (town) {
      router.push(`/index/${townSlug(town)}`);
    } else if (trade) {
      router.push(`/index/${tradeSlug(trade)}`);
    } else {
      router.push('/index');
    }
  };

  const stats = [
    { value: '100,000+', label: 'Businesses ranked' },
    { value: '500', label: 'UK towns' },
    { value: '20', label: 'Trades covered' },
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-max text-center">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-4">
          Find the best tradespeople in your area
        </h2>
        <p className="text-mid text-lg md:text-xl max-w-2xl mx-auto mb-10">
          The Chocka Index ranks every tradesperson in the UK by town and trade.
          Updated every week. Completely free.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-12"
        >
          <select
            value={town}
            onChange={(e) => setTown(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-soft bg-white text-black font-body focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <option value="">Select a town...</option>
            {NE_TOWNS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-soft bg-white text-black font-body focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <option value="">Select a trade...</option>
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary py-3 px-8">
            Search
          </button>
        </form>

        <div className="flex justify-center gap-12 mb-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading font-bold text-3xl md:text-4xl text-black">
                {stat.value}
              </div>
              <div className="text-mid text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <Link
          href="/index"
          className="text-orange font-heading font-bold text-lg hover:underline"
        >
          Browse the rankings →
        </Link>
      </div>
    </section>
  );
}
