import FadeIn from '../shared/FadeIn';
import WaitingList from '../shared/WaitingList';

export default function TradesPricing() {
  return (
    <FadeIn>
      <section id="pricing" className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max max-w-md mx-auto">
          <div className="bg-[#1a1a1a] rounded-3xl p-10 border border-white/5 text-center">
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-3">
              Closed to new signups
            </h2>
            <p className="text-white/50 text-sm mb-8">
              Chocka isn&apos;t taking on new businesses right now. Leave your
              email and we&apos;ll let you know when we reopen.
            </p>
            <WaitingList dark source="Pricing — Tradespeople" />
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
