"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import MagnitudeBadge from "@/components/MagnitudeBadge";
import GoogleMapProvider from "@/components/GoogleMapProvider";
import EarthquakeMap from "@/components/EarthquakeMap";
import type { EqEvent } from "@/components/EarthquakeMap";

/* Sample recent events data — will be replaced with real PHIVOLCS data */
const RECENT_EVENTS: EqEvent[] = [
  { id: "eq-001", location: "Cataingan, Masbate", region: "Bicol Region", magnitude: 6.6, depth: 20, date: "2024-08-18 14:32 PHT", likelihood: "HIGH", lat: 12.01, lng: 124.02, distanceRange: 45 },
  { id: "eq-002", location: "Hinatuan, Surigao del Sur", region: "Caraga", magnitude: 5.8, depth: 35, date: "2024-08-15 09:18 PHT", likelihood: "MEDIUM", lat: 8.37, lng: 126.33, distanceRange: 35 },
  { id: "eq-003", location: "Davao Occidental", region: "Davao Region", magnitude: 4.2, depth: 112, date: "2024-08-14 22:05 PHT", likelihood: "LOW", lat: 6.11, lng: 125.58 },
  { id: "eq-004", location: "Batangas City", region: "CALABARZON", magnitude: 3.9, depth: 8, date: "2024-08-14 18:44 PHT", likelihood: "LOW", lat: 13.76, lng: 121.06 },
  { id: "eq-005", location: "Sarangani", region: "SOCCSKSARGEN", magnitude: 5.1, depth: 60, date: "2024-08-13 06:12 PHT", likelihood: "MEDIUM", lat: 5.93, lng: 125.46, distanceRange: 30 },
];

export default function HomePage() {
  return (
    <GoogleMapProvider>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-brand" aria-labelledby="hero-heading">
          {/* Decorative seismic waveform pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            preserveAspectRatio="none"
            viewBox="0 0 1440 400"
            aria-hidden="true"
          >
            <polyline
              points="0,200 80,200 120,140 160,260 200,120 240,280 280,180 320,200 400,200 440,160 480,240 520,140 560,260 600,180 640,200 720,200 760,120 800,280 840,160 880,240 920,200 1000,200 1040,140 1080,260 1120,120 1160,280 1200,180 1240,200 1320,200 1360,160 1400,240 1440,200"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
            <polyline
              points="0,220 100,220 140,170 180,270 220,150 260,260 300,210 340,220 420,220 460,180 500,250 540,170 580,250 620,200 660,220 740,220 780,150 820,270 860,180 900,250 940,220 1020,220 1060,170 1100,270 1140,150 1180,260 1220,210 1260,220 1340,220 1380,180 1420,250 1440,220"
              stroke="white"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
          </svg>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-28 text-center">
            <h1 id="hero-heading" className="font-display text-2xl sm:text-5xl lg:text-6xl text-white leading-tight">
              Know What Comes After.
            </h1>
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              QuakeStrike PH monitors Philippine seismic activity and provides probability-based
              aftershock likelihood forecasts using PHIVOLCS earthquake data.
            </p>

            {/* CTA Buttons */}
            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-brand font-semibold rounded-lg hover:bg-brand-dark hover:text-white transition-colors text-xs sm:text-sm"
              >
                Go to Dashboard
                <svg width="14" height="14" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand transition-colors text-xs sm:text-sm"
              >
                Learn How It Works
              </Link>
            </div>

            {/* Disclaimer badge */}
            <div className="mt-4 sm:mt-6">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-white/15 backdrop-blur text-white/90 text-[10px] sm:text-xs rounded-full">
                This is an academic prototype. Not an official PHIVOLCS product.
              </span>
            </div>
          </div>
        </section>

        {/* ── Recent Seismic Activity ── */}
        <section className="mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-20" aria-labelledby="recent-activity-heading">
          <h2 id="recent-activity-heading" className="font-display text-xl sm:text-3xl text-text-primary mb-4 sm:mb-8">
            Recent Seismic Activity
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
            {/* Left Column — Recent Events Mini-List (60%) */}
            <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3">
              {RECENT_EVENTS.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="card p-3 sm:p-4 flex items-start gap-3 sm:gap-4 group hover:border-l-4 hover:border-l-brand hover:bg-brand/[0.02] transition-all"
                >
                  <MagnitudeBadge magnitude={event.magnitude} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-xs sm:text-sm text-text-primary group-hover:text-brand transition-colors">
                          {event.location}
                        </p>
                        <p className="text-[10px] sm:text-xs text-text-muted">{event.region}</p>
                      </div>
                      <LikelihoodBadge level={event.likelihood} />
                    </div>
                    <div className="mt-1.5 sm:mt-2 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-text-muted">
                      <span className="font-mono">{event.date}</span>
                      <span className="px-1.5 py-0.5 border border-border rounded text-text-muted">
                        {event.depth} km
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              <Link
                href="/events"
                className="text-sm font-medium text-brand hover:underline underline-offset-4 mt-2 self-start"
              >
                View All Events →
              </Link>
            </div>

            {/* Right Column — Google Maps Live Preview Card (40%) */}
            <div className="lg:col-span-2">
              <div className="card overflow-hidden h-full min-h-[220px] sm:min-h-[320px] relative flex flex-col">
                {/* Interactive Google Maps mini-preview */}
                <div className="flex-1 relative overflow-hidden">
                  <EarthquakeMap
                    events={RECENT_EVENTS}
                    showProbabilityRadius={true}
                    showZoomControl={false}
                    className="w-full h-full min-h-[180px] sm:min-h-[260px]"
                  />

                  {/* Live indicator overlay */}
                  <div className="pointer-events-none absolute top-3 right-3 z-20 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-brand/85 px-3 py-1.5 text-white shadow-sm backdrop-blur-sm">
                    <span className="pulse-dot" />
                    <span className="truncate text-[11px] font-semibold leading-none sm:text-xs">
                      Live Map View
                    </span>
                  </div>
                </div>

                <div className="p-4 flex justify-end border-t border-border">
                  <Link href="/dashboard" className="text-sm font-medium text-brand hover:underline underline-offset-4">
                    Open Full Dashboard →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </GoogleMapProvider>
  );
}
