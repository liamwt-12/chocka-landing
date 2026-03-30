export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Connect your Google profile',
      desc: 'Takes 2 minutes. We just need access to manage your listing.',
    },
    {
      num: '02',
      title: 'We optimise everything',
      desc: 'Photos, description, categories, services — all professionally done.',
    },
    {
      num: '03',
      title: 'Weekly Google posts go live',
      desc: 'Fresh content every week to keep your profile active and ranking.',
    },
    {
      num: '04',
      title: 'Reviews get managed',
      desc: 'We respond to every review within 24 hours. Professional and on-brand.',
    },
    {
      num: '05',
      title: 'You get more calls',
      desc: 'More visibility means more calls, more jobs, more revenue.',
    },
  ];

  const timeline = [
    { day: 'Mon', text: 'Profile optimised ✓' },
    { day: 'Tue', text: 'New photos uploaded ✓' },
    { day: 'Wed', text: 'Google Post published ✓' },
    { day: 'Thu', text: '3 reviews responded to ✓' },
    { day: 'Fri', text: 'Weekly report sent ✓' },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-warm">
      <div className="container-max">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-16">
          How it works
        </h2>
        <div className="grid md:grid-cols-2 gap-16 items-start">
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
          <div className="bg-black rounded-3xl p-6 text-white max-w-sm mx-auto">
            <div className="text-center mb-4">
              <div className="text-soft text-xs uppercase tracking-wider mb-1">
                This week at Chocka
              </div>
              <div className="font-heading font-bold text-lg">Your activity</div>
            </div>
            <div className="space-y-3">
              {timeline.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
                >
                  <span className="font-mono text-orange text-sm font-bold w-10">
                    {item.day}
                  </span>
                  <span className="text-white/80 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
