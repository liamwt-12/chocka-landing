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
  const avgRating = useCountUp(48, 2000, visible);
  const savedHours = useCountUp(65, 2000, visible);

  return (
    <section ref={ref} className="bg-orange py-16">
      <div className="container-max grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-12 lg:px-20">
        <div className="text-center">
          <div className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-2">
            {profileViews}%
          </div>
          <div className="text-white/80 text-sm font-medium">
            Average profile view increase in first 3 months
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-2">
            £{avgWork.toLocaleString()}
          </div>
          <div className="text-white/80 text-sm font-medium">
            Average new work generated per month from Google
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-2">
            {(avgRating / 10).toFixed(1)}★
          </div>
          <div className="text-white/80 text-sm font-medium">
            Average rating after 6 months. Up from 4.1
          </div>
        </div>
        <div className="text-center">
          <div className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-2">
            {(savedHours / 10).toFixed(1)}hrs
          </div>
          <div className="text-white/80 text-sm font-medium">
            Average time saved per month per tradesperson
          </div>
        </div>
      </div>
    </section>
  );
}
