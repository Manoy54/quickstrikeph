function getMagColor(mag: number): string {
  if (mag >= 6.0) return "bg-mag-severe";
  if (mag >= 5.0) return "bg-mag-strong";
  if (mag >= 3.0) return "bg-mag-moderate";
  return "bg-mag-light";
}

export default function MagnitudeBadge({ magnitude }: { magnitude: number }) {
  return (
    <span
      className={`mag-dot ${getMagColor(magnitude)}`}
      aria-label={`Magnitude ${magnitude.toFixed(1)}`}
    >
      {magnitude.toFixed(1)}
    </span>
  );
}
