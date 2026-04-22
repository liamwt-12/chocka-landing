'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NICHE_WORDS = ['SALON', 'RESTAURANT', 'TRADE', 'DENTAL PRACTICE', 'GYM', 'CLINIC'];

const APP_LOGIN = 'https://app.chocka.co.uk/login';

function HomeNav() {
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
          ? 'bg-paper/95 backdrop-blur-md border-b border-paper-line'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[960px] mx-auto flex items-center justify-between px-6 md:px-8 py-4">
        <Link href="/" className="flex items-center">
          <span className="font-heading font-extrabold text-2xl text-orange tracking-tight">
            CHOCKA
          </span>
        </Link>
        <a
          href={APP_LOGIN}
          className="bg-orange text-white font-body font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-orange-dark transition-colors"
        >
          See what we&rsquo;d fix &mdash; free →
        </a>
      </div>
    </nav>
  );
}

function RotatingNiche() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % NICHE_WORDS.length);
        setVisible(true);
      }, 350);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="block font-heading font-extrabold text-orange leading-[0.9] transition-opacity duration-[350ms]"
      style={{
        fontSize: 'clamp(3.5rem, 10vw, 7rem)',
        opacity: visible ? 1 : 0,
      }}
    >
      {NICHE_WORDS[index]}
    </span>
  );
}

