import { Metadata } from 'next';
import TradesNav from '@/components/tradespeople/TradesNav';
import TradesHero from '@/components/tradespeople/TradesHero';
import HowItWorks from '@/components/tradespeople/HowItWorks';
import ScoreGap from '@/components/tradespeople/ScoreGap';
import TheGap from '@/components/tradespeople/TheGap';
import WeekTimeline from '@/components/tradespeople/WeekTimeline';
import SMSMockup from '@/components/tradespeople/SMSMockup';
import SocialProof from '@/components/tradespeople/SocialProof';
import TradesPricing from '@/components/tradespeople/TradesPricing';
import TradesFinalCTA from '@/components/tradespeople/TradesFinalCTA';

export const metadata: Metadata = {
  title: 'Chocka for Tradespeople — Get More Jobs From Google',
  description:
    'We fix your Google Business Profile then run it on autopilot. Weekly posts, review replies, Monday stats by text. Chocka is currently closed to new signups.',
};

export default function ForTradespeople() {
  return (
    <div className="bg-black text-white min-h-screen">
      <TradesNav />
      <TradesHero />
      <HowItWorks />
      <ScoreGap />
      <TheGap />
      <WeekTimeline />
      <SMSMockup />
      <SocialProof />
      <TradesPricing />
      <TradesFinalCTA />
    </div>
  );
}
