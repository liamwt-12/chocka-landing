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
  title: 'Chocka for Dentists — Get More Patients From Google',
  description:
    'We fix your Google Business Profile then run it on autopilot. Weekly posts, review replies, Monday stats by text. \u00A329/month. Connect in 30 seconds.',
};

export default function ForDentists() {
  return (
    <div className="bg-black text-white min-h-screen">
      <NicheNav label="FOR DENTISTS" href="/for-dentists" />
      <NicheHero
        sectionLabel="For UK Dental Practices"
        subhead={
          "Connect your Google Business Profile and see your real score in 60 seconds. We\u2019ll show you exactly what\u2019s putting patients off \u2014 then fix it."
        }
        ranking="#2 in Durham"
        views="934"
        viewsChange="14%"
        calls="15"
        callsChange="5"
      />
      <HowItWorks />
      <NicheScoreGap
        leadPhrase="Most dental practices"
        lowScore="30"
        highScore="55"
        rankFirstPhrase="The ones patients find first"
      />
      <NicheTheGap
        heading="This is what your practice looks like on Google right now"
        beforeBullets={['No posts', 'No replies', 'Missing services and hours']}
        afterBullets={['Weekly posts', 'All reviews replied', 'Fully optimised']}
      />
      <NicheWeekTimeline
        mondayDesc="Views, calls, ranking. By text. Glance at it between appointments."
        wednesdayDesc="Written in your voice, about your practice. No hashtag spam."
      />
      <NicheSMSMockup
        views="934"
        viewsChange="14%"
        calls="15"
        callsChange="5"
        ranking="#2"
        rankingChange="1"
        starRating="4.8★"
      />
      <SocialProof />
      <NichePricing firstFeature="Weekly Google posts about your practice" />
      <TradesFinalCTA />
    </div>
  );
}
