import FadeIn from '../shared/FadeIn';

export default function SocialProof() {
  return (
    <FadeIn>
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="container-max">
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="font-heading font-extrabold text-5xl md:text-6xl text-white mb-2">
                7,101
              </div>
              <div className="text-white/40 text-sm">
                businesses currently ranked in the Chocka Index
              </div>
            </div>
            <div className="text-center">
              <div className="font-heading font-extrabold text-5xl md:text-6xl text-white mb-2">
                NE
              </div>
              <div className="text-white/40 text-sm">
                England covered · expanding nationally
              </div>
            </div>
            <div className="text-center">
              <div className="font-heading font-extrabold text-5xl md:text-6xl text-white mb-2">
                52×
              </div>
              <div className="text-white/40 text-sm">
                scores updated every week
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
