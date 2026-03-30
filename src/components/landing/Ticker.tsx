export default function Ticker() {
  const items = [
    'Chocka just posted for a plumber in Newcastle',
    'New 5★ review replied to · Sunderland',
    'Profile views up 34% this month · Gateshead',
    'Ranking improved to #2 · Durham',
    '3 new reviews this week · Middlesbrough',
    'Weekly stats sent · Newcastle',
    'Profile score improved +12 · Leeds',
    'Review reply sent · Manchester',
    'Google Post published · Darlington',
    'Profile optimised · South Shields',
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
