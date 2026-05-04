"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";

type Likelihood = "LOW" | "MEDIUM" | "HIGH";

interface ForecastRecord {
  forecastId: string;
  eventId: string;
  eventDateTime: string;
  location: string;
  magnitude: number;
  likelihood: Likelihood;
  probability: number;
  maxMag: string;
  distRange: string;
  generatedAt: string;
}

const FORECASTS: ForecastRecord[] = [
  { forecastId: "FC-001", eventId: "eq-001", eventDateTime: "2024-08-18 14:32", location: "Cataingan, Masbate", magnitude: 6.6, likelihood: "HIGH", probability: 78, maxMag: "M 5.6", distRange: "0-45 km", generatedAt: "2024-08-18 15:00" },
  { forecastId: "FC-002", eventId: "eq-002", eventDateTime: "2024-08-15 09:18", location: "Hinatuan, Surigao del Sur", magnitude: 5.8, likelihood: "MEDIUM", probability: 52, maxMag: "M 4.8", distRange: "0-30 km", generatedAt: "2024-08-15 10:00" },
  { forecastId: "FC-003", eventId: "eq-008", eventDateTime: "2024-08-10 11:42", location: "Cotabato City", magnitude: 5.4, likelihood: "HIGH", probability: 65, maxMag: "M 4.4", distRange: "0-35 km", generatedAt: "2024-08-10 12:00" },
  { forecastId: "FC-004", eventId: "eq-010", eventDateTime: "2024-08-08 08:37", location: "Tacloban City", magnitude: 5.9, likelihood: "HIGH", probability: 71, maxMag: "M 5.0", distRange: "0-40 km", generatedAt: "2024-08-08 09:00" },
  { forecastId: "FC-005", eventId: "eq-005", eventDateTime: "2024-08-13 06:12", location: "Sarangani", magnitude: 5.1, likelihood: "MEDIUM", probability: 45, maxMag: "M 4.1", distRange: "0-25 km", generatedAt: "2024-08-13 07:00" },
  { forecastId: "FC-006", eventId: "eq-003", eventDateTime: "2024-08-14 22:05", location: "Davao Occidental", magnitude: 4.2, likelihood: "LOW", probability: 18, maxMag: "M 3.2", distRange: "0-15 km", generatedAt: "2024-08-14 23:00" },
  { forecastId: "FC-007", eventId: "eq-006", eventDateTime: "2024-08-12 03:28", location: "General Santos City", magnitude: 4.8, likelihood: "MEDIUM", probability: 38, maxMag: "M 3.8", distRange: "0-20 km", generatedAt: "2024-08-12 04:00" },
  { forecastId: "FC-008", eventId: "eq-004", eventDateTime: "2024-08-14 18:44", location: "Batangas City", magnitude: 3.9, likelihood: "LOW", probability: 12, maxMag: "M 2.9", distRange: "0-10 km", generatedAt: "2024-08-14 19:00" },
];

const PAGE_SIZE = 5;

function probBarColor(likelihood: Likelihood): string {
  if (likelihood === "HIGH") return "bg-high";
  if (likelihood === "MEDIUM") return "bg-medium";
  return "bg-low";
}

function getDatePart(value: string) {
  return value.split(" ")[0] ?? "";
}

