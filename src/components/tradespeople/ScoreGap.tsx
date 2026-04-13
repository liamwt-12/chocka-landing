import FadeIn from '../shared/FadeIn';

export default function ScoreGap() {
  return (
    <FadeIn>
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="container-max max-w-3xl mx-auto text-center">
          <p className="text-white/60 text-xl md:text-2xl leading-relaxed">
            Most tradespeople in the North East score between{' '}
            <span className="text-orange font-heading font-bold">40</span> and{' '}
            <span className="text-orange font-heading font-bold">60</span>. The
            ones showing up first score{' '}
            <span className="text-emerald-400 font-heading font-bold">80+</span>.
            We&apos;ll tell you where you stand &mdash; and close the gap.
          </p>
        </div>
      </section>
    </FadeIn>
  );
}
