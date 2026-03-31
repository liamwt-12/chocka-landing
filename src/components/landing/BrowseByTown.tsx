import Link from 'next/link';
import { NE_TOWNS, townSlug } from '@/lib/constants';
import FadeIn from '../shared/FadeIn';

export default function BrowseByTown() {
  return (
    <FadeIn>
      <section id="towns" className="section-padding bg-warm">
        <div className="container-max">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-black mb-4">
            Browse by town
          </h2>
          <p className="text-mid text-lg mb-12">
            15 towns across NE England.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {NE_TOWNS.map((town) => (
              <Link
                key={town}
                href={`/index/${townSlug(town)}`}
                className="bg-white rounded-xl px-5 py-4 font-heading font-bold text-sm text-black border border-soft/15 hover:border-orange/30 hover:shadow-md hover:text-orange transition-all"
              >
                {town}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
