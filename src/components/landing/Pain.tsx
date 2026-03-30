export default function Pain() {
  const cards = [
    {
      quote: "I've got 15 years experience but my Google listing looks like I started yesterday.",
      name: 'Dave R.',
      trade: 'Plumber, Sunderland',
    },
    {
      quote: "I know I need to sort my Google out but I haven't got the time between jobs.",
      name: 'Mark T.',
      trade: 'Electrician, Newcastle',
    },
    {
      quote: "Lads half my age are getting all the calls because they're higher up on Google.",
      name: 'Paul S.',
      trade: 'Builder, Gateshead',
    },
  ];

  return (
    <section className="section-padding bg-black text-white">
      <div className="container-max">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl max-w-3xl mb-16 leading-tight">
          You&apos;re good at your job.
          <br />
          <span className="text-orange">Your Google profile doesn&apos;t show it.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <p className="text-lg text-white/80 mb-6 leading-relaxed italic">
                &ldquo;{card.quote}&rdquo;
              </p>
              <div>
                <div className="font-heading font-bold text-white">{card.name}</div>
                <div className="text-soft text-sm">{card.trade}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
