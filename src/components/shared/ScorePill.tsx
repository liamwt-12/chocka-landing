import { getBandColor } from '@/lib/constants';

export default function ScorePill({ score, band }: { score: number; band: string }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-heading font-bold ${getBandColor(band)}`}
    >
      {score}
    </span>
  );
}
