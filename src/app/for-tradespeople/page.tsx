import { Metadata } from 'next';
import TradesNav from '@/components/tradespeople/TradesNav';
import TradesHero from '@/components/tradespeople/TradesHero';
import CheckYourScore from '@/components/tradespeople/CheckYourScore';
import TheGap from '@/components/tradespeople/TheGap';
import WeekTimeline from '@/components/tradespeople/WeekTimeline';
import SMSMockup from '@/components/tradespeople/SMSMockup';
import SocialProof from '@/components/tradespeople/SocialProof';
import TradesPricing from '@/components/tradespeople/TradesPricing';
import TradesFinalCTA from '@/components/tradespeople/TradesFinalCTA';

export const metadata: Metadata = {
  title: 'Chocka for Tradespeople — Get More Jobs From Google',
  description:
    'We run your Google Business Profile on autopilot. Weekly posts, review replies, Monday stats by text. £29/month. 2 minute setup.',
};

export default function ForTradespeople() {
  return (
    <div className="bg-black text-white min-h-screen">
      <TradesNav />
      <TradesHero />
      <CheckYourScore />
      <TheGap />
      <WeekTimeline />
      <SMSMockup />
      <SocialProof />
      <TradesPricing />
      <TradesFinalCTA />
    </div>
  );
}
