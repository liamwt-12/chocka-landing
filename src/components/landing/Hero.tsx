'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TRADES, NE_TOWNS, townSlug, tradeSlug } from '@/lib/constants';

const QUICK_LINKS = [
  { label: 'Plumbers in Newcastle', town: 'Newcastle upon Tyne', trade: 'Plumber' },
  { label: 'Electricians in Sunderland', town: 'Sunderland', trade: 'Electrician' },
  { label: 'Roofers in Durham', town: 'Durham', trade: 'Roofer' },
  { label: 'Gas Engineers in Gateshead', town: 'Gateshead', trade: 'Gas Engineer' },
  { label: 'Builders in Middlesbrough', town: 'Middlesbrough', trade: 'Builder' },
];

export default function Hero() {
  const router = useRouter();
  const [trade, setTrade] = useState('');
  const [location, setLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredTowns = NE_TOWNS.filter(
    (t) => t.toLowerCase().includes(location.toLowerCase()) && location.length > 0
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedTown = NE_TOWNS.find(
      (t) => t.toLowerCase() === location.toLowerCase()
    );
    const matchedTrade = TRADES.find((t) => t === trade);

    if (matchedTown && matchedTrade) {
      router.push(`/index/${townSlug(matchedTown)}/${tradeSlug(matchedTrade)}`);
    } else if (matchedTown) {
      router.push(`/index/${townSlug(matchedTown)}`);
    } else if (matchedTrade) {
      router.push(`/index/newcastle-upon-tyne/${tradeSlug(matchedTrade)}`);
    }
  };

  const selectTown = (town: string) => {
    setLocation(town);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <section className="section-padding pt-8 md:pt-12 pb-16 md:pb-20">
      <div className="container-max text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 bg-orange/10 text-orange text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse-dot" />
          UK Tradesperson Rankings — Updated Weekly
        </div>

        {/* Headline */}
        <h1 className="font-heading font-extrabold uppercase text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black leading-[0.9] mb-6">
          Find the best
          <br />
          tradesperson
          <br />
          <span className="text-orange">near you.</span>
        </h1>

        {/* Sub */}
        <p className="text-mid text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Every tradesperson scored out of 100. Based on real Google data. No
          business can pay to rank higher.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-soft/20 p-2 flex flex-col sm:flex-row gap-2 mb-6"
        >
          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="flex-1 px-4 py-3.5 rounded-xl bg-cream/50 text-black font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
          >
            <option value="">Select a trade...</option>
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <div className="relative flex-1" ref={suggestionsRef}>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => location.length > 0 && setShowSuggestions(true)}
              placeholder="Enter your town..."
              className="w-full px-4 py-3.5 rounded-xl bg-cream/50 text-black font-body focus:outline-none focus:ring-2 focus:ring-orange/50"
            />
            {showSuggestions && filteredTowns.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-soft/20 py-2 z-20 max-h-48 overflow-y-auto">
                {filteredTowns.map((town) => (
                  <button
                    key={town}
                    type="button"
                    onClick={() => selectTown(town)}
                    className="w-full text-left px-4 py-2.5 hover:bg-cream/50 text-black text-sm transition-colors"
                  >
                    {town}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary py-3.5 px-8 rounded-xl">
            Search →
          </button>
        </form>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.label}
              href={`/index/${townSlug(link.town)}/${tradeSlug(link.trade)}`}
              className="text-sm text-mid hover:text-orange px-3.5 py-1.5 rounded-full bg-cream/80 hover:bg-orange/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Trust stats */}
        <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
          <div>
            <div className="font-heading font-bold text-3xl md:text-4xl text-black">
              7,101
            </div>
            <div className="text-mid text-sm">businesses ranked</div>
          </div>
          <div>
            <div className="font-heading font-bold text-3xl md:text-4xl text-black">
              15
            </div>
            <div className="text-mid text-sm">towns covered</div>
          </div>
          <div>
            <div className="font-heading font-bold text-3xl md:text-4xl text-black">
              20
            </div>
            <div className="text-mid text-sm">trades · updated weekly</div>
          </div>
        </div>
      </div>
    </section>
  );
}
