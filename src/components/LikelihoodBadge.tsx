type Likelihood = "LOW" | "MEDIUM" | "HIGH";

const STYLES: Record<Likelihood, string> = {
  LOW: "badge-low",
  MEDIUM: "badge-medium",
  HIGH: "badge-high",
};

export default function LikelihoodBadge({ level }: { level: Likelihood }) {
  return (
    <span className={`badge ${STYLES[level]}`} aria-label={`Likelihood: ${level}`}>
      {level}
    </span>
  );
}
