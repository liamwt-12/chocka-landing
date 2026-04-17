'use client';

import { useState, useEffect } from 'react';

function useCountUp(
  start: number,
  end: number,
  duration: number,
  triggered: boolean
) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!triggered) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration, triggered]);

  return value;
}

type Props = {
  sectionLabel: string;
  subhead: string;
  ranking: string;
  views: string;
  viewsChange: string;
  calls: string;
  callsChange: string;
};

export default function NicheHero({
  sectionLabel,
  subhead,
  ranking,
  views,
  viewsChange,
  calls,
  callsChange,
}: Props) {
  const [animated, setAnimated] = useState(false);
  const score = useCountUp(26, 84, 1200, animated);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const scoreColor =
    score >= 81
      ? 'text-emerald-400'
      : score >= 61
      ? 'text-amber-400'
      : score >= 41
      ? 'text-orange'
      : 'text-red-400';
  const barColor =
    score >= 81
      ? 'bg-emerald-400'
      : score >= 61
      ? 'bg-amber-400'
      : score >= 41
      ? 'bg-orange'
      : 'bg-red-400';

  return (
    <section className="section-padding pt-[120px] md:pt-[160px]">
      <div className="container-max grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left column */}
        <div>
          <div className="text-orange text-sm font-mono uppercase tracking-wider mb-6">
            {sectionLabel}
          </div>
          <h1 className="font-heading font-extrabold uppercase text-5xl md:text-6xl lg:text-7xl text-white leading-[0.9] mb-8">
            We fix your Google
            <br />
            profile. Then we
            <br />
            <span className="text-orange">run it for you.</span>
          </h1>
          <p className="text-white/50 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            {subhead}
          </p>
          <a
            href="https://app.chocka.co.uk/login"
            className="btn-primary text-xl mb-3 inline-flex"
          >
            See what we&apos;d fix &mdash; free →
          </a>
        </div>

        {/* Right column — Score animation card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-white/5">
          <div className="text-white/40 text-sm font-mono uppercase tracking-wider mb-4">
            Your Chocka Score
          </div>

          <div
            className={`font-heading font-extrabold text-7xl md:text-8xl ${scoreColor} transition-colors duration-300 mb-4`}
          >
            {score}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor} transition-all duration-300 ease-out`}
              style={{ width: `${score}%` }}
            />
          </div>

          {/* Change indicator */}
          <div className="inline-flex items-center gap-2 bg-emerald-400/10 text-emerald-400 text-sm font-bold px-3 py-1.5 rounded-full mb-6">
            +{Math.max(0, score - 26)}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/40 text-xs mb-1">Ranking</div>
              <div className="font-heading font-bold text-white text-lg">
                {ranking}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/40 text-xs mb-1">Views</div>
              <div className="font-heading font-bold text-white text-lg">
                {views}{' '}
                <span className="text-emerald-400 text-sm">↑{viewsChange}</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/40 text-xs mb-1">Calls</div>
              <div className="font-heading font-bold text-white text-lg">
                {calls}{' '}
                <span className="text-emerald-400 text-sm">↑{callsChange}</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-white/40 text-xs mb-1">Reviews replied</div>
              <div className="font-heading font-bold text-white text-lg">
                100%
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
