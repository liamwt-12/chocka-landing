import { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Chocka — See your Google Business Profile score',
  description:
    'Find out what\u2019s hurting your visibility and what to fix first. Takes 30 seconds.',
};

export default function Home() {
  return (
    <LandingPage
      heroRotatingWords={[
        'SALON',
        'GARAGE',
        'RESTAURANT',
        'DENTAL PRACTICE',
        'GYM',
        'STUDIO',
        'BARBERSHOP',
        'CLINIC',
      ]}
      subhead="Find out what's hurting your visibility and what to fix first. Takes 30 seconds."
      features={[
        {
          icon: 'target',
          title: 'Your score out of 100',
          description: 'See how you rank against local competitors',
        },
        {
          icon: 'alert',
          title: "What's losing you customers",
          description:
            'Missing photos, reviews, response time, and more',
        },
        {
          icon: 'arrow-up',
          title: 'What to fix first',
          description: "Ranked by impact, so you're not wasting time",
        },
      ]}
      permissionsIntro="You sign in with Google and give Chocka permission to manage your Google Business Profile"
    />
  );
}
