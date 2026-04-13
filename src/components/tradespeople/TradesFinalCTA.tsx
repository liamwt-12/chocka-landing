export default function TradesFinalCTA() {
  return (
    <section className="bg-orange py-20 md:py-28 px-6 md:px-12 lg:px-20 text-center relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-heading font-bold text-[12rem] md:text-[20rem] text-white/[0.06] leading-none">
          CHOCKA
        </span>
      </div>

      <div className="container-max relative z-10">
        <h2 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-white mb-6 max-w-4xl mx-auto leading-[0.95]">
          Two minutes to connect. Then we handle it.
        </h2>
        <a
          href="https://app.chocka.co.uk/login"
          className="inline-flex items-center gap-2 bg-white text-orange font-heading font-bold text-xl px-10 py-5 rounded-xl hover:bg-cream transition-colors duration-200"
        >
          See what we&apos;d fix &mdash; free →
        </a>
        <p className="text-white/60 text-sm mt-4">£29/month · Cancel anytime</p>
      </div>
    </section>
  );
}
