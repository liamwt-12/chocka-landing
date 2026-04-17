import { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Chocka for Salons — See your salon score',
  description:
    'Your clients check Google before they book. Find out what they\u2019re seeing, and what\u2019s putting them off.',
};

export default function SalonsPage() {
  return (
    <LandingPage
      heroNiche="SALON"
      subhead="Your clients check Google before they book. Find out what they're seeing — and what's putting them off."
      features={[
        {
          icon: 'target',
          title: 'Your salon score out of 100',
          description: 'See how you compare to other salons nearby',
        },
        {
          icon: 'alert',
          title: "What's losing you bookings",
          description:
            'Missing photos, unanswered reviews, incomplete hours, and more',
        },
        {
          icon: 'arrow-up',
          title: 'What to fix first',
          description: "Ranked by impact, so you're not wasting time",
        },
      ]}
      permissionsIntro="You sign in with Google and give Chocka permission to read your salon's Google Business Profile"
    />
  );
}
