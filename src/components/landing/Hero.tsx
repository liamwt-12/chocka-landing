export default function Hero() {
  const stats = [
    { value: '£29/mo', label: 'Simple pricing' },
    { value: '2 min', label: 'Setup time' },
    { value: '10×', label: 'Avg return' },
    { value: '0', label: 'Effort required' },
  ];

  return (
    <section className="section-padding pt-32 md:pt-40">
      <div className="container-max grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-black leading-[0.95] mb-6">
            Busy is good.
            <br />
            <span className="text-orange">Chocka</span> is better.
          </h1>
          <p className="text-mid text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            We manage your Google Business Profile so you get more calls, more
            reviews, and more revenue. Fully automated. No effort from you.
          </p>
          <a href="https://app.chocka.co.uk" className="btn-primary text-xl">
            Connect Your Google Profile →
          </a>
          <div className="grid grid-cols-4 gap-4 mt-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-heading font-bold text-2xl md:text-3xl text-black">
                  {stat.value}
                </div>
                <div className="text-soft text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="bg-black rounded-2xl p-6 md:p-8 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center font-heading font-bold text-sm">
                MP
              </div>
              <div>
                <div className="font-heading font-bold">Mike&apos;s Plumbing</div>
                <div className="text-soft text-sm">Newcastle upon Tyne</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-soft text-sm">Profile views this month</span>
                <span className="font-heading font-bold text-2xl text-orange">1,847</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-orange rounded-full h-2 w-[85%]" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="font-heading font-bold text-xl">4.9</div>
                  <div className="text-soft text-xs">Rating</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-bold text-xl">127</div>
                  <div className="text-soft text-xs">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="font-heading font-bold text-xl">34</div>
                  <div className="text-soft text-xs">Calls</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