export default function ForecastHistoryPage() {
  const [search, setSearch] = useState("");
  const [likelihoodFilter, setLikelihoodFilter] = useState("all");
  const [magFilter, setMagFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [exportToast, setExportToast] = useState(false);

  const filtered = useMemo(() => {
    return FORECASTS.filter((forecast) => {
      const query = search.toLowerCase();
      const eventDate = getDatePart(forecast.eventDateTime);

      if (query && !forecast.location.toLowerCase().includes(query) && !forecast.forecastId.toLowerCase().includes(query) && !forecast.eventId.toLowerCase().includes(query)) return false;
      if (likelihoodFilter !== "all" && forecast.likelihood !== likelihoodFilter) return false;
      if (magFilter !== "all" && forecast.magnitude < Number(magFilter)) return false;
      if (dateFrom && eventDate < dateFrom) return false;
      if (dateTo && eventDate > dateTo) return false;

      return true;
    });
  }, [dateFrom, dateTo, likelihoodFilter, magFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageForecasts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstResult = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(currentPage * PAGE_SIZE, filtered.length);

  function handleExport() {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  }

  function clearFilters() {
    setSearch("");
    setLikelihoodFilter("all");
    setMagFilter("all");
    setDateFrom("");
    setDateTo("");
  }

  const hasFilters = !!search || likelihoodFilter !== "all" || magFilter !== "all" || !!dateFrom || !!dateTo;

  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <section className="bg-brand py-6 sm:py-14">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <h1 className="font-display text-xl sm:text-4xl text-white">Forecast History</h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-white/80">
              Browse all previously generated aftershock likelihood forecasts.
            </p>
          </div>
        </section>

        <div className="sticky top-12 sm:top-16 z-30 bg-white border-b border-border shadow-sm">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 sm:py-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-3 flex-wrap flex-1">
                <div className="relative max-w-xs flex-1">
                  <input
                    type="text"
                    placeholder="Search location, event ID, or forecast ID..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="7" cy="7" r="5" />
                    <path strokeLinecap="round" d="M11 11l3.5 3.5" />
                  </svg>
                </div>
                <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Forecast history start date" />
                <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Forecast history end date" />
                <select value={magFilter} onChange={(event) => setMagFilter(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter forecast history by magnitude">
                  <option value="all">Magnitude: All</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                </select>
                <select value={likelihoodFilter} onChange={(event) => setLikelihoodFilter(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter by likelihood level">
                  <option value="all">Likelihood: All</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>
              <button type="button" onClick={handleExport} className="btn-secondary text-xs inline-flex items-center gap-2">
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" d="M7 2v8M4 7l3 3 3-3M2 11h10" />
                </svg>
                Export CSV
              </button>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {search && <FilterTag label={`Search: "${search}"`} onClear={() => setSearch("")} />}
                {dateFrom && <FilterTag label={`From: ${dateFrom}`} onClear={() => setDateFrom("")} />}
                {dateTo && <FilterTag label={`To: ${dateTo}`} onClear={() => setDateTo("")} />}
                {magFilter !== "all" && <FilterTag label={`Magnitude: ${magFilter}+`} onClear={() => setMagFilter("all")} />}
                {likelihoodFilter !== "all" && <FilterTag label={`Likelihood: ${likelihoodFilter}`} onClear={() => setLikelihoodFilter("all")} />}
                <button type="button" onClick={clearFilters} className="text-xs text-brand hover:underline">Clear All</button>
              </div>
            )}
          </div>
        </div>

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
                    <th scope="col" className="px-4 py-3 font-semibold max-xl:hidden whitespace-nowrap">Generated At</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageForecasts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center text-text-muted">
                        <p className="text-lg font-display mb-2">No forecasts found</p>
                        <p className="text-sm">Try adjusting your filters.</p>
                      </td>
                    </tr>
                  ) : (
                    pageForecasts.map((forecast, index) => (
                      <tr key={forecast.forecastId} className={`border-t border-border hover:border-l-4 hover:border-l-brand hover:bg-brand/[0.02] transition-all ${index % 2 === 1 ? "bg-bg-subtle" : ""}`}>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted">{forecast.forecastId}</td>
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{forecast.eventDateTime} PHT</td>
                        <td className="px-4 py-3 font-semibold">{forecast.location}</td>
                        <td className="px-4 py-3 font-mono">{forecast.magnitude}</td>
                        <td className="px-4 py-3"><LikelihoodBadge level={forecast.likelihood} /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${probBarColor(forecast.likelihood)}`} style={{ width: `${forecast.probability}%` }} />
                            </div>
                            <span className="font-mono text-xs">{forecast.probability}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 max-lg:hidden font-mono text-xs">{forecast.maxMag}</td>
                        <td className="px-4 py-3 max-lg:hidden text-xs">{forecast.distRange}</td>
                        <td className="px-4 py-3 max-xl:hidden font-mono text-xs whitespace-nowrap">{forecast.generatedAt} PHT</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link href={`/events/${forecast.eventId}/forecast`} className="btn-secondary text-xs px-2.5 py-1">View</Link>
                            <Link href={`/events/${forecast.eventId}`} className="p-1.5 border border-border rounded-md hover:border-brand hover:text-brand transition-colors" aria-label={`View event details for ${forecast.location}`}>
                              <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                <circle cx="7" cy="7" r="5" />
                                <path strokeLinecap="round" d="M7 5v4M7 4v0" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-text-muted">Showing {firstResult}-{lastResult} of {filtered.length} forecasts</p>
            <div className="flex items-center gap-1">
              <button type="button" className="px-3 py-1.5 border border-border rounded-md text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-50" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1.5 rounded-md text-sm font-semibold ${
                      pageNumber === currentPage
                        ? "bg-brand text-white"
                        : "border border-border text-text-muted hover:border-brand hover:text-brand"
                    }`}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button type="button" className="px-3 py-1.5 border border-border rounded-md text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                Next
              </button>
            </div>
          </div>
        </div>

        {exportToast && (
          <div className="fixed top-20 right-4 z-50 card border-l-4 border-l-low p-4 shadow-md animate-fade-in flex items-center gap-3" role="status">
            <span className="text-low font-bold">OK</span>
            <p className="text-sm">Export started. Your CSV will download shortly.</p>
            <button type="button" onClick={() => setExportToast(false)} className="text-text-muted hover:text-text-primary ml-2" aria-label="Dismiss notification">X</button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function FilterTag({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 border border-brand text-brand text-xs rounded-full">
      {label}
      <button type="button" onClick={onClear} className="hover:text-high" aria-label={`Remove ${label} filter`}>
        X
      </button>
    </span>
  );
}
