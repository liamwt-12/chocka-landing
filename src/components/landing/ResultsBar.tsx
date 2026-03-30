'use client';

import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function ResultsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const profileViews = useCountUp(1387, 2000, visible);
  const avgWork = useCountUp(2400, 2000, visible);
  const savedHours = useCountUp(65, 2000, visible);

  const stats = [
    { value: `${profileViews}%`, label: 'Profile view increase' },
    { value: `£${avgWork.toLocaleString()}`, label: 'Avg new work generated' },
    { value: '4.8★', label: 'Avg rating maintained' },
    { value: `${(savedHours / 10).toFixed(1)}hrs`, label: 'Saved per month' },
  ];

  return (
    <section ref={ref} className="bg-orange py-16">
      <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-12 lg:px-20">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-2">
              {stat.value}
            </div>
            <div className="text-white/80 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
