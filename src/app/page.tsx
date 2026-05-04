import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import MagnitudeBadge from "@/components/MagnitudeBadge";
import GoogleMapProvider from "@/components/GoogleMapProvider";
import EarthquakeMap from "@/components/EarthquakeMap";
import { getRecentPhivolcsEvents } from "@/lib/phivolcs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recentEvents = (await getRecentPhivolcsEvents()).slice(0, 5);

  return (
    <GoogleMapProvider>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <section className="relative overflow-hidden bg-brand" aria-labelledby="hero-heading">
          <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none" viewBox="0 0 1440 400" aria-hidden="true">
            <polyline points="0,200 80,200 120,140 160,260 200,120 240,280 280,180 320,200 400,200 440,160 480,240 520,140 560,260 600,180 640,200 720,200 760,120 800,280 840,160 880,240 920,200 1000,200 1040,140 1080,260 1120,120 1160,280 1200,180 1240,200 1320,200 1360,160 1400,240 1440,200" stroke="white" strokeWidth="3" fill="none" />
            <polyline points="0,220 100,220 140,170 180,270 220,150 260,260 300,210 340,220 420,220 460,180 500,250 540,170 580,250 620,200 660,220 740,220 780,150 820,270 860,180 900,250 940,220 1020,220 1060,170 1100,270 1140,150 1180,260 1220,210 1260,220 1340,220 1380,180 1420,250 1440,220" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
          </svg>

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-28 text-center">
            <h1 id="hero-heading" className="font-display text-2xl sm:text-5xl lg:text-6xl text-white leading-tight">
              Know What Might Come After
            </h1>
            <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              QuakeStrike PH monitors Philippine seismic activity and provides probability-based
              aftershock likelihood forecasts using PHIVOLCS earthquake data.
            </p>

            <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-brand font-semibold rounded-lg hover:bg-brand-dark hover:text-white transition-colors text-xs sm:text-sm">
                Go to Dashboard
                <svg width="14" height="14" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand transition-colors text-xs sm:text-sm">
                Learn How It Works
              </Link>
            </div>

            <div className="mt-4 sm:mt-6">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-white/15 backdrop-blur text-white/90 text-[10px] sm:text-xs rounded-full">
                This is an academic prototype. Not an official PHIVOLCS product.
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-3 sm:px-6 py-8 sm:py-20" aria-labelledby="recent-activity-heading">
          <div className="mb-4 sm:mb-8">
            <h2 id="recent-activity-heading" className="font-display text-xl sm:text-3xl text-text-primary">
              Recent Seismic Activity
            </h2>
            <p className="mt-1 text-xs text-text-muted">Live PHIVOLCS earthquake information from the last 24 hours.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
            <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3">
              {recentEvents.length === 0 ? (
                <div className="card p-5 text-sm text-text-muted">
                  No PHIVOLCS earthquake events were found in the last 24 hours.
                </div>
              ) : (
                recentEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`} className="card p-3 sm:p-4 flex items-start gap-3 sm:gap-4 group hover:border-l-4 hover:border-l-brand hover:bg-brand/[0.02] transition-all">
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
                        <span className="font-mono">{event.date} PHT</span>
                        <span className="px-1.5 py-0.5 border border-border rounded text-text-muted">{event.depth} km</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}

              <Link href="/events" className="text-sm font-medium text-brand hover:underline underline-offset-4 mt-2 self-start">
                View All Events -&gt;
              </Link>
            </div>

            <div className="lg:col-span-2">
              <div className="card overflow-hidden h-full min-h-[430px] sm:min-h-[500px] relative flex flex-col">
                <div className="flex-1 relative overflow-hidden">
                  <EarthquakeMap events={recentEvents} showProbabilityRadius={true} showZoomControl={false} className="w-full h-full min-h-[380px] sm:min-h-[440px]" />
                  <div className="pointer-events-none absolute top-3 right-3 z-20 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-brand/85 px-3 py-1.5 text-white shadow-sm backdrop-blur-sm">
                    <span className="pulse-dot" />
                    <span className="truncate text-[11px] font-semibold leading-none sm:text-xs">Live Map View</span>
                  </div>
                </div>

                <div className="p-4 flex justify-end border-t border-border">
                  <Link href="/dashboard" className="text-sm font-medium text-brand hover:underline underline-offset-4">
                    Open Full Dashboard -&gt;
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
