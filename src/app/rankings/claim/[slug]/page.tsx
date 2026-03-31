'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ClaimPage({ params }: { params: { slug: string } }) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('businesses')
      .select('name')
      .eq('slug', params.slug)
      .single()
      .then(({ data }) => {
        if (data) setBusinessName(data.name);
      });
  }, [params.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, town: 'Claim', trade: params.slug }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="bg-black text-white section-padding pt-16 pb-12">
        <div className="container-max">
          <Link
            href="/index"
            className="font-mono text-orange text-sm mb-4 inline-block"
          >
            ← Back to Index
          </Link>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-2">
            Claim{' '}
            <span className="text-orange">
              {businessName || 'your profile'}
            </span>
          </h1>
          <p className="text-soft text-lg">
            {businessName
              ? `Verify you own ${businessName} to manage your profile.`
              : "Enter your email to get started. It's free."}
          </p>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-max max-w-md mx-auto">
          {submitted ? (
            <div className="bg-green/10 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="font-heading font-bold text-2xl text-black mb-2">
                Claim submitted!
              </h2>
              <p className="text-mid mb-6">
                We&apos;ll send you an email to verify your ownership. Once
                verified, you can manage your profile.
              </p>
              <Link
                href={`/index/profile/${params.slug}`}
                className="text-orange font-heading font-bold hover:underline"
              >
                ← Back to profile
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-soft/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-orange/10 text-orange px-4 py-2 rounded-full text-sm font-heading font-bold mb-4">
                  Step 1 of 2
                </div>
                <h2 className="font-heading font-bold text-2xl text-black">
                  {businessName
                    ? `Claim ${businessName}`
                    : 'Enter your email'}
                </h2>
                <p className="text-mid mt-2">
                  We&apos;ll verify you own this business before giving you
                  access.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-mid mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@business.com"
                    className="w-full px-4 py-3 rounded-xl border border-soft bg-white text-black font-body focus:outline-none focus:ring-2 focus:ring-orange"
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? 'Submitting...' : 'Claim This Profile →'}
                </button>
              </form>

              <p className="text-soft text-xs text-center mt-6">
                Free to claim · Managed by Chocka from £29/mo
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
