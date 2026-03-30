export default function MovementIndicator({ movement }: { movement: number | null }) {
  if (movement === null || movement === 0) {
    return <span className="text-soft text-sm font-mono">—</span>;
  }
  if (movement > 0) {
    return (
      <span className="text-green text-sm font-mono font-bold">
        ↑{movement}
      </span>
    );
  }
  return (
    <span className="text-orange text-sm font-mono font-bold">
      ↓{Math.abs(movement)}
    </span>
  );
}
