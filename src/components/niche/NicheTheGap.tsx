import FadeIn from '../shared/FadeIn';

type Props = {
  heading: string;
  beforeBullets: [string, string, string];
  afterBullets: [string, string, string];
};

export default function NicheTheGap({
  heading,
  beforeBullets,
  afterBullets,
}: Props) {
  return (
    <FadeIn>
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max max-w-4xl mx-auto">
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4 text-center">
            {heading}
          </h2>
          <p className="text-white/40 text-center mb-12">
            The gap between managed and unmanaged profiles is growing every
            week.
          </p>

          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
            {/* Before */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-red-500/20">
              <div className="font-heading font-extrabold text-6xl text-red-400 mb-2">
                31
              </div>
              <div className="inline-flex px-2.5 py-1 rounded-full bg-red-400/10 text-red-400 text-xs font-bold mb-4">
                Poor
              </div>
              <div className="text-white/30 text-sm font-mono uppercase tracking-wider mb-4">
                Without Chocka
              </div>
              <ul className="space-y-2 text-white/40 text-sm">
                {beforeBullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="text-red-400">✕</span> {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="text-orange text-4xl font-heading font-bold">
                →
              </div>
            </div>
            <div className="md:hidden flex items-center justify-center py-2">
              <div className="text-orange text-4xl font-heading font-bold">
                ↓
              </div>
            </div>

            {/* After */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-emerald-500/20">
              <div className="font-heading font-extrabold text-6xl text-emerald-400 mb-2">
                84
              </div>
              <div className="inline-flex px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold mb-4">
                Excellent
              </div>
              <div className="text-white/30 text-sm font-mono uppercase tracking-wider mb-4">
                After 8 weeks
              </div>
              <ul className="space-y-2 text-white/60 text-sm">
                {afterBullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
