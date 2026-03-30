export default function FinalCTA() {
  return (
    <section className="bg-orange section-padding text-center">
      <div className="container-max">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-6 max-w-3xl mx-auto leading-tight">
          Your profile is costing you jobs right now.
        </h2>
        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Every day without Chocka is another day your competitors are getting the
          calls you should be getting.
        </p>
        <a
          href="https://app.chocka.co.uk"
          className="inline-flex items-center gap-2 bg-white text-orange font-heading font-bold text-xl px-10 py-5 rounded-xl hover:bg-cream transition-colors duration-200"
        >
          Start Getting More Jobs →
        </a>
      </div>
    </section>
  );
}
