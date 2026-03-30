'use client';

import { useState } from 'react';

export default function EmailCapture({
  town,
  trade,
}: {
  town?: string;
  trade?: string;
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
        body: JSON.stringify({ email, town: town || 'General', trade }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green/10 rounded-2xl p-8 text-center">
        <div className="text-green font-heading font-bold text-xl mb-2">
          You&apos;re subscribed!
        </div>
        <p className="text-mid">
          We&apos;ll send you the monthly Top 10{town ? ` for ${town}` : ''}.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream rounded-2xl p-8">
      <h3 className="font-heading font-bold text-xl text-black mb-2">
        Get the monthly Top 10{town ? ` for ${town}` : ''}
      </h3>
      <p className="text-mid mb-4">
        Free monthly email with the best-rated tradespeople in your area.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-xl border border-soft bg-white text-black font-body focus:outline-none focus:ring-2 focus:ring-orange"
        />
        <button type="submit" disabled={loading} className="btn-primary py-3 px-6">
          {loading ? '...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
}
