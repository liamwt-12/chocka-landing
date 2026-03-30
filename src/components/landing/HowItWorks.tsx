export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Connect your Google profile',
      desc: 'One click, 30 seconds. We get read/write access to your Google Business Profile. Nothing else.',
    },
    {
      num: '02',
      title: 'We score and fix it immediately',
      desc: "You see your profile score and exactly what we'd change. Pay, and we fix it right then and there.",
    },
    {
      num: '03',
      title: 'Weekly posts go live automatically',
      desc: 'Written in your voice, about your trade, in your area. No hashtag spam. Just sounds like you.',
    },
    {
      num: '04',
      title: 'Reviews get replied to',
      desc: 'We draft replies and send them. You get a text to approve in one word. Done before the kettle boils.',
    },
    {
      num: '05',
      title: 'Monday stats land in your pocket',
      desc: 'Views, calls, ranking. All by text. Glance at it in the van and smile.',
    },
  ];

  const timeline = [
    {
      day: 'MON',
      title: 'Stats in your pocket · 09:00',
      desc: 'Views ↑12%, 8 calls, ranking #2. Read it in the van.',
      emoji: '📊',
    },
    {
      day: 'TUE',
      title: 'Review reply sent',
      desc: 'Sarah left 5 stars. We drafted a reply. You approved it in one tap.',
      emoji: '⭐',
    },
    {
      day: 'WED',
      title: 'Post drafted for your trade',
      desc: '"Boiler install in Jesmond..." — written in your voice, ready to go.',
      emoji: '✏️',
    },
    {
      day: 'FRI',
      title: 'Post goes live on Google',
      desc: 'Profile stays fresh. Algorithm stays happy. Phone keeps ringing.',
      emoji: '🚀',
    },
    {
      day: 'ALL',
      title: 'Profile monitored daily',
      desc: "Reviews, Q&A, ranking. We're watching so you don't have to.",
      emoji: '👁',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-warm">
      <div className="container-max">
        <div className="font-mono text-orange text-sm uppercase tracking-wider mb-4">
          How it works
        </div>
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-16 leading-tight">
          Two minutes to connect.
          <br />
          <span className="text-orange">Then we handle it.</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-6">
                <div className="font-mono text-orange font-bold text-sm mt-1">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-black mb-1">
                    {step.title}
                  </h3>
                  <p className="text-mid leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right column — phone mockup + timeline */}
          <div className="space-y-6">
            {/* SMS Phone mockup */}
            <div className="bg-black rounded-3xl p-5 text-white max-w-sm mx-auto">
              <div className="text-center mb-3">
                <div className="text-soft text-xs">Monday 09:00</div>
                <div className="font-heading font-bold text-sm">
                  Chocka
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-sm leading-relaxed">
                <p className="mb-2">📊 <span className="font-bold">Your weekly stats</span></p>
                <p>Profile views: 847 ↑ 12%</p>
                <p>Calls: 8 ↑ 3</p>
                <p>Local ranking: #2 ↑ 1</p>
                <p>Star rating: 4.7★</p>
                <p className="mt-2">2 reviews replied to this week ✓</p>
                <p>Post going live on Friday 🚀</p>
              </div>
            </div>

            {/* Week timeline */}
            <div className="bg-black rounded-2xl overflow-hidden max-w-sm mx-auto">
              <div className="px-5 py-3 border-b border-white/10">
                <div className="font-heading font-bold text-white text-sm">
                  Your week with Chocka
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {timeline.map((item) => (
                  <div key={item.day} className="px-5 py-3 flex gap-3">
                    <div className="font-mono text-orange text-xs font-bold w-8 pt-0.5 shrink-0">
                      {item.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium">
                        {item.title}
                      </div>
                      <div className="text-soft text-xs mt-0.5 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                    <div className="text-base shrink-0">{item.emoji}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
