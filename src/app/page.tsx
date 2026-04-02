import { Metadata } from 'next';
import Nav from '@/components/landing/Nav';
import Ticker from '@/components/landing/Ticker';
import Hero from '@/components/landing/Hero';
import LeagueTablePreview from '@/components/landing/LeagueTablePreview';
import ScoringExplainer from '@/components/landing/ScoringExplainer';
import BrowseByTrade from '@/components/landing/BrowseByTrade';
import BrowseByTown from '@/components/landing/BrowseByTown';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Chocka Index — UK Tradesperson Rankings',
  description:
    'Find the best tradesperson near you. Every tradesperson scored out of 100 based on real Google data. No business can pay to rank higher. Updated weekly.',
};

function SocialProof() {
  return (
    <section className="py-10 md:py-14 px-6 md:px-12 lg:px-20 bg-cream">
      <div className="container-max text-center">
        <p className="font-heading font-bold text-xl md:text-2xl text-black mb-2">
          7,101 businesses ranked across NE England
        </p>
        <p className="text-mid text-sm md:text-base mb-6">
          Updated weekly · Free to search · No business can pay to rank higher
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <span className="bg-white border border-soft/20 rounded-full px-4 py-2 text-sm font-heading font-bold text-black">
            15 towns
          </span>
          <span className="bg-white border border-soft/20 rounded-full px-4 py-2 text-sm font-heading font-bold text-black">
            20 trades
          </span>
          <span className="bg-white border border-soft/20 rounded-full px-4 py-2 text-sm font-heading font-bold text-black">
            Weekly updates
          </span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <Ticker />
      <Hero />
      <SocialProof />
      <LeagueTablePreview />
      <ScoringExplainer />
      <BrowseByTrade />
      <BrowseByTown />
      <Footer />
    </>
  );
}
