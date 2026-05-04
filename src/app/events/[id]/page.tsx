"use client";

import Link from "next/link";
import { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import MagnitudeBadge from "@/components/MagnitudeBadge";
import GoogleMapProvider from "@/components/GoogleMapProvider";
import EarthquakeMap from "@/components/EarthquakeMap";
import InfoTip from "@/components/InfoTip";
import type { EqEvent } from "@/components/EarthquakeMap";

/* Sample event — will be fetched dynamically in production */
const EVENT: EqEvent & {
  latitude: number;
  longitude: number;
  classification: string;
  probability: number;
  distanceRangeLabel: string;
  maxAftershock: string;
  forecastUpdated: string;
} = {
  id: "eq-001",
  location: "Cataingan, Masbate",
  region: "Bicol Region",
  magnitude: 6.6,
  depth: 20,
  latitude: 12.01,
  longitude: 124.02,
  lat: 12.01,
  lng: 124.02,
  date: "2024-08-18 14:32 PHT",
  classification: "Tectonic",
  likelihood: "HIGH",
  probability: 78,
  distanceRange: 45,
  distanceRangeLabel: "0 – 45 km",
  maxAftershock: "Up to M 5.6",
  forecastUpdated: "2024-08-18 15:00 PHT",
};

const RELATED: EqEvent[] = [
  { id: "eq-006", location: "General Santos City", region: "SOCCSKSARGEN", magnitude: 4.8, depth: 45, date: "2024-08-12", likelihood: "MEDIUM", lat: 6.11, lng: 125.17 },
  { id: "eq-005", location: "Sarangani", region: "SOCCSKSARGEN", magnitude: 5.1, depth: 60, date: "2024-08-13", likelihood: "MEDIUM", lat: 5.93, lng: 125.46 },
  { id: "eq-009", location: "Surigao City", region: "Caraga", magnitude: 4.5, depth: 30, date: "2024-08-09", likelihood: "LOW", lat: 9.78, lng: 125.50 },
];

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <GoogleMapProvider>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        {/* Back nav */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 pt-4 sm:pt-6">
          <Link href="/events" className="text-xs text-brand hover:underline underline-offset-4">‹ Back to Event List</Link>
          <p className="text-xs text-text-muted mt-1">
            <Link href="/" className="hover:underline">Home</Link> &gt; <Link href="/events" className="hover:underline">Event List</Link> &gt; Event #{id}
          </p>
        </div>

        {/* Event Header Card */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-3 sm:mt-4">
          <div className="bg-brand rounded-xl p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <span className="font-display text-3xl sm:text-7xl text-white">M {EVENT.magnitude}</span>
              <div>
                <h1 className="font-display text-lg sm:text-2xl text-white">{EVENT.location}</h1>
                <p className="text-sm text-white/70">{EVENT.region}</p>
                <p className="font-mono text-xs text-white/60 mt-1">{EVENT.date}</p>
              </div>
            </div>
            <div className="text-right">
              <LikelihoodBadge level={EVENT.likelihood} />
              <p className="text-xs text-white/60 mt-2">Forecast Updated: {EVENT.forecastUpdated}</p>
            </div>
          </div>
        </div>

        {/* Two-column content */}
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-5 sm:py-8 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Left Column (60%) */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Event Parameters Card */}
            <div className="card p-4 sm:p-6">
              <h2 className="font-display text-base sm:text-lg mb-3 sm:mb-4">Event Parameters</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  [<InfoTip key="m-label" term="Magnitude">A scale describing earthquake size from recorded ground motion.</InfoTip>, <span key="m" className="font-mono text-lg font-bold">{EVENT.magnitude}</span>],
                  [<InfoTip key="d-label" term="Depth">How far below the earth surface the earthquake started, measured in kilometers.</InfoTip>, <span key="d" className="font-mono">{EVENT.depth} <span className="text-text-muted">km</span></span>],
                  ["Latitude", <span key="lat" className="font-mono">{EVENT.latitude} deg</span>],
                  ["Longitude", <span key="lng" className="font-mono">{EVENT.longitude} deg</span>],
                  ["Date & Time", <span key="dt" className="font-mono text-xs">{EVENT.date}</span>],
                  ["Event ID", <span key="id" className="font-mono text-text-muted text-xs">{EVENT.id}</span>],
                  ["Classification", <span key="c" className="badge bg-brand/10 text-brand">{EVENT.classification}</span>],
                  ["Data Source", <a key="s" href="https://www.phivolcs.dost.gov.ph" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline inline-flex items-center gap-1">PHIVOLCS <svg width="10" height="10" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path strokeLinecap="round" d="M2 8l6-6M4 2h4v4" /></svg></a>],
                ].map(([label, value], index) => (
                  <div key={typeof label === "string" ? label : index}>
                    <p className="text-text-muted text-xs uppercase tracking-wide mb-1">{label}</p>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aftershock Likelihood Summary Card */}
            <div className={`card p-4 sm:p-6 border-l-4 ${EVENT.likelihood === "HIGH" ? "border-l-high" : EVENT.likelihood === "MEDIUM" ? "border-l-medium" : "border-l-low"}`}>
              <h2 className="font-display text-base sm:text-lg mb-1">Aftershock Likelihood Forecast</h2>
              <p className="text-[10px] sm:text-xs text-text-muted mb-4 sm:mb-6">24-hour forecast window</p>
              <div className="text-center">
                <span className={`font-display text-4xl sm:text-6xl ${EVENT.likelihood === "HIGH" ? "text-high" : EVENT.likelihood === "MEDIUM" ? "text-medium" : "text-low"}`}>
                  {EVENT.probability}%
                </span>
                <p className="text-sm text-text-muted mt-2">
                  Probability of at least one <InfoTip term="aftershock">A smaller earthquake that may occur after a larger event in the same general area.</InfoTip>
                </p>
                <div className="mt-4"><LikelihoodBadge level={EVENT.likelihood} /></div>
              </div>
              <hr className="divider my-6" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Estimated Distance Range</p>
                  <p className="font-semibold">
                    {EVENT.distanceRangeLabel} from <InfoTip term="epicenter">The point on the earth surface directly above where the earthquake began.</InfoTip>
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Possible Max Aftershock Magnitude</p>
                  <p className="font-semibold">{EVENT.maxAftershock}</p>
                </div>
              </div>
              <div className="mt-6 bg-bg-subtle rounded-lg p-4 text-xs text-text-muted leading-relaxed">
                This is a probability-based estimate, not an exact earthquake prediction. Aftershocks may or may not occur. This system is an academic prototype and is not an official PHIVOLCS advisory.
              </div>
              <div className="mt-4 text-right">
                <Link href={`/events/${EVENT.id}/forecast`} className="text-sm text-brand hover:underline underline-offset-4">View Full Forecast History →</Link>
              </div>
            </div>
          </div>

          {/* Right Column (40%) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Localized Event Map — Google Maps */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-sm">Event Location</h2>
              </div>
              <div className="relative h-48 sm:h-64">
                <EarthquakeMap
                  events={[EVENT]}
                  centerOnEvent={EVENT}
                  showProbabilityRadius={true}
                  zoom={9}
                  className="w-full h-full"
                />
                {/* Coordinate badge */}
                <div className="absolute bottom-3 left-3 z-10 text-xs text-text-muted bg-white/80 backdrop-blur px-2 py-1 rounded shadow-sm">
                  {EVENT.latitude} deg, {EVENT.longitude} deg
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <Link href="/dashboard" className="btn-secondary text-xs w-full justify-center">Open in Full Dashboard</Link>
              </div>
            </div>

            {/* Related Events Card */}
            <div className="card p-4 sm:p-5">
              <h2 className="font-semibold text-sm mb-4">Nearby Events (+/-7 days, +/-100 km)</h2>
              <div className="space-y-3">
                {RELATED.map((r) => (
                  <Link key={r.id} href={`/events/${r.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-subtle transition-colors group">
                    <MagnitudeBadge magnitude={r.magnitude} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary group-hover:text-brand truncate">{r.location}</p>
                      <p className="text-xs text-text-muted font-mono">{r.date}</p>
                    </div>
                    <LikelihoodBadge level={r.likelihood} />
                  </Link>
                ))}
              </div>
              <Link href="/events" className="text-xs text-brand hover:underline underline-offset-4 block mt-4">View all related events</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </GoogleMapProvider>
  );
}
