'use client';

import { useState } from 'react';

// Shared waiting-list capture used on the homepage and across the niche pages
// while Chocka is closed to new signups. Posts to the existing
// /api/newsletter/subscribe endpoint (newsletter_subscribers table); `source`
// is stored as the town so submissions can be told apart. `dark` styles it for
// the dark niche sections; the default light style suits the paper homepage and
// the orange final-CTA band.
export default function WaitingList({
  source = 'Waiting list',
  dark = false,
}: {
  source?: string;
  dark?: boolean;
}) {
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
        body: JSON.stringify({ email, town: source }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className={`font-body text-base ${dark ? 'text-white/80' : 'text-ink-2'}`}>
        Thank you. We&rsquo;ll be in touch if a place opens up.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        aria-label="Email address"
        className={`flex-1 px-4 py-3 rounded-xl font-body focus:outline-none focus:ring-2 focus:ring-orange ${
          dark
            ? 'bg-white/10 border border-white/20 text-white placeholder-white/40'
            : 'bg-white border border-paper-line text-black'
        }`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`font-body font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60 ${
          dark ? 'bg-orange text-white hover:bg-orange-dark' : 'bg-ink text-white hover:bg-black'
        }`}
      >
        {loading ? '…' : 'Notify me'}
      </button>
    </form>
  );
}
