export default function Pricing() {
  const features = [
    'Weekly Google posts in your voice',
    'Review monitoring & replies',
    'Monday stats by SMS',
    'Profile optimisation on day one',
    'Competitor rank tracking',
    'Q&A management',
    'Photo uploads via text',
  ];

  return (
    <section id="pricing" className="section-padding bg-black text-white">
      <div className="container-max">
        <div className="font-mono text-orange text-sm uppercase tracking-wider mb-4 text-center">
          Pricing
        </div>
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-4 text-center">
          One plan. No surprises.
        </h2>
        <p className="text-soft text-lg mb-16 max-w-xl mx-auto text-center">
          Everything included. No upgrades. No extras. Just results.
        </p>
        <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-3xl p-10">
          <div className="text-center mb-6">
            <div className="font-heading font-extrabold text-7xl text-white">
              £29
            </div>
            <div className="font-mono text-soft text-sm mt-1">
              per month · cancel anytime
            </div>
          </div>

          {/* ROI line */}
          <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm text-white/70 leading-relaxed text-center">
            Average customer generates{' '}
            <span className="text-green font-bold">£2,400</span> in new work
            per month from Google alone. You do the maths.
          </div>

          <ul className="space-y-3 text-left mb-10">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="text-orange mt-0.5">✓</span>
                <span className="text-white/80">{f}</span>
              </li>
            ))}
          </ul>

          <a
            href="https://app.chocka.co.uk/login"
            className="btn-primary w-full justify-center text-xl"
          >
            Get Started · £29/month →
          </a>
          <p className="text-soft text-xs text-center mt-4">
            Set up in 2 minutes · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
