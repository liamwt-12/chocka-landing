'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Nav() {
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
          ? 'bg-warm/95 backdrop-blur-md border-b border-soft/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-extrabold text-2xl text-orange tracking-tight">
            CHOCKA
          </span>
          <span className="text-soft text-xs font-mono uppercase tracking-wider">
            INDEX
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#scoring"
            className="text-mid hover:text-black transition-colors font-medium text-sm"
          >
            How scoring works
          </a>
          <a
            href="#trades"
            className="text-mid hover:text-black transition-colors font-medium text-sm"
          >
            Browse trades
          </a>
          <Link
            href="/for-tradespeople"
            className="btn-secondary text-sm py-2.5 px-5"
          >
            Are you a tradesperson?
          </Link>
        </div>
        <Link
          href="/for-tradespeople"
          className="md:hidden btn-secondary text-sm py-2 px-4"
        >
          For tradespeople
        </Link>
      </div>
    </nav>
  );
}
