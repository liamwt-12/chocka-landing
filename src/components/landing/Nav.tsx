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
        scrolled ? 'bg-warm/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-max flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
        <Link href="/" className="font-mono text-2xl font-bold text-orange tracking-tight">
          CHOCKA
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-mid hover:text-black transition-colors font-medium">
            How it works
          </a>
          <a href="#pricing" className="text-mid hover:text-black transition-colors font-medium">
            Pricing
          </a>
          <a
            href="https://app.chocka.co.uk"
            className="btn-primary text-base py-3 px-6"
          >
            Get Started →
          </a>
        </div>
      </div>
    </nav>
  );
}
