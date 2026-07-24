'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TradesNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        <Link href="/for-tradespeople" className="flex items-center gap-2">
          <span className="font-heading font-extrabold text-2xl text-orange tracking-tight">
            CHOCKA
          </span>
          <span className="text-white/40 text-xs font-mono uppercase tracking-wider">
            FOR TRADESPEOPLE
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="hidden sm:inline text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to Index
          </Link>
          <Link
            href="/"
            className="btn-primary text-sm py-2.5 px-5"
          >
            Join the waiting list →
          </Link>
        </div>
      </div>
    </nav>
  );
}
