export default function Pain() {
  const cards = [
    {
      emoji: '😬',
      quote:
        "I keep meaning to sort my Google profile but I never get round to it. Been saying it for two years.",
      name: 'Every tradesperson, ever',
    },
    {
      emoji: '📱',
      quote:
        "Someone left me a bad review six months ago and I still haven't replied. Don't even know what to say.",
      name: 'Plumber, Manchester',
    },
    {
      emoji: '🔇',
      quote:
        "My mate got 12 calls last week from Google. I got none. Same area, same trade. His profile just looks better.",
      name: 'Electrician, Leeds',
    },
  ];

  return (
    <section className="section-padding bg-black text-white">
      <div className="container-max">
        <div className="font-mono text-orange text-sm uppercase tracking-wider mb-4">
          Sound familiar?
        </div>
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl max-w-3xl mb-16 leading-tight">
          You&apos;re good at your job.
          <br />
          <span className="text-orange">
            Your Google profile doesn&apos;t show it.
          </span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="text-3xl mb-4">{card.emoji}</div>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                &ldquo;{card.quote}&rdquo;
              </p>
              <div className="text-soft text-sm">— {card.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
