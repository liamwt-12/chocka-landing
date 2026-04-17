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
  title: 'Chocka for Salons — Get More Bookings From Google',
  description:
    'We fix your Google Business Profile then run it on autopilot. Weekly posts, review replies, Monday stats by text. \u00A329/month. Connect in 30 seconds.',
};

export default function ForSalons() {
  return (
    <div className="bg-black text-white min-h-screen">
      <NicheNav label="FOR SALONS" href="/for-salons" />
      <NicheHero
        sectionLabel="For UK Salons"
        subhead={
          "Connect your Google Business Profile and see your real score in 60 seconds. We\u2019ll show you exactly what\u2019s putting clients off \u2014 then fix it."
        }
        ranking="#3 in York"
        views="612"
        viewsChange="18%"
        calls="11"
        callsChange="4"
      />
      <HowItWorks />
      <NicheScoreGap
        leadPhrase="Most salons"
        lowScore="35"
        highScore="55"
        rankFirstPhrase="The ones getting booked first"
      />
      <NicheTheGap
        heading="This is what your salon looks like on Google right now"
        beforeBullets={['No posts', 'No replies', 'Missing services and hours']}
        afterBullets={['Weekly posts', 'All reviews replied', 'Fully optimised']}
      />
      <NicheWeekTimeline
        mondayDesc="Views, calls, ranking. By text. Glance at it between clients."
        wednesdayDesc="Written in your voice, about your treatments. No hashtag spam."
      />
      <NicheSMSMockup
        views="612"
        viewsChange="18%"
        calls="11"
        callsChange="4"
        ranking="#3"
        rankingChange="2"
        starRating="4.9★"
      />
      <SocialProof />
      <NichePricing firstFeature="Weekly Google posts about your salon" />
      <TradesFinalCTA />
    </div>
  );
}
