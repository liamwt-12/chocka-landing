'use client';

import { useEffect, useState } from 'react';

const BAND_COLORS = {
  poor: { start: '#EF4444', end: '#F97316' },
  fair: { start: '#F97316', end: '#F59E0B' },
  good: { start: '#F59E0B', end: '#22C55E' },
  excellent: { start: '#22C55E', end: '#16A34A' },
};

const BAND_LABELS = {
  poor: 'Poor',
  fair: 'Fair',
  good: 'Good',
  excellent: 'Excellent',
};

export default function ScoreArc({
  score,
  band,
  size = 240,
}: {
  score: number;
  band: 'poor' | 'fair' | 'good' | 'excellent';
  size?: number;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start: number;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setAnimatedScore(Math.floor(progress * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - 30) / 2;
  const strokeWidth = 14;
  const startAngle = 150;
  const endAngle = 390;
  const totalAngle = endAngle - startAngle;
  const scoreAngle = startAngle + (animatedScore / 100) * totalAngle;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (start: number, end: number) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const colors = BAND_COLORS[band];
  const gradientId = `arc-grad-${band}`;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Score arc */}
        {animatedScore > 0 && (
          <path
            d={describeArc(startAngle, scoreAngle)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-heading font-extrabold text-5xl text-black">
          {animatedScore}
        </div>
        <div className="text-sm font-heading font-bold text-mid mt-1">
          out of 100
        </div>
        <div
          className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
            band === 'excellent'
              ? 'bg-emerald-100 text-emerald-800'
              : band === 'good'
              ? 'bg-amber-100 text-amber-800'
              : band === 'fair'
              ? 'bg-orange/10 text-orange'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {BAND_LABELS[band]}
        </div>
      </div>
    </div>
  );
}
