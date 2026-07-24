'use client';

import { useState } from 'react';
import Link from 'next/link';

// Chocka is closed to new signups while the team focuses elsewhere. This replaces
// the former marketing landing with a single dignified screen plus a waiting-list
// capture. Emails go to the existing /api/newsletter/subscribe endpoint (the
// newsletter_subscribers table), tagged with town 'Waiting list'.
function WaitingList() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, town: 'Waiting list' }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className="font-body text-ink-2 text-base">
        Thank you. We&rsquo;ll be in touch if a place opens up.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className="flex-1 px-4 py-3 rounded-xl border border-paper-line bg-white text-black font-body focus:outline-none focus:ring-2 focus:ring-orange"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-ink text-white font-body font-semibold px-6 py-3 rounded-xl hover:bg-black transition-colors disabled:opacity-60"
      >
        {loading ? '…' : 'Notify me'}
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <main className="bg-paper min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="font-heading font-extrabold text-3xl text-orange tracking-tight mb-10">
        CHOCKA
      </span>

      <h1
        className="font-heading font-extrabold text-ink leading-[0.98] mb-5"
        style={{ fontSize: 'clamp(1.9rem, 5vw, 3rem)' }}
      >
        CHOCKA IS CURRENTLY
        <br />
        CLOSED TO NEW SIGNUPS
      </h1>

      <p className="font-body text-ink-2 text-lg leading-relaxed max-w-md mb-8">
        We&rsquo;re not taking on new businesses right now while we focus our time
        elsewhere. Leave your email and we&rsquo;ll let you know if that changes.
      </p>

      <div className="w-full max-w-md">
        <WaitingList />
      </div>

      <footer className="mt-16">
        <p className="font-body text-ink-2 text-sm mb-3">
          Built in the North East ·{' '}
          <a
            href="mailto:team@chocka.co.uk"
            className="underline decoration-paper-line underline-offset-4 hover:text-ink transition-colors"
          >
            team@chocka.co.uk
          </a>
        </p>
        <div className="flex justify-center gap-6 text-sm font-body text-ink-3">
          <Link href="/privacy" className="hover:text-ink transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink transition-colors">
            Terms
          </Link>
        </div>
      </footer>
    </main>
  );
}
