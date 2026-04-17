import FadeIn from '../shared/FadeIn';

type Props = {
  leadPhrase: string;
  lowScore: string;
  highScore: string;
  rankFirstPhrase: string;
};

export default function NicheScoreGap({
  leadPhrase,
  lowScore,
  highScore,
  rankFirstPhrase,
}: Props) {
  return (
    <FadeIn>
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-20">
        <div className="container-max max-w-3xl mx-auto text-center">
          <p className="text-white/60 text-xl md:text-2xl leading-relaxed">
            {leadPhrase} score between{' '}
            <span className="text-orange font-heading font-bold">{lowScore}</span>{' '}
            and{' '}
            <span className="text-orange font-heading font-bold">{highScore}</span>
            . {rankFirstPhrase} score{' '}
            <span className="text-emerald-400 font-heading font-bold">80+</span>.
            We&apos;ll tell you where you stand &mdash; and close the gap.
          </p>
        </div>
      </section>
    </FadeIn>
  );
}
