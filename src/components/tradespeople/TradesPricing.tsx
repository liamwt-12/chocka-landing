import FadeIn from '../shared/FadeIn';

const FEATURES = [
  'Weekly Google posts in your voice',
  'Review monitoring & replies',
  'Monday stats by SMS',
  'Profile optimisation on day one',
  'Competitor rank tracking',
  'Q&A management',
  'Photo uploads via text',
];

export default function TradesPricing() {
  return (
    <FadeIn>
      <section id="pricing" className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max max-w-md mx-auto">
          <div className="bg-[#1a1a1a] rounded-3xl p-10 border border-white/5">
            <div className="text-center mb-8">
              <div className="font-heading font-extrabold text-8xl text-white">
                £29
              </div>
              <div className="font-mono text-white/40 text-sm mt-2">
                per month · cancel anytime
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="text-orange mt-0.5 shrink-0">✓</span>
                  <span className="text-white/70 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-center">
              <span className="text-white/50 text-sm">Annual: </span>
              <span className="text-white font-heading font-bold">
                £229/year
              </span>
              <span className="text-emerald-400 text-sm font-bold ml-2">
                save £119
              </span>
            </div>

            <a
              href="https://app.chocka.co.uk/login"
              className="btn-primary w-full justify-center text-xl"
            >
              See what we&apos;d fix &mdash; free →
            </a>
            <p className="text-white/30 text-xs text-center mt-4">
              Set up in 2 minutes · Cancel anytime · No contract
            </p>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
