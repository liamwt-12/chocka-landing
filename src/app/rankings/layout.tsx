import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chocka Index — UK Tradesperson Rankings',
  description:
    'The UK\'s most trusted tradesperson rankings. Find the best plumbers, electricians, builders and more in your area. Updated weekly.',
};

export default function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
