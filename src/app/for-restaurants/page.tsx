import { Metadata } from 'next';
import NicheNav from '@/components/niche/NicheNav';
import NicheHero from '@/components/niche/NicheHero';
import HowItWorks from '@/components/tradespeople/HowItWorks';
import NicheScoreGap from '@/components/niche/NicheScoreGap';
import NicheTheGap from '@/components/niche/NicheTheGap';
import NicheWeekTimeline from '@/components/niche/NicheWeekTimeline';
import NicheSMSMockup from '@/components/niche/NicheSMSMockup';
import SocialProof from '@/components/tradespeople/SocialProof';
import NichePricing from '@/components/niche/NichePricing';
import TradesFinalCTA from '@/components/tradespeople/TradesFinalCTA';

export const metadata: Metadata = {
  title: 'Chocka for Restaurants — Get More Covers From Google',
  description:
    'We fix your Google Business Profile then run it on autopilot. Weekly posts, review replies, Monday stats by text. Chocka is currently closed to new signups.',
};

export default function ForRestaurants() {
  return (
    <div className="bg-black text-white min-h-screen">
      <NicheNav label="FOR RESTAURANTS" href="/for-restaurants" />
      <NicheHero
        sectionLabel="For UK Restaurants"
        subhead={
          "Connect your Google Business Profile and see your real score in 60 seconds. We\u2019ll show you exactly what\u2019s turning diners away \u2014 then fix it."
        }
        ranking="#4 in Newcastle"
        views="1,203"
        viewsChange="22%"
        calls="9"
        callsChange="3"
      />
      <HowItWorks />
      <NicheScoreGap
        leadPhrase="Most restaurants"
        lowScore="35"
        highScore="55"
        rankFirstPhrase="The ones filling tables from Google"
      />
      <NicheTheGap
        heading="This is what your restaurant looks like on Google right now"
        beforeBullets={['No posts', 'No replies', 'No menu, missing hours']}
        afterBullets={['Weekly posts', 'All reviews replied', 'Menu and hours current']}
      />
      <NicheWeekTimeline
        mondayDesc="Views, calls, ranking. By text. Glance at it before service."
        wednesdayDesc="Written in your voice, about your food and space. No hashtag spam."
      />
      <NicheSMSMockup
        views="1,203"
        viewsChange="22%"
        calls="9"
        callsChange="3"
        ranking="#4"
        rankingChange="2"
        starRating="4.6★"
      />
      <SocialProof />
      <NichePricing />
      <TradesFinalCTA />
    </div>
  );
}
