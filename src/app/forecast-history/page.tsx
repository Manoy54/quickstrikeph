import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import { getDistanceRange, getForecastProbability, getMaxAftershockMagnitude } from "@/lib/aftershock";
import { getRecentPhivolcsEvents } from "@/lib/phivolcs";

export const dynamic = "force-dynamic";

function forecastId(eventId: string) {
  return eventId.replace("phivolcs-", "FC-");
}

function probBarColor(likelihood: "LOW" | "MEDIUM" | "HIGH"): string {
  if (likelihood === "HIGH") return "bg-high";
  if (likelihood === "MEDIUM") return "bg-medium";
  return "bg-low";
}

export default async function ForecastHistoryPage() {
  const events = await getRecentPhivolcsEvents();

  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <section className="bg-brand py-6 sm:py-14">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <h1 className="font-display text-xl sm:text-4xl text-white">Forecast History</h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-white/80">
              Generated from PHIVOLCS earthquake information in the last 24 hours.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-5 sm:py-8">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="bg-text-secondary text-white text-left">
                    <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Forecast ID</th>
                    <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Event Date &amp; Time</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Mag</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Likelihood</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Probability</th>
                    <th scope="col" className="px-4 py-3 font-semibold max-lg:hidden">Max Mag</th>
                    <th scope="col" className="px-4 py-3 font-semibold max-lg:hidden">Distance</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center text-text-muted">
                        <p className="text-lg font-display mb-2">No forecasts found</p>
                        <p className="text-sm">PHIVOLCS has no events in the last 24 hours, or the feed is temporarily unavailable.</p>
                      </td>
                    </tr>
                  ) : (
                    events.map((event, index) => {
                      const probability = getForecastProbability(event);

                      return (
                        <tr key={event.id} className={`border-t border-border hover:border-l-4 hover:border-l-brand hover:bg-brand/[0.02] transition-all ${index % 2 === 1 ? "bg-bg-subtle" : ""}`}>
                          <td className="px-4 py-3 font-mono text-xs text-text-muted">{forecastId(event.id)}</td>
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{event.date} PHT</td>
                          <td className="px-4 py-3 font-semibold">{event.location}</td>
                          <td className="px-4 py-3 font-mono">{event.magnitude}</td>
                          <td className="px-4 py-3"><LikelihoodBadge level={event.likelihood} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${probBarColor(event.likelihood)}`} style={{ width: `${probability}%` }} />
                              </div>
                              <span className="font-mono text-xs">{probability}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-lg:hidden font-mono text-xs">M {getMaxAftershockMagnitude(event)}</td>
                          <td className="px-4 py-3 max-lg:hidden text-xs">0-{getDistanceRange(event)} km</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Link href={`/events/${event.id}/forecast`} className="btn-secondary text-xs px-2.5 py-1">View</Link>
                              <Link href={`/events/${event.id}`} className="p-1.5 border border-border rounded-md hover:border-brand hover:text-brand transition-colors" aria-label={`View event details for ${event.location}`}>
                                <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                  <circle cx="7" cy="7" r="5" />
                                  <path strokeLinecap="round" d="M7 5v4M7 4v0" />
                                </svg>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-xs text-text-muted">
            Showing {events.length} PHIVOLCS-derived forecasts from the last 24 hours.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
