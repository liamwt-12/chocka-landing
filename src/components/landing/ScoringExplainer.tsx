import FadeIn from '../shared/FadeIn';

const SIGNALS = [
  {
    name: 'Star Rating',
    points: 40,
    desc: 'Your average Google review rating. Higher stars = higher score.',
  },
  {
    name: 'Review Volume',
    points: 25,
    desc: 'Total number of Google reviews. More reviews signal trust and credibility.',
  },
  {
    name: 'Review Recency',
    points: 15,
    desc: "Reviews from the last 90 days. Recent activity shows you're still trading.",
  },
  {
    name: 'Profile Completeness',
    points: 10,
    desc: 'Description, hours, phone, website, and photos. Complete profiles rank better.',
  },
  {
    name: 'Response Rate',
    points: 10,
    desc: 'How often you reply to reviews. Google rewards businesses that engage.',
  },
];

export default function ScoringExplainer() {
  return (
    <FadeIn>
      <section id="scoring" className="section-padding bg-warm">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-4">
              Transparent. Objective. Updated every week.
            </h2>
            <p className="text-mid text-lg max-w-2xl mx-auto leading-relaxed">
              Every score is calculated from real, public Google data. No
              business can pay to rank higher. No algorithm black box.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SIGNALS.map((signal) => (
              <div
                key={signal.name}
                className="bg-white rounded-2xl p-6 border border-soft/15 hover:border-orange/30 hover:shadow-md transition-all"
              >
                <div className="font-mono text-orange text-2xl font-bold mb-1">
                  {signal.points}
                </div>
                <div className="text-xs text-soft font-mono uppercase tracking-wider mb-3">
                  points
                </div>
                <h3 className="font-heading font-bold text-lg text-black mb-2">
                  {signal.name}
                </h3>
                <p className="text-mid text-sm leading-relaxed">
                  {signal.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
