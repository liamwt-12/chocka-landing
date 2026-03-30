export default function Hero() {
  const stats = [
    { value: '£29', label: 'per month' },
    { value: '2 min', label: 'to set up' },
    { value: '10×', label: 'avg. return' },
    { value: '0', label: 'effort from you' },
  ];

  return (
    <section className="section-padding pt-[120px] md:pt-[140px]">
      <div className="container-max grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left column — copy */}
        <div>
          <h1 className="font-heading font-extrabold uppercase text-6xl md:text-7xl lg:text-8xl text-black leading-[0.9] mb-8">
            Busy
            <br />
            is good.
            <br />
            <span className="text-orange italic">Chocka</span>
            <br />
            is better.
          </h1>
          <p className="text-mid text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            We run your Google profile. You get the calls. Weekly posts, review
            replies, Monday stats by text — completely on autopilot.
          </p>
          <a
            href="https://app.chocka.co.uk/login"
            className="btn-primary text-xl"
          >
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

        {/* Right column — dashboard mockup */}
        <div className="relative">
          {/* Floating badge: Profile ranking */}
          <div className="absolute -top-3 -left-3 md:-left-6 z-10 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green" />
            <span className="text-sm font-heading font-bold text-black">
              Profile ranking #2 ↑
            </span>
          </div>

          {/* Floating badge: Review replied */}
          <div className="absolute -bottom-3 -right-3 md:-right-6 z-10 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange" />
            <span className="text-sm font-heading font-bold text-black">
              Review replied · just now
            </span>
          </div>

          <div className="bg-black rounded-2xl p-5 md:p-6 text-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-orange font-bold text-sm">
                CHOCKA
              </span>
              <span className="w-2 h-2 rounded-full bg-green" />
            </div>

            {/* Business info */}
            <div className="mb-5">
              <div className="font-heading font-bold text-lg flex items-center gap-2">
                D. Mitchell Plumbing
                <span className="w-2 h-2 rounded-full bg-green" />
              </div>
              <div className="text-soft text-sm">
                Plumber · Newcastle upon Tyne
              </div>
            </div>

            {/* Score + Managed cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-soft text-xs mb-1">Profile Score</div>
                <div className="font-heading font-extrabold text-2xl text-white">
                  84<span className="text-soft text-sm font-normal">/100</span>
                </div>
                <div className="mt-1 inline-block bg-green/20 text-green text-xs font-bold px-2 py-0.5 rounded-full">
                  ↑ +58 from setup
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-soft text-xs mb-1">Managed For</div>
                <div className="font-heading font-extrabold text-2xl text-white">
                  11<span className="text-soft text-sm font-normal"> wks</span>
                </div>
                <div className="mt-1 inline-block bg-orange/20 text-orange text-xs font-bold px-2 py-0.5 rounded-full">
                  0 missed
                </div>
              </div>
            </div>

            {/* Value banner */}
            <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <span className="text-soft text-sm">
                Est. work generated
              </span>
              <div className="text-right">
                <span className="font-heading font-bold text-white">
                  £3,480
                </span>
                <span className="text-green text-xs font-bold ml-2">
                  10× return
                </span>
              </div>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center bg-white/5 rounded-lg py-2">
                <div className="font-heading font-bold text-lg">1,847</div>
                <div className="text-soft text-xs">Views</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg py-2">
                <div className="font-heading font-bold text-lg">63</div>
                <div className="text-soft text-xs">Calls</div>
              </div>
              <div className="text-center bg-white/5 rounded-lg py-2">
                <div className="font-heading font-bold text-lg">4.7★</div>
                <div className="text-soft text-xs">Rating</div>
              </div>
            </div>

            {/* Competitor bars */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs text-soft w-28 truncate">
                  You (Mitchell)
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-orange rounded-full h-2"
                    style={{ width: '84%' }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-orange w-6">
                  84
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-soft w-28 truncate">
                  NE Plumbing Co
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-white/30 rounded-full h-2"
                    style={{ width: '71%' }}
                  />
                </div>
                <span className="text-xs font-mono text-soft w-6">71</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-soft w-28 truncate">
                  City Plumbers
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <div
                    className="bg-white/30 rounded-full h-2"
                    style={{ width: '58%' }}
                  />
                </div>
                <span className="text-xs font-mono text-soft w-6">58</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
