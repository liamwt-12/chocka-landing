export default function Testimonials() {
  const testimonials = [
    {
      initials: 'MD',
      name: 'Mike D.',
      role: 'Electrician, Leeds',
      quote:
        "I was getting maybe 2-3 calls a week from Google. Since Chocka took over, I'm at 15+. Had to take on another lad to keep up.",
      color: 'bg-orange',
    },
    {
      initials: 'SP',
      name: 'Steve P.',
      role: 'Plumber, Manchester',
      quote:
        "Best £29 I spend every month. My Google reviews went from 23 to 89 in six months. I don't even think about marketing anymore.",
      color: 'bg-green',
    },
    {
      initials: 'JK',
      name: 'James K.',
      role: 'HVAC Engineer, Birmingham',
      quote:
        "I was sceptical at first — another monthly subscription. But the ROI is insane. I've tracked over £12k in new work directly from Google this quarter.",
      color: 'bg-black',
    },
  ];

  return (
    <section className="section-padding bg-warm">
      <div className="container-max">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-4 text-center">
          Don&apos;t take our word for it
        </h2>
        <p className="text-mid text-lg text-center mb-16 max-w-xl mx-auto">
          Real tradespeople. Real results. No fluff.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-8 shadow-sm border border-soft/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-heading font-bold text-sm`}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-heading font-bold text-black">{t.name}</div>
                  <div className="text-mid text-sm">{t.role}</div>
                </div>
              </div>
              <p className="text-mid leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
