'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NE_TOWNS, TRADES, townSlug, tradeSlug } from '@/lib/constants';

export default function IndexSearch({
  defaultTown,
  defaultTrade,
}: {
  defaultTown?: string;
  defaultTrade?: string;
}) {
  const router = useRouter();
  const [town, setTown] = useState(defaultTown || '');
  const [trade, setTrade] = useState(defaultTrade || '');

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

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
      <select
        value={town}
        onChange={(e) => setTown(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl border border-soft bg-white text-black font-body focus:outline-none focus:ring-2 focus:ring-orange"
      >
        <option value="">All towns</option>
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
        <option value="">All trades</option>
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
  );
}
