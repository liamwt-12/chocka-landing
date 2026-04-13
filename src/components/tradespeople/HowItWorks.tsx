import FadeIn from '../shared/FadeIn';

const STEPS = [
  {
    num: '01',
    title: 'Connect your Google profile',
    desc: '30 seconds. No card needed. We just need read access to see your current profile.',
  },
  {
    num: '02',
    title: 'See your real score',
    desc: 'Scored out of 100. We show you exactly what\u2019s wrong \u2014 missing replies, stale posts, incomplete profile.',
  },
  {
    num: '03',
    title: 'We fix it',
    desc: 'We write the fixes \u2014 you preview them. One tap and they go live on your Google profile.',
  },
  {
    num: '04',
    title: 'We run it for you',
    desc: 'Weekly posts, review replies, Monday stats by text. Your score goes up. Your phone rings more.',
  },
];

export default function HowItWorks() {
  return (
    <FadeIn>
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4 text-center">
            How it works
          </h2>
          <p className="text-white/40 text-lg text-center mb-16">
            From connect to managed in under two minutes.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 hover:border-orange/20 transition-colors"
              >
                <div className="font-mono text-orange text-xs font-bold bg-orange/10 px-2.5 py-1 rounded inline-block mb-4">
                  STEP {step.num}
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
