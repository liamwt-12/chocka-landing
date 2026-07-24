import WaitingList from '../shared/WaitingList';

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
          Chocka is closed to new signups.
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          We&apos;re not taking on new businesses right now. Join the waiting list
          and we&apos;ll let you know when we reopen.
        </p>
        <WaitingList source="Final CTA" />
      </div>
    </section>
  );
}
