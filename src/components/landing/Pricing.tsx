export default function Pricing() {
  const features = [
    'Full Google Business Profile management',
    'Weekly Google Posts',
    'Review response within 24 hours',
    'Professional photo optimisation',
    'Monthly performance report',
    'Dedicated account manager',
    'Cancel anytime — no contract',
  ];

  return (
    <section id="pricing" className="section-padding bg-black text-white">
      <div className="container-max text-center">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl mb-4">
          One plan. One price.
          <br />
          <span className="text-orange">No surprises.</span>
        </h2>
        <p className="text-soft text-lg mb-16 max-w-xl mx-auto">
          Everything you need to dominate Google in your area. Nothing you don&apos;t.
        </p>
        <div className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-3xl p-10">
          <div className="font-mono text-orange text-sm uppercase tracking-wider mb-2">
            Chocka Pro
          </div>
          <div className="flex items-end justify-center gap-1 mb-2">
            <span className="font-heading font-extrabold text-6xl text-white">£29</span>
            <span className="text-soft text-lg mb-2">/month</span>
          </div>
          <p className="text-soft text-sm mb-8">+ VAT · Cancel anytime</p>
          <ul className="space-y-3 text-left mb-10">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="text-orange mt-0.5">✓</span>
                <span className="text-white/80">{f}</span>
              </li>
            ))}
          </ul>
          <a href="https://app.chocka.co.uk" className="btn-primary w-full justify-center text-xl">
            Get Started →
          </a>
        </div>
      </div>
    </section>
  );
}
