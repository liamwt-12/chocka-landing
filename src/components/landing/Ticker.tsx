export default function Ticker() {
  const items = [
    '7,101 businesses ranked across NE England',
    'Rankings updated every week',
    'Based on real Google data · No pay-to-rank',
    '15 towns · 20 trades covered',
    'Scores from 0–100 · Stars, reviews, recency & more',
    'New businesses added every week',
    'Plumbers · Electricians · Roofers · Builders & more',
    'Newcastle · Sunderland · Durham · Gateshead & more',
    'Free to search · No account needed',
    'Transparent scoring · No algorithm black box',
  ];

  return (
    <div className="bg-orange text-white overflow-hidden py-2.5">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-sm font-medium font-body">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
