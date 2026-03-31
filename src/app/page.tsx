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

export default function Home() {
  return (
    <>
      <Nav />
      <Ticker />
      <Hero />
      <LeagueTablePreview />
      <ScoringExplainer />
      <BrowseByTrade />
      <BrowseByTown />
      <Footer />
    </>
  );
}
