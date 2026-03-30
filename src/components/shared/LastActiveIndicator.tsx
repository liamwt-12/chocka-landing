export default function LastActiveIndicator({ lastActiveAt }: { lastActiveAt: string | null }) {
  if (!lastActiveAt) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-soft" />
        <span className="text-soft text-xs">Unknown</span>
      </div>
    );
  }

  const days = Math.floor(
    (Date.now() - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 7) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green" />
        <span className="text-green text-xs font-medium">Active {days}d ago</span>
      </div>
    );
  }

  if (days <= 14) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-amber-600 text-xs font-medium">Active {days}d ago</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-soft" />
      <span className="text-soft text-xs">{days}d ago</span>
    </div>
  );
}
