import FadeIn from '../shared/FadeIn';

export default function SMSMockup() {
  return (
    <FadeIn>
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max max-w-sm mx-auto">
          {/* iPhone-style SMS card */}
          <div className="bg-[#1a1a1a] rounded-3xl p-1 border border-white/10 shadow-2xl">
            {/* Status bar */}
            <div className="flex items-center justify-between px-6 py-3">
              <span className="text-white/40 text-xs font-mono">09:00</span>
              <span className="font-heading font-bold text-white text-sm">
                Chocka
              </span>
              <span className="text-white/40 text-xs">Mon</span>
            </div>

            {/* Message bubble */}
            <div className="px-4 pb-6">
              <div className="bg-white/10 rounded-2xl rounded-tl-md p-5 text-sm text-white/80 leading-relaxed">
                <p className="mb-3">
                  📊{' '}
                  <span className="font-bold text-white">
                    Your weekly stats
                  </span>
                </p>
                <div className="space-y-1 font-mono text-xs">
                  <p>
                    Profile views:{' '}
                    <span className="text-white font-bold">847</span>{' '}
                    <span className="text-emerald-400">↑ 12%</span>
                  </p>
                  <p>
                    Calls: <span className="text-white font-bold">8</span>{' '}
                    <span className="text-emerald-400">↑ 3</span>
                  </p>
                  <p>
                    Local ranking:{' '}
                    <span className="text-white font-bold">#2</span>{' '}
                    <span className="text-emerald-400">↑ 1</span>
                  </p>
                  <p>
                    Star rating:{' '}
                    <span className="text-white font-bold">4.7★</span>
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-white/60 text-xs">
                    2 reviews replied to this week ✓
                  </p>
                  <p className="text-white/60 text-xs">
                    Post going live on Friday 🚀
                  </p>
                </div>
              </div>
              <div className="text-white/20 text-xs mt-2 ml-2">
                Monday 09:00
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