function ProblemSection() {
  return (
    <section className="pt-[120px] md:pt-[140px] pb-10 md:pb-14 px-6 md:px-8">
      <div className="max-w-[960px] mx-auto text-center">
        <div className="inline-block border border-orange text-orange font-body font-semibold text-xs uppercase tracking-wider px-4 py-1.5 rounded-full mb-8">
          Your Google profile is costing you customers
        </div>

        <h1 className="mb-8">
          <span className="block font-heading font-extrabold text-ink leading-[0.95]" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            YOUR
          </span>
          <RotatingNiche />
          <span className="block font-heading font-extrabold text-ink leading-[0.95]" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            DESERVES BETTER.
          </span>
        </h1>

        <p className="font-body text-ink-2 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
          Right now, customers are searching Google for a business like yours.
          Most profiles are incomplete, stale, and losing to competitors who put
          in the work. Yours might be one of them.
        </p>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          <div className="font-body text-ink-3 text-sm">
            <span className="font-heading font-extrabold text-orange text-2xl mr-2">73%</span>
            no recent posts
          </div>
          <div className="font-body text-ink-3 text-sm">
            <span className="font-heading font-extrabold text-orange text-2xl mr-2">58%</span>
            never reply to reviews
          </div>
          <div className="font-body text-ink-3 text-sm">
            <span className="font-heading font-extrabold text-orange text-2xl mr-2">41%</span>
            have incomplete information
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreRing() {
  const [score, setScore] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const target = 84;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTriggered(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const duration = 1800;
    let start: number;
    let raf = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setScore(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [triggered]);

  return (
    <div ref={ref} className="relative" style={{ width: 128, height: 128 }}>
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#d8d4c3"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#22c55e"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading font-extrabold text-ink text-4xl">{score}</span>
      </div>
    </div>
  );
}

function ScoreTransition() {
  return (
    <section className="py-8 md:py-12 px-6 md:px-8">
      <div className="max-w-[960px] mx-auto text-center flex flex-col items-center">
        <div className="font-body font-semibold text-xs uppercase tracking-wider text-ink-3 mb-6">
          Find out in 60 seconds
        </div>

        <div className="mb-6">
          <ScoreRing />
        </div>

        <h2 className="font-heading font-extrabold text-ink mb-6 leading-[0.95]" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          WHAT WOULD YOUR
          <br />
          BUSINESS SCORE?
        </h2>

        <a
          href={APP_LOGIN}
          className="inline-flex items-center gap-2 bg-ink text-white font-body font-semibold text-base md:text-lg px-8 py-4 rounded-full hover:bg-black transition-colors mb-3"
        >
          See your score &mdash; free →
        </a>
        <p className="font-body text-ink-3 text-sm">
          Free · No card · 60 seconds
        </p>
      </div>
    </section>
  );
}

function SolutionSection() {
  const features = [
    {
      title: 'Day one fix',
      body: 'Description, photos, hours, categories, services. The full profile sorted in 48 hours.',
    },
    {
      title: 'Weekly posts',
      body: 'Written in your voice about your business. Published every Friday. Google loves fresh profiles.',
    },
    {
      title: 'Review replies',
      body: 'Every review answered within 24 hours. Good ones thanked. Bad ones handled carefully.',
    },
    {
      title: 'Monday stats',
      body: 'Views, calls, ranking, reviews. Texted to your phone at 9am every Monday.',
    },
  ];

  return (
    <section className="py-12 md:py-16 px-6 md:px-8">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-8">
          <div className="font-body font-semibold text-xs uppercase tracking-wider text-orange">
            Then we fix everything
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-paper-card border border-paper-line rounded-2xl p-6"
            >
              <div className="font-heading font-extrabold text-ink text-xl mb-2">{f.title}</div>
              <p className="font-body text-ink-2 text-sm leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SMSMockup() {
  return (
    <section className="py-12 md:py-16 px-6 md:px-8">
      <div className="max-w-sm mx-auto">
        <div className="bg-ink rounded-3xl p-1 shadow-2xl">
          <div className="flex items-center justify-between px-6 py-3">
            <span className="text-white/40 text-xs font-body">09:00</span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-orange flex items-center justify-center">
                <span className="font-heading font-extrabold text-white text-[10px]">C</span>
              </div>
              <span className="font-heading font-extrabold text-white text-sm">Chocka</span>
            </div>
            <span className="text-white/40 text-xs font-body">Mon</span>
          </div>

          <div className="px-4 pb-6">
            <div className="bg-white/10 rounded-2xl rounded-tl-md p-5 text-sm text-white/80 leading-relaxed">
              <p className="mb-3 font-body">
                📊 <span className="font-bold text-white">Your weekly stats</span>
              </p>
              <div className="space-y-1 font-body text-xs">
                <p>
                  Profile views:{' '}
                  <span className="text-white font-bold">847</span>{' '}
                  <span className="text-[#22c55e]">↑ 12%</span>
                </p>
                <p>
                  Calls: <span className="text-white font-bold">8</span>{' '}
                  <span className="text-[#22c55e]">↑ 3</span>
                </p>
                <p>
                  Local ranking:{' '}
                  <span className="text-white font-bold">#2</span>{' '}
                  <span className="text-[#22c55e]">↑ 1</span>
                </p>
                <p>
                  Star rating:{' '}
                  <span className="text-white font-bold">4.7★</span>
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-white/60 text-xs font-body">
                  2 reviews replied to this week ✓
                </p>
                <p className="text-white/60 text-xs font-body">
                  Post going live on Friday 🚀
                </p>
              </div>
            </div>
            <div className="text-white/20 text-xs mt-2 ml-2 font-body">
              Monday 09:00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IndustryRouting() {
  const industries = [
    {
      href: '/for-tradespeople',
      title: 'Tradespeople',
      sub: 'Plumbers, electricians, roofers',
    },
    {
      href: '/for-salons',
      title: 'Salons',
      sub: 'Hair, beauty, barbers, nails',
    },
    {
      href: '/for-restaurants',
      title: 'Restaurants',
      sub: 'Restaurants, cafes, pubs',
    },
    {
      href: '/for-dentists',
      title: 'Dentists',
      sub: 'Practices, orthodontists',
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[960px] mx-auto">
        <div className="text-center mb-8 px-6 md:px-8">
          <div className="font-body font-semibold text-xs uppercase tracking-wider text-orange">
            See how it works for your industry
          </div>
        </div>

        <div
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-8 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {industries.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="bg-paper-card border border-paper-line rounded-2xl p-6 transition-colors hover:border-orange group flex items-center justify-between shrink-0"
              style={{ width: 280, scrollSnapAlign: 'start' }}
            >
              <div>
                <div className="font-heading font-extrabold text-ink text-xl mb-1">
                  {it.title}
                </div>
                <p className="font-body text-ink-3 text-sm">{it.sub}</p>
              </div>
              <span className="font-heading font-extrabold text-ink-3 group-hover:text-orange transition-colors text-xl ml-4">
                →
              </span>
            </Link>
          ))}
          <div className="shrink-0 w-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const features = [
    'Weekly Google posts about your business',
    'Review monitoring & replies',
    'Monday stats by SMS',
    'Profile optimisation on day one',
    'Competitor rank tracking',
    'Q&A management',
    'Photo uploads via text',
  ];

  return (
    <section id="pricing" className="py-12 md:py-16 px-6 md:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-paper-card border border-paper-line rounded-3xl p-10">
          <div className="text-center mb-8">
            <div className="font-heading font-extrabold text-orange text-7xl md:text-8xl leading-none">
              £29
            </div>
            <div className="font-body text-ink-3 text-sm mt-2">
              per month · cancel anytime
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="text-[#22c55e] mt-0.5 shrink-0 font-bold">✓</span>
                <span className="font-body text-ink-2 text-sm">{f}</span>
              </li>
            ))}
          </ul>

          <a
            href={APP_LOGIN}
            className="flex items-center justify-center gap-2 bg-orange text-white font-body font-semibold text-lg px-6 py-4 rounded-full hover:bg-orange-dark transition-colors"
          >
            See what we&rsquo;d fix &mdash; free →
          </a>
          <p className="font-body text-ink-3 text-xs text-center mt-4">
            Set up in 2 minutes · Cancel anytime · No contract
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-14 md:py-18 px-6 md:px-8">
      <div className="max-w-[960px] mx-auto text-center">
        <h2 className="font-heading font-extrabold text-ink mb-8 leading-[0.95] max-w-3xl mx-auto" style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
          TWO MINUTES TO CONNECT.
          <br />
          THEN WE HANDLE IT.
        </h2>
        <a
          href={APP_LOGIN}
          className="inline-flex items-center gap-2 bg-ink text-white font-body font-semibold text-base md:text-lg px-8 py-4 rounded-full hover:bg-black transition-colors"
        >
          See what we&rsquo;d fix &mdash; free →
        </a>
        <p className="font-body text-ink-3 text-sm mt-4">
          £29/month · Cancel anytime
        </p>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="py-12 px-6 md:px-8">
      <div className="max-w-[960px] mx-auto text-center">
        <div className="font-signature text-orange text-4xl mb-3">Liam</div>
        <p className="font-body text-ink-2 text-sm mb-4">
          Built in the North East ·{' '}
          <a
            href="mailto:team@chocka.co.uk"
            className="hover:text-ink transition-colors underline decoration-paper-line underline-offset-4"
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
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="bg-paper min-h-screen">
      <HomeNav />
      <ProblemSection />
      <ScoreTransition />
      <SolutionSection />
      <SMSMockup />
      <IndustryRouting />
      <Pricing />
      <FinalCTA />
      <HomeFooter />
    </div>
  );
}
