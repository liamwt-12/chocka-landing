export default function Compare() {
  const diyItems = [
    'Remember to post every week',
    'Write replies to every review',
    'Check your stats manually',
    'Upload photos regularly',
    'Research keywords',
    'Monitor competitors',
  ];

  const chockaItems = [
    'Posts go live automatically',
    'Review replies drafted and sent',
    'Stats texted every Monday',
    'Photos uploaded via text',
    'Optimised by us, constantly',
    'Competitor tracking included',
  ];

  return (
    <section className="section-padding bg-cream">
      <div className="container-max">
        <div className="font-mono text-orange text-sm uppercase tracking-wider mb-4 text-center">
          The honest comparison
        </div>
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-16 text-center leading-tight">
          You could do this yourself.
          <br />
          <span className="text-orange">But you won&apos;t.</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* DIY card */}
          <div className="bg-white rounded-2xl p-8 border border-soft/30">
            <h3 className="font-heading font-bold text-xl text-black mb-1">
              Doing it yourself
            </h3>
            <p className="text-soft text-sm mb-6">2–3hrs every week you don&apos;t have</p>
            <ul className="space-y-3">
              {diyItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-mid">
                  <span className="text-soft mt-0.5">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Chocka card */}
          <div className="bg-black rounded-2xl p-8 text-white ring-2 ring-orange">
            <h3 className="font-heading font-bold text-xl mb-1">
              With Chocka
            </h3>
            <p className="text-soft text-sm mb-6">30 sec reading a text on Monday</p>
            <ul className="space-y-3">
              {chockaItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/80">
                  <span className="text-orange mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
