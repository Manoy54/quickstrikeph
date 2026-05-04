import type { EqEvent } from "@/components/EarthquakeMap";

export type Likelihood = EqEvent["likelihood"];

export function getLikelihood(magnitude: number): Likelihood {
  if (magnitude >= 5.5) return "HIGH";
  if (magnitude >= 4.5) return "MEDIUM";
  return "LOW";
}

export function getForecastProbability(event: EqEvent) {
  if (event.likelihood === "HIGH") {
    return Math.min(88, Math.round(48 + event.magnitude * 4.5));
  }
  if (event.likelihood === "MEDIUM") {
    return Math.min(59, Math.round(26 + event.magnitude * 4));
  }
  return Math.max(8, Math.round(4 + event.magnitude * 3));
}

export function getMaxAftershockMagnitude(event: EqEvent) {
  return Math.max(1, event.magnitude - 1).toFixed(1);
}

export function getDistanceRange(event: EqEvent) {
  return event.distanceRange ?? getDefaultRadius(event.magnitude);
}

function getDefaultRadius(magnitude: number) {
  if (magnitude >= 7) return 80;
  if (magnitude >= 6) return 55;
  if (magnitude >= 5) return 35;
  if (magnitude >= 4) return 20;
  return 10;
}
