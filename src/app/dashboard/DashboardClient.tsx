"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import MagnitudeBadge from "@/components/MagnitudeBadge";
import GoogleMapProvider from "@/components/GoogleMapProvider";
import EarthquakeMap from "@/components/EarthquakeMap";
import InfoTip from "@/components/InfoTip";
import type { EqEvent } from "@/components/EarthquakeMap";
import {
  getDistanceRange,
  getForecastProbability,
  getMaxAftershockMagnitude,
  type Likelihood,
} from "@/lib/aftershock";

const EVENT_PAGE_SIZE = 5;

function getEventDateParts(event: EqEvent) {
  const [date = "", time = "00:00"] = event.date.split(" ");
  return { date, time };
}

function getDateOffset(date: string, daysBack: number) {
  const nextDate = new Date(`${date}T00:00:00+08:00`);
  nextDate.setDate(nextDate.getDate() - daysBack);
  return nextDate.toISOString().slice(0, 10);
}

export default function DashboardClient({
  events,
  selectedEventId,
}: {
  events: EqEvent[];
  selectedEventId: string | null;
}) {
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [magRange, setMagRange] = useState([0, 9]);
  const [depthRange, setDepthRange] = useState([0, 700]);
  const [likelihoods, setLikelihoods] = useState({ LOW: true, MEDIUM: true, HIGH: true });
  const [locationSearch, setLocationSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(() =>
    selectedEventId && events.some((event) => event.id === selectedEventId) ? selectedEventId : null
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(EVENT_PAGE_SIZE);

  const latestEventDate = useMemo(() => {
    return events.map((event) => getEventDateParts(event).date).sort().at(-1) ?? "";
  }, [events]);

  const filtered = events.filter((e) => {
    const { date, time } = getEventDateParts(e);
    if (e.magnitude < magRange[0] || e.magnitude > magRange[1]) return false;
    if (e.depth < depthRange[0] || e.depth > depthRange[1]) return false;
    if (!likelihoods[e.likelihood]) return false;
    if (dateFrom && date < dateFrom) return false;
    if (dateTo && date > dateTo) return false;
    if (timeFrom && time < timeFrom) return false;
    if (timeTo && time > timeTo) return false;
    if (locationSearch && !e.location.toLowerCase().includes(locationSearch.toLowerCase()) && !e.region.toLowerCase().includes(locationSearch.toLowerCase())) return false;
    return true;
  });
  const visibleEvents = filtered.slice(0, visibleCount);
  const selectedEventData =
    filtered.find((event) => event.id === selectedEvent) ??
    events.find((event) => event.id === selectedEvent) ??
    null;

  function toggleLikelihood(key: Likelihood) {
    setLikelihoods((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function resetFilters() {
    setMagRange([0, 9]);
    setDepthRange([0, 700]);
    setLikelihoods({ LOW: true, MEDIUM: true, HIGH: true });
    setLocationSearch("");
    setDateFrom("");
    setDateTo("");
    setTimeFrom("");
    setTimeTo("");
    setVisibleCount(EVENT_PAGE_SIZE);
  }

  function applyDatePreset(daysBack: number) {
    if (!latestEventDate) return;
    setDateFrom(getDateOffset(latestEventDate, daysBack));
    setDateTo(latestEventDate);
  }

  const filterContent = (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-semibold text-text-secondary block mb-2">
          Magnitude <span className="text-text-muted font-mono">{magRange[0]} - {magRange[1]}</span>
        </label>
        <div className="flex gap-2 items-center">
          <input type="range" min={0} max={9} step={0.1} value={magRange[0]} onChange={(e) => setMagRange([Math.min(+e.target.value, magRange[1]), magRange[1]])} className="flex-1 accent-brand" aria-label="Minimum magnitude" />
          <input type="range" min={0} max={9} step={0.1} value={magRange[1]} onChange={(e) => setMagRange([magRange[0], Math.max(+e.target.value, magRange[0])])} className="flex-1 accent-brand" aria-label="Maximum magnitude" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary block mb-2">
          Depth (km) <span className="text-text-muted font-mono">{depthRange[0]} - {depthRange[1]}</span>
        </label>
        <div className="flex gap-2 items-center">
          <input type="range" min={0} max={700} step={1} value={depthRange[0]} onChange={(e) => setDepthRange([Math.min(+e.target.value, depthRange[1]), depthRange[1]])} className="flex-1 accent-brand" aria-label="Minimum depth" />
          <input type="range" min={0} max={700} step={1} value={depthRange[1]} onChange={(e) => setDepthRange([depthRange[0], Math.max(+e.target.value, depthRange[0])])} className="flex-1 accent-brand" aria-label="Maximum depth" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary block mb-2">Date Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-2 py-2 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" aria-label="Start date" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-2 py-2 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" aria-label="End date" />
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            ["24h", 1],
            ["7 days", 7],
            ["30 days", 30],
          ].map(([label, days]) => (
            <button key={label} type="button" onClick={() => applyDatePreset(Number(days))} className="rounded-full border border-border px-2 py-1 text-[10px] font-medium text-text-secondary hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              Last {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary block mb-2">Time Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} className="w-full px-2 py-2 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" aria-label="Start time" />
          <input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} className="w-full px-2 py-2 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" aria-label="End time" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary block mb-2">Aftershock Likelihood</label>
        {(["LOW", "MEDIUM", "HIGH"] as Likelihood[]).map((l) => (
          <label key={l} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" checked={likelihoods[l]} onChange={() => toggleLikelihood(l)} className="accent-brand" />
            <LikelihoodBadge level={l} />
          </label>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold text-text-secondary block mb-2">Location</label>
        <input type="text" placeholder="Search province or region..." value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
      </div>
      <button className="btn-primary w-full text-sm" onClick={() => setMobileFilterOpen(false)}>Apply Filters</button>
      <button className="text-xs text-brand hover:underline w-full text-center" onClick={resetFilters}>Reset all filters</button>
    </div>
  );

  return (
    <GoogleMapProvider>
      <Navbar />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row" style={{ height: "calc(100dvh - 56px)" }}>
        <aside className="hidden lg:flex flex-col w-[360px] shrink-0 border-r border-border bg-white overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-lg">Earthquake Events</h1>
                <p className="text-xs text-text-muted">PHIVOLCS, last 24 hours</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="pulse-dot" />
                <span className="text-xs font-semibold text-low">Live</span>
              </div>
            </div>
          </div>

          <div className="border-b border-border">
            <button className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-text-secondary hover:bg-bg-subtle transition-colors" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}>
              Filters
              <svg className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {filtersOpen && <div className="px-4 pb-4">{filterContent}</div>}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-display text-base text-text-muted mb-1">No PHIVOLCS events in view.</p>
                <p className="mb-2 text-xs text-text-muted">The feed is limited to the last 24 hours.</p>
                <button className="text-xs text-brand hover:underline" onClick={resetFilters}>Reset Filters</button>
              </div>
            ) : (
              visibleEvents.map((event) => (
                <button key={event.id} onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)} className={`w-full text-left card p-3 transition-all ${selectedEvent === event.id ? "border-l-4 border-l-brand bg-brand/[0.03]" : "hover:border-l-4 hover:border-l-brand hover:bg-brand/[0.02]"}`}>
                  <div className="flex items-start gap-3">
                    <MagnitudeBadge magnitude={event.magnitude} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{event.location}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                        <span className="font-mono">{event.date}</span>
                        <span className="px-1.5 py-0.5 border border-border rounded text-[10px]">{event.depth} km</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <LikelihoodBadge level={event.likelihood} />
                        <Link href={`/events/${event.id}`} className="text-xs text-brand hover:underline" onClick={(e) => e.stopPropagation()}>View Details -</Link>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
            {filtered.length > visibleEvents.length && (
              <button type="button" className="btn-secondary w-full justify-center text-xs" onClick={() => setVisibleCount((count) => count + EVENT_PAGE_SIZE)}>
                Load More Events
              </button>
            )}
          </div>
        </aside>

        <div className="lg:hidden">
          <button type="button" className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 rounded-full px-4 py-2 text-xs shadow-lg btn-primary" onClick={() => setMobileFilterOpen(true)}>
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M2 4h12M4 8h8M6 12h4" />
            </svg>
            Filters &amp; Events
          </button>
        </div>

        {mobileFilterOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileFilterOpen(false)} aria-hidden="true" />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg max-h-[75vh] overflow-y-auto p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Filters and Events">
              <div className="w-8 h-1 bg-border rounded-full mx-auto mb-3" aria-hidden="true" />
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-base sm:text-lg">Filters &amp; Events</h2>
                <button onClick={() => setMobileFilterOpen(false)} className="text-text-muted hover:text-text-primary p-1" aria-label="Close filters">X</button>
              </div>
              {filterContent}
              <hr className="divider my-4" />
              <p className="text-xs text-text-muted mb-2">{filtered.length} events found</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {visibleEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`} className="card p-3 flex items-center gap-3 hover:bg-bg-subtle transition-colors">
                    <MagnitudeBadge magnitude={event.magnitude} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{event.location}</p>
                      <p className="text-xs text-text-muted font-mono">{event.date}</p>
                    </div>
                    <LikelihoodBadge level={event.likelihood} />
                  </Link>
                ))}
              </div>
              {filtered.length > visibleEvents.length && (
                <button type="button" className="btn-secondary mt-3 w-full justify-center text-xs" onClick={() => setVisibleCount((count) => count + EVENT_PAGE_SIZE)}>
                  Load More Events
                </button>
              )}
            </div>
          </>
        )}

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <EarthquakeMap
            events={filtered}
            selectedEventId={selectedEvent}
            onSelectEvent={setSelectedEvent}
            showProbabilityRadius={true}
            centerOnEvent={selectedEventData}
            zoom={selectedEventData ? 8 : undefined}
            className="h-full min-h-[calc(100dvh-56px)] w-full lg:min-h-0"
            preferStaticOnMobile={true}
          />
          {selectedEventData && (
            <aside className="absolute bottom-20 left-3 right-3 z-20 max-h-[58vh] overflow-y-auto rounded-lg border border-border bg-white/95 p-4 text-sm shadow-lg backdrop-blur lg:bottom-auto lg:left-auto lg:right-4 lg:top-4 lg:w-[360px]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">Selected Event</p>
                  <h2 className="font-display text-lg text-text-primary">{selectedEventData.location}</h2>
                  <p className="text-xs text-text-muted">{selectedEventData.region}</p>
                </div>
                <button type="button" className="rounded-md p-1 text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" onClick={() => setSelectedEvent(null)} aria-label="Close selected event details">
                  X
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-bg-subtle p-3">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">Magnitude</p>
                  <p className="font-mono text-xl font-bold text-text-primary">M {selectedEventData.magnitude.toFixed(1)}</p>
                </div>
                <div className="rounded-lg bg-bg-subtle p-3">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">Forecast Status</p>
                  <p className="font-semibold text-low">Forecast available</p>
                </div>
                <div className="rounded-lg bg-bg-subtle p-3">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    <InfoTip term="Depth">How far below the earth surface the earthquake started, measured in kilometers.</InfoTip>
                  </p>
                  <p className="font-mono text-text-primary">{selectedEventData.depth} km</p>
                </div>
                <div className="rounded-lg bg-bg-subtle p-3">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">Likelihood</p>
                  <LikelihoodBadge level={selectedEventData.likelihood} />
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-border p-3">
                <p className="text-[10px] uppercase tracking-wide text-text-muted">24-hour forecast</p>
                <p className="mt-1 text-2xl font-bold text-text-primary">
                  {getForecastProbability(selectedEventData)}%
                  <span className="ml-2 text-xs font-normal text-text-muted">probability of at least one aftershock</span>
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-text-muted">
                      <InfoTip term="Epicenter">The point on the earth surface directly above where the earthquake began.</InfoTip> range
                    </p>
                    <p className="font-semibold">0-{getDistanceRange(selectedEventData)} km</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Possible max aftershock</p>
                    <p className="font-semibold">M {getMaxAftershockMagnitude(selectedEventData)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">This is a likelihood estimate, not a deterministic prediction.</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-text-muted">Date and time</p>
                  <p className="font-mono">{selectedEventData.date} PHT</p>
                </div>
                <div>
                  <p className="text-text-muted">Coordinates</p>
                  <p className="font-mono">{selectedEventData.lat}, {selectedEventData.lng}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-text-muted">Event source</p>
                  <a href="https://tsunami.phivolcs.dost.gov.ph/EQLatest.html" target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
                    PHIVOLCS latest earthquake information
                  </a>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link href={`/events/${selectedEventData.id}`} className="btn-primary flex-1 text-xs">View Details</Link>
                <Link href={`/events/${selectedEventData.id}/forecast`} className="btn-secondary flex-1 text-xs">Forecast</Link>
              </div>
            </aside>
          )}
        </div>
      </div>
    </GoogleMapProvider>
  );
}
