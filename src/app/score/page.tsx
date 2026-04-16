import { Metadata } from 'next';
import Link from 'next/link';
import ScoreChecker from '@/components/score/ScoreChecker';

export const metadata: Metadata = {
  title: 'Check Your Chocka Score',
  description:
    'See how your Google Business Profile scores. No signup needed.',
};

export default function ScorePage() {
  return (
    <>
      {/* Nav */}
      <nav className="bg-warm border-b border-soft/20">
        <div className="container-max flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading font-extrabold text-2xl text-orange tracking-tight">
              CHOCKA
            </span>
          </Link>
          <Link
            href="/for-tradespeople"
            className="text-mid hover:text-black transition-colors font-medium text-sm"
          >
            Learn more
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-warm section-padding pb-0">
        <div className="container-max max-w-2xl mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-black leading-[0.95] mb-4">
            How does your Google profile{' '}
            <span className="text-orange">actually</span> score?
          </h1>
          <p className="text-mid text-lg md:text-xl mb-2 max-w-lg mx-auto leading-relaxed">
            Enter your business name and postcode. We&apos;ll pull your real
            Google data and score it out of 100. Takes 30 seconds, no signup
            needed.
          </p>
        </div>
      </section>

      {/* Score Checker */}
      <ScoreChecker />

      {/* Footer */}
      <footer className="bg-cream py-10 px-6 md:px-12 lg:px-20 text-center">
        <p className="text-mid text-sm">
          Scores based on public Google Business Profile data.{' '}
          <Link href="/privacy" className="text-orange hover:underline">
            Privacy policy
          </Link>
        </p>
      </footer>
    </>
  );
}
