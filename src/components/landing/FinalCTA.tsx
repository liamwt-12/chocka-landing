export default function FinalCTA() {
  return (
    <section className="bg-orange section-padding text-center relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-mono font-bold text-[12rem] md:text-[20rem] text-white/[0.06] leading-none">
          CHOCKA
        </span>
      </div>

      <div className="container-max relative z-10">
        <h2 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-white mb-6 max-w-4xl mx-auto leading-[0.95]">
          Your profile is costing you jobs right now.
        </h2>
        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Two minutes to connect. Then we handle the rest.
        </p>
        <a
          href="https://app.chocka.co.uk/login"
          className="inline-flex items-center gap-2 bg-white text-orange font-heading font-bold text-xl px-10 py-5 rounded-xl hover:bg-cream transition-colors duration-200"
        >
          Connect Your Google Profile →
        </a>
        <p className="text-white/60 text-sm mt-4">
          £29/month · Cancel anytime
        </p>
      </div>
    </section>
  );
}
