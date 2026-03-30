'use client';

import Link from 'next/link';
import IndexSearch from '@/components/shared/IndexSearch';
import EmailCapture from '@/components/shared/EmailCapture';
import { NE_TOWNS, TRADES, TRADE_EMOJIS, townSlug, tradeSlug } from '@/lib/constants';

const stats = [
  { value: '100k+', label: 'Businesses ranked' },
  { value: '500', label: 'UK towns' },
  { value: '20', label: 'Trades covered' },
  { value: 'Weekly', label: 'Updates' },
];

const steps = [
  {
    num: '01',
    title: 'We scan Google',
    desc: 'Every week, we pull data from Google Business Profiles for every tradesperson in your area.',
  },
  {
    num: '02',
    title: 'We calculate scores',
    desc: 'Our algorithm scores each business on reviews, ratings, response time, and profile completeness.',
  },
  {
    num: '03',
    title: 'We rank them',
    desc: 'Businesses are ranked by town and trade. The best rise to the top. Updated every week.',
  },
];

export default function IndexHomePage() {
  return (
    <main>
      <section className="bg-black text-white section-padding pt-16">
        <div className="container-max text-center">
          <Link href="/" className="font-mono text-lg text-orange mb-8 inline-block">
            CHOCKA
          </Link>
          <h1 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            The UK&apos;s most trusted
            <br />
            <span className="text-orange">tradesperson rankings</span>
          </h1>
          <p className="text-soft text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Find the best-rated tradespeople in your town. Ranked by reviews, response
            time, and profile quality. Updated every week.
          </p>
          <div className="max-w-2xl mx-auto mb-12">
            <IndexSearch />
          </div>
          <div className="flex justify-center gap-10 md:gap-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading font-bold text-3xl text-white">
                  {stat.value}
                </div>
                <div className="text-soft text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-max">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-black mb-2">
            Browse by town
          </h2>
          <p className="text-mid mb-10">
            North East England — more regions coming soon
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {NE_TOWNS.map((town) => (
              <Link
                key={town}
                href={`/index/${townSlug(town)}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-md hover:ring-2 hover:ring-orange/20 transition-all border border-soft/20"
              >
                <div className="font-heading font-bold text-black">{town}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream">
        <div className="container-max">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-black mb-10">
            Browse by trade
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {TRADES.map((trade) => (
              <Link
                key={trade}
                href={`/index/${tradeSlug(trade)}`}
                className="bg-white rounded-xl p-5 text-center hover:shadow-md hover:ring-2 hover:ring-orange/20 transition-all border border-soft/20"
              >
                <div className="text-2xl mb-2">{TRADE_EMOJIS[trade]}</div>
                <div className="font-heading font-bold text-sm text-black">
                  {trade}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-black mb-16">
            How the Chocka Index works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.num}>
                <div className="font-mono text-orange font-bold text-sm mb-3">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-xl text-black mb-2">
                  {step.title}
                </h3>
                <p className="text-mid leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-warm">
        <div className="container-max max-w-xl mx-auto">
          <EmailCapture />
        </div>
      </section>

      <section className="bg-black py-12 text-center">
        <Link href="/" className="font-mono text-orange text-lg hover:underline">
          ← Back to chocka.co.uk
        </Link>
      </section>
    </main>
  );
}
