import FadeIn from '../shared/FadeIn';

type Props = {
  mondayDesc: string;
  wednesdayDesc: string;
};

export default function NicheWeekTimeline({
  mondayDesc,
  wednesdayDesc,
}: Props) {
  const timeline = [
    {
      day: 'MON',
      emoji: '📊',
      title: 'Stats in your pocket',
      desc: mondayDesc,
    },
    {
      day: 'TUE',
      emoji: '⭐',
      title: 'Reviews get replied to',
      desc: 'We draft it. You approve in one tap.',
    },
    {
      day: 'WED',
      emoji: '✏️',
      title: 'Post drafted',
      desc: wednesdayDesc,
    },
    {
      day: 'FRI',
      emoji: '🚀',
      title: 'Post goes live',
      desc: 'Profile stays fresh. Algorithm happy. Phone keeps ringing.',
    },
  ];

  return (
    <FadeIn>
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-4 text-center">
            What happens when you connect
          </h2>
          <p className="text-white/40 text-lg text-center mb-16">
            A typical week with Chocka.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {timeline.map((item) => (
              <div
                key={item.day}
                className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 hover:border-orange/20 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-orange text-xs font-bold bg-orange/10 px-2.5 py-1 rounded">
                    {item.day}
                  </span>
                  <span className="text-xl">{item.emoji}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
