import Link from 'next/link';
import WaitingList from '@/components/shared/WaitingList';

// Chocka is closed to new signups while the team focuses elsewhere. This replaces
// the former marketing landing with a single dignified screen plus a waiting-list
// capture (the shared WaitingList component, backed by newsletter_subscribers).
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
        <WaitingList source="Waiting list" />
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
