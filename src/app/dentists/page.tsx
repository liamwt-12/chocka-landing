import { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Chocka for Dentists — See your practice score',
  description:
    'Patients read reviews before they register. Find out what your Google profile is telling them.',
};

export default function DentistsPage() {
  return (
    <LandingPage
      heroNiche="DENTAL PRACTICE"
      subhead="Patients read reviews before they register. Find out what your Google profile is telling them."
      features={[
        {
          icon: 'target',
          title: 'Your practice score out of 100',
          description: 'See how you compare to other practices nearby',
        },
        {
          icon: 'alert',
          title: "What's losing you patients",
          description:
            'Missing photos, unanswered reviews, outdated hours, and more',
        },
        {
          icon: 'arrow-up',
          title: 'What to fix first',
          description: "Ranked by impact, so you're not wasting time",
        },
      ]}
      permissionsIntro="You sign in with Google and give Chocka permission to read your practice's Google Business Profile"
    />
  );
}
