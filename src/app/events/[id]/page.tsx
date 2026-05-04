import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import MagnitudeBadge from "@/components/MagnitudeBadge";
import GoogleMapProvider from "@/components/GoogleMapProvider";
import EarthquakeMap from "@/components/EarthquakeMap";
import InfoTip from "@/components/InfoTip";
import { getDistanceRange, getForecastProbability, getMaxAftershockMagnitude } from "@/lib/aftershock";
import { getPhivolcsEventById, getRecentPhivolcsEvents } from "@/lib/phivolcs";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getPhivolcsEventById(id);

  if (!event) notFound();

  const probability = getForecastProbability(event);
  const distanceRange = getDistanceRange(event);
  const related = (await getRecentPhivolcsEvents())
    .filter((candidate) => candidate.id !== event.id)
    .slice(0, 3);

  return (
    <GoogleMapProvider>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 pt-4 sm:pt-6">
          <Link href="/events" className="text-xs text-brand hover:underline underline-offset-4">Back to Event List</Link>
          <p className="text-xs text-text-muted mt-1">
            <Link href="/" className="hover:underline">Home</Link> &gt; <Link href="/events" className="hover:underline">Event List</Link> &gt; Event #{id}
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-3 sm:px-6 mt-3 sm:mt-4">
          <div className="bg-brand rounded-xl p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-6">
              <span className="font-display text-3xl sm:text-7xl text-white">M {event.magnitude}</span>
              <div>
                <h1 className="font-display text-lg sm:text-2xl text-white">{event.location}</h1>
                <p className="text-sm text-white/70">{event.region}</p>
                <p className="font-mono text-xs text-white/60 mt-1">{event.date} PHT</p>
              </div>
            </div>
            <div className="text-right">
              <LikelihoodBadge level={event.likelihood} />
              <p className="text-xs text-white/60 mt-2">Forecast generated from current PHIVOLCS feed</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-5 sm:py-8 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <div className="card p-4 sm:p-6">
              <h2 className="font-display text-base sm:text-lg mb-3 sm:mb-4">Event Parameters</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  [<InfoTip key="m-label" term="Magnitude">A scale describing earthquake size from recorded ground motion.</InfoTip>, <span key="m" className="font-mono text-lg font-bold">{event.magnitude}</span>],
                  [<InfoTip key="d-label" term="Depth">How far below the earth surface the earthquake started, measured in kilometers.</InfoTip>, <span key="d" className="font-mono">{event.depth} <span className="text-text-muted">km</span></span>],
                  ["Latitude", <span key="lat" className="font-mono">{event.latitude} deg</span>],
                  ["Longitude", <span key="lng" className="font-mono">{event.longitude} deg</span>],
                  ["Date & Time", <span key="dt" className="font-mono text-xs">{event.date} PHT</span>],
                  ["Event ID", <span key="event-id" className="font-mono text-text-muted text-xs">{event.id}</span>],
                  ["Classification", <span key="classification" className="badge bg-brand/10 text-brand">Tectonic</span>],
                  ["Data Source", <a key="source" href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline inline-flex items-center gap-1">PHIVOLCS</a>],
                ].map(([label, value], index) => (
                  <div key={typeof label === "string" ? label : index}>
                    <p className="text-text-muted text-xs uppercase tracking-wide mb-1">{label}</p>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`card p-4 sm:p-6 border-l-4 ${event.likelihood === "HIGH" ? "border-l-high" : event.likelihood === "MEDIUM" ? "border-l-medium" : "border-l-low"}`}>
              <h2 className="font-display text-base sm:text-lg mb-1">Aftershock Likelihood Forecast</h2>
              <p className="text-[10px] sm:text-xs text-text-muted mb-4 sm:mb-6">24-hour forecast window</p>
              <div className="text-center">
                <span className={`font-display text-4xl sm:text-6xl ${event.likelihood === "HIGH" ? "text-high" : event.likelihood === "MEDIUM" ? "text-medium" : "text-low"}`}>
                  {probability}%
                </span>
                <p className="text-sm text-text-muted mt-2">
                  Probability of at least one <InfoTip term="aftershock">A smaller earthquake that may occur after a larger event in the same general area.</InfoTip>
                </p>
                <div className="mt-4"><LikelihoodBadge level={event.likelihood} /></div>
              </div>
              <hr className="divider my-6" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Estimated Distance Range</p>
                  <p className="font-semibold">{`0 - ${distanceRange} km`} from <InfoTip term="epicenter">The point on the earth surface directly above where the earthquake began.</InfoTip></p>
                </div>
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Possible Max Aftershock Magnitude</p>
                  <p className="font-semibold">Up to M {getMaxAftershockMagnitude(event)}</p>
                </div>
              </div>
              <div className="mt-6 bg-bg-subtle rounded-lg p-4 text-xs text-text-muted leading-relaxed">
                This is a probability-based estimate, not an exact earthquake prediction. Aftershocks may or may not occur. This system is an academic prototype and is not an official PHIVOLCS advisory.
              </div>
              <div className="mt-4 text-right">
                <Link href={`/events/${event.id}/forecast`} className="text-sm text-brand hover:underline underline-offset-4">View Full Forecast History -&gt;</Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-sm">Event Location</h2>
              </div>
              <div className="relative h-48 sm:h-64">
                <EarthquakeMap events={[event]} centerOnEvent={event} showProbabilityRadius={true} zoom={9} className="w-full h-full" />
                <div className="absolute bottom-3 left-3 z-10 text-xs text-text-muted bg-white/80 backdrop-blur px-2 py-1 rounded shadow-sm">
                  {event.latitude} deg, {event.longitude} deg
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <Link href={`/dashboard?event=${event.id}`} className="btn-secondary text-xs w-full justify-center">Open in Full Dashboard</Link>
              </div>
            </div>

            <div className="card p-4 sm:p-5">
              <h2 className="font-semibold text-sm mb-4">Other PHIVOLCS Events In Last 24 Hours</h2>
              <div className="space-y-3">
                {related.length === 0 ? (
                  <p className="text-xs text-text-muted">No other recent events are currently listed.</p>
                ) : related.map((relatedEvent) => (
                  <Link key={relatedEvent.id} href={`/events/${relatedEvent.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-subtle transition-colors group">
                    <MagnitudeBadge magnitude={relatedEvent.magnitude} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary group-hover:text-brand truncate">{relatedEvent.location}</p>
                      <p className="text-xs text-text-muted font-mono">{relatedEvent.date} PHT</p>
                    </div>
                    <LikelihoodBadge level={relatedEvent.likelihood} />
                  </Link>
                ))}
              </div>
              <Link href="/events" className="text-xs text-brand hover:underline underline-offset-4 block mt-4">View all recent events</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </GoogleMapProvider>
  );
}
