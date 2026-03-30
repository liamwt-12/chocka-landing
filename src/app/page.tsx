import Nav from '@/components/landing/Nav';
import Ticker from '@/components/landing/Ticker';
import Hero from '@/components/landing/Hero';
import IndexIntro from '@/components/landing/IndexIntro';
import Pain from '@/components/landing/Pain';
import ResultsBar from '@/components/landing/ResultsBar';
import HowItWorks from '@/components/landing/HowItWorks';
import Compare from '@/components/landing/Compare';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <Ticker />
      <Hero />
      <IndexIntro />
      <Pain />
      <ResultsBar />
      <HowItWorks />
      <Compare />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  );
}
