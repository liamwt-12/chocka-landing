'use client';

import { useEffect, useState } from 'react';

type Feature = {
  icon: string;
  title: string;
  description: string;
};

type Props = {
  heroRotatingWords?: string[];
  heroNiche?: string;
  subhead: string;
  features: Feature[];
  permissionsIntro: string;
};

function TargetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-open:rotate-180">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

function featureIcon(name: string) {
  switch (name) {
    case 'target': return <TargetIcon />;
    case 'alert': return <AlertIcon />;
    case 'arrow-up': return <ArrowUpIcon />;
    default: return <TargetIcon />;
  }
}

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className="inline-grid text-rust">
      {words.map((w, i) => (
        <span
          key={w}
          aria-hidden={i !== index}
          className="col-start-1 row-start-1 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

export default function LandingPage({
  heroRotatingWords,
  heroNiche,
  subhead,
  features,
  permissionsIntro,
}: Props) {
  const headlineWord = heroRotatingWords ? (
    <RotatingWord words={heroRotatingWords} />
  ) : (
    <span className="text-rust">{heroNiche}</span>
  );

  return (
    <main className="min-h-screen bg-paper text-ink font-inter">
      <div className="max-w-[540px] mx-auto px-6 pt-8 pb-16">
        <div className="mb-12 md:mb-16">
          <span className="font-display text-base text-rust tracking-[0.08em]">
            CHOCKA
          </span>
        </div>

        <h1
          className="font-display uppercase leading-[1.02] tracking-tight text-ink mb-6"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 3.75rem)' }}
        >
          <span className="block">SEE YOUR</span>
          <span className="block">{headlineWord}</span>
          <span className="block">SCORE.</span>
        </h1>

        <p className="text-[1.125rem] leading-[1.55] text-ink-2 mb-10">
          {subhead}
        </p>

        <section className="bg-paper-card border border-paper-line rounded-[1.25rem] p-7 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink-3 mb-6">
            What you&rsquo;ll get
          </p>

          <ul className="space-y-5 mb-8">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <span className="shrink-0 mt-0.5 text-rust">
                  {featureIcon(f.icon)}
                </span>
                <div>
                  <div className="font-semibold text-ink leading-snug">
                    {f.title}
                  </div>
                  <div className="text-[0.9375rem] text-ink-3 leading-snug mt-0.5">
                    {f.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="https://app.chocka.co.uk/login"
            className="flex items-center justify-center gap-3 bg-ink text-white rounded-[0.875rem] py-4 px-5 font-semibold w-full hover:bg-black transition-colors"
          >
            <span className="bg-white rounded-full p-0.5 flex items-center justify-center">
              <GoogleG />
            </span>
            <span>Connect Google — see your score</span>
          </a>

          <p className="text-center text-sm text-ink-3 mt-3">
            Free · No card required · 30 seconds
          </p>

          <details className="group mt-6 bg-white border border-paper-line rounded-[0.75rem] overflow-hidden">
            <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none text-sm text-ink-2 select-none">
              <span className="flex items-center gap-2">
                <LockIcon />
                <span>What signing in actually does</span>
              </span>
              <ChevronIcon />
            </summary>
            <div className="px-4 pb-4 pt-1 space-y-3 text-[0.875rem] leading-[1.55] text-ink-2">
              <p>
                {permissionsIntro}, so we can read your score and, if you sign up later, do the work.
              </p>
              <p>
                Chocka only gets access to your Google Business Profile. Not your Gmail, Drive, calendar, or anything else. Google enforces this.
              </p>
              <p>
                You can remove our access any time at{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rust underline"
                >
                  myaccount.google.com/permissions
                </a>
                .
              </p>
            </div>
          </details>
        </section>

        <div className="mt-14 text-center">
          <span className="font-signature text-[2rem] text-rust leading-none">
            Liam
          </span>
        </div>

        <div className="mt-6 text-center text-sm text-ink-3">
          Built in the North East ·{' '}
          <a href="mailto:team@chocka.co.uk" className="underline">
            team@chocka.co.uk
          </a>
        </div>

        <div className="mt-3 text-center text-xs text-ink-3">
          <a href="/privacy" className="hover:underline">Privacy</a>
          {' · '}
          <a href="/terms" className="hover:underline">Terms</a>
        </div>
      </div>
    </main>
  );
}
