export default function Testimonials() {
  const testimonials = [
    {
      initials: 'MD',
      name: 'Mike D.',
      role: 'Electrician · Leeds',
      quote:
        "Honestly didn't think it'd do anything. Getting calls I never got before though so can't argue with that.",
      badge: '4.1→4.8',
      color: 'bg-orange',
    },
    {
      initials: 'SP',
      name: 'Steve P.',
      role: 'Plumber · Manchester',
      quote:
        'My profile was dead for over a year. Now it\'s the main place people find me. Mad.',
      badge: '0→47',
      color: 'bg-green',
    },
    {
      initials: 'JK',
      name: 'James K.',
      role: 'HVAC · Birmingham',
      quote:
        "Best £29 I spend. Set it up on a Monday, had 3 calls by Friday. No idea why I didn't do this sooner.",
      badge: '£2,400/mo',
      color: 'bg-black',
    },
  ];

  return (
    <section className="section-padding bg-warm">
      <div className="container-max">
        <div className="font-mono text-orange text-sm uppercase tracking-wider mb-4 text-center">
          Early results
        </div>
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-16 text-center">
          What our first users are seeing
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-8 shadow-sm border border-soft/20"
            >
              {/* Stars + badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="text-orange text-sm tracking-wide">★★★★★</div>
                <span className="bg-orange/10 text-orange text-xs font-heading font-bold px-2.5 py-1 rounded-full">
                  {t.badge}
                </span>
              </div>
              {/* Quote */}
              <p className="text-mid leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-heading font-bold text-xs`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-heading font-bold text-black text-sm">
                    {t.name}
                  </div>
                  <div className="text-mid text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
