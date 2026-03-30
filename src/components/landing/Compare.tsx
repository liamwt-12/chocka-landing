export default function Compare() {
  const diyItems = [
    'Research Google best practices',
    'Write and optimise your bio',
    'Take and upload professional photos',
    'Write a Google Post every week',
    'Respond to every review promptly',
    'Update hours and services regularly',
    'Track your rankings and metrics',
  ];

  const chockaItems = [
    'Connect your profile in 2 minutes',
    'We do literally everything else',
    '...every single week',
    '...professionally',
    '...for £29/month',
    '...with zero effort from you',
    '...and you get more jobs',
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-max">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-4 text-center">
          You could do this yourself.
          <br />
          <span className="text-orange">But you won&apos;t.</span>
        </h2>
        <p className="text-mid text-lg text-center mb-16 max-w-xl mx-auto">
          Be honest — when was the last time you posted on Google? Exactly.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border border-soft/30">
            <h3 className="font-heading font-bold text-xl text-black mb-6">
              🤦 Doing it yourself
            </h3>
            <ul className="space-y-3">
              {diyItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-mid">
                  <span className="text-soft mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-soft/30">
              <div className="font-heading font-bold text-2xl text-black">
                5+ hours/week
              </div>
              <div className="text-mid text-sm">If you actually did it</div>
            </div>
          </div>
          <div className="bg-black rounded-2xl p-8 text-white ring-2 ring-orange">
            <h3 className="font-heading font-bold text-xl mb-6">
              🚀 With Chocka
            </h3>
            <ul className="space-y-3">
              {chockaItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/80">
                  <span className="text-orange mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="font-heading font-bold text-2xl text-orange">
                £29/month
              </div>
              <div className="text-soft text-sm">Zero effort. Guaranteed results.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
