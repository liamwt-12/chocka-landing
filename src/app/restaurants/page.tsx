import { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Chocka for Restaurants — See your restaurant score',
  description:
    'Diners check Google before they walk in. Find out what your profile is telling them, and what\u2019s turning them away.',
};

export default function RestaurantsPage() {
  return (
    <LandingPage
      heroNiche="RESTAURANT"
      subhead="Diners check Google before they walk in. Find out what your profile is telling them — and what's turning them away."
      features={[
        {
          icon: 'target',
          title: 'Your restaurant score out of 100',
          description: 'See how you compare to other restaurants nearby',
        },
        {
          icon: 'alert',
          title: "What's losing you covers",
          description:
            'Missing photos, unanswered reviews, no menu, outdated hours',
        },
        {
          icon: 'arrow-up',
          title: 'What to fix first',
          description: "Ranked by impact, so you're not wasting time",
        },
      ]}
      permissionsIntro="You sign in with Google and give Chocka permission to read your restaurant's Google Business Profile"
    />
  );
}
