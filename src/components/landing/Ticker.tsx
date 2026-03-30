export default function Ticker() {
  const items = [
    '🔧 Mike D. just got 3 new Google reviews in Newcastle',
    '⚡ Profile views up 340% for Steve P. in Manchester',
    '🏠 James K. moved to #1 HVAC in Birmingham',
    '📞 12 new calls this week for Sarah L. in Leeds',
    '⭐ 4.9 star rating achieved by Tom W. in Sunderland',
    '🔧 Dave R. fully booked for the next 2 weeks in Gateshead',
    '⚡ 8 new reviews this month for Andy M. in Durham',
    '📞 Revenue up £3,200 for Chris B. in Darlington',
  ];

  return (
    <div className="bg-orange text-white overflow-hidden py-3">
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
