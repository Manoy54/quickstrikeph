"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import MagnitudeBadge from "@/components/MagnitudeBadge";

type Likelihood = "LOW" | "MEDIUM" | "HIGH";

interface EarthquakeEvent {
  id: string;
  location: string;
  region: string;
  magnitude: number;
  depth: number;
  date: string;
  likelihood: Likelihood;
}

const ALL_EVENTS: EarthquakeEvent[] = [
  { id: "eq-001", location: "Cataingan, Masbate", region: "Bicol Region", magnitude: 6.6, depth: 20, date: "2024-08-18 14:32", likelihood: "HIGH" },
  { id: "eq-002", location: "Hinatuan, Surigao del Sur", region: "Caraga", magnitude: 5.8, depth: 35, date: "2024-08-15 09:18", likelihood: "MEDIUM" },
  { id: "eq-003", location: "Davao Occidental", region: "Davao Region", magnitude: 4.2, depth: 112, date: "2024-08-14 22:05", likelihood: "LOW" },
  { id: "eq-004", location: "Batangas City", region: "CALABARZON", magnitude: 3.9, depth: 8, date: "2024-08-14 18:44", likelihood: "LOW" },
  { id: "eq-005", location: "Sarangani", region: "SOCCSKSARGEN", magnitude: 5.1, depth: 60, date: "2024-08-13 06:12", likelihood: "MEDIUM" },
  { id: "eq-006", location: "General Santos City", region: "SOCCSKSARGEN", magnitude: 4.8, depth: 45, date: "2024-08-12 03:28", likelihood: "MEDIUM" },
  { id: "eq-007", location: "Legazpi City", region: "Bicol Region", magnitude: 3.2, depth: 15, date: "2024-08-11 16:55", likelihood: "LOW" },
  { id: "eq-008", location: "Cotabato City", region: "BARMM", magnitude: 5.4, depth: 78, date: "2024-08-10 11:42", likelihood: "HIGH" },
  { id: "eq-009", location: "Surigao City", region: "Caraga", magnitude: 4.5, depth: 22, date: "2024-08-09 20:11", likelihood: "LOW" },
  { id: "eq-010", location: "Tacloban City", region: "Eastern Visayas", magnitude: 5.9, depth: 40, date: "2024-08-08 08:37", likelihood: "HIGH" },
];

type SortKey = "date" | "magnitude" | "likelihood";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 6;

function getEventDateParts(event: EarthquakeEvent) {
  const [date = "", time = "00:00"] = event.date.split(" ");
  return { date, time };
}

export default function EventListPage() {
  const [search, setSearch] = useState("");
  const [magFilter, setMagFilter] = useState("all");
  const [likelihoodFilter, setLikelihoodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ALL_EVENTS.filter((event) => {
      const { date, time } = getEventDateParts(event);
      const query = search.toLowerCase();

      if (query && !event.location.toLowerCase().includes(query) && !event.region.toLowerCase().includes(query)) return false;
      if (likelihoodFilter !== "all" && event.likelihood !== likelihoodFilter) return false;
      if (magFilter !== "all" && event.magnitude < Number(magFilter)) return false;
      if (dateFrom && date < dateFrom) return false;
      if (dateTo && date > dateTo) return false;
      if (timeFrom && time < timeFrom) return false;
      if (timeTo && time > timeTo) return false;

      return true;
    }).sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "date") return dir * a.date.localeCompare(b.date);
      if (sortKey === "magnitude") return dir * (a.magnitude - b.magnitude);
      return dir * a.likelihood.localeCompare(b.likelihood);
    });
  }, [dateFrom, dateTo, likelihoodFilter, magFilter, search, sortDir, sortKey, timeFrom, timeTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageEvents = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstResult = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(currentPage * PAGE_SIZE, filtered.length);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
      return;
    }

    setSortKey(key);
    setSortDir("desc");
  }

  function clearFilters() {
    setSearch("");
    setMagFilter("all");
    setLikelihoodFilter("all");
    setDateFrom("");
    setDateTo("");
    setTimeFrom("");
    setTimeTo("");
  }

  const arrow = (key: SortKey) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  const hasFilters =
    !!search ||
    magFilter !== "all" ||
    likelihoodFilter !== "all" ||
    !!dateFrom ||
    !!dateTo ||
    !!timeFrom ||
    !!timeTo;

  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <section className="bg-brand py-6 sm:py-14" aria-labelledby="events-heading">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <p className="text-xs text-white/60 mb-2">
              <Link href="/" className="hover:underline">Home</Link> &gt; Event List
            </p>
            <h1 id="events-heading" className="font-display text-xl sm:text-4xl text-white">
              All Earthquake Events
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-white/80 max-w-2xl">
              Browse, search, and filter recorded seismic events within the Philippine Area of Responsibility.
            </p>
          </div>
        </section>

        <div className="sticky top-12 sm:top-16 z-30 bg-white border-b border-border shadow-sm">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col gap-3">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search by location, province, or region..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    aria-label="Clear search"
                  >
                    X
                  </button>
                ) : (
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="7" cy="7" r="5" />
                    <path strokeLinecap="round" d="M11 11l3.5 3.5" />
                  </svg>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter start date" />
                <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter end date" />
                <input type="time" value={timeFrom} onChange={(event) => setTimeFrom(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter start time" />
                <input type="time" value={timeTo} onChange={(event) => setTimeTo(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter end time" />
                <select value={magFilter} onChange={(event) => setMagFilter(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter by magnitude">
                  <option value="all">Magnitude: All</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                  <option value="7">7+</option>
                </select>
                <select value={likelihoodFilter} onChange={(event) => setLikelihoodFilter(event.target.value)} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Filter by likelihood">
                  <option value="all">Likelihood: All</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
                <select value={`${sortKey}-${sortDir}`} onChange={(event) => { const [key, dir] = event.target.value.split("-"); setSortKey(key as SortKey); setSortDir(dir as SortDir); }} className="px-3 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30" aria-label="Sort events">
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="magnitude-desc">Magnitude (High-Low)</option>
                  <option value="magnitude-asc">Magnitude (Low-High)</option>
                  <option value="likelihood-desc">Likelihood</option>
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="flex gap-2 mt-3 flex-wrap items-center">
                {search && <FilterTag label={`Search: "${search}"`} onClear={() => setSearch("")} />}
                {magFilter !== "all" && <FilterTag label={`Magnitude: ${magFilter}+`} onClear={() => setMagFilter("all")} />}
                {likelihoodFilter !== "all" && <FilterTag label={`Likelihood: ${likelihoodFilter}`} onClear={() => setLikelihoodFilter("all")} />}
                {dateFrom && <FilterTag label={`From: ${dateFrom}`} onClear={() => setDateFrom("")} />}
                {dateTo && <FilterTag label={`To: ${dateTo}`} onClear={() => setDateTo("")} />}
                {(timeFrom || timeTo) && <FilterTag label={`Time: ${timeFrom || "00:00"}-${timeTo || "23:59"}`} onClear={() => { setTimeFrom(""); setTimeTo(""); }} />}
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
                    <th scope="col" className="px-4 py-3 font-semibold w-12">#</th>
                    <th scope="col" className="px-4 py-3 font-semibold cursor-pointer select-none" onClick={() => toggleSort("date")}>
                      Date &amp; Time{arrow("date")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                    <th scope="col" className="px-4 py-3 font-semibold cursor-pointer select-none" onClick={() => toggleSort("magnitude")}>
                      Magnitude{arrow("magnitude")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">Depth</th>
                    <th scope="col" className="px-4 py-3 font-semibold cursor-pointer select-none" onClick={() => toggleSort("likelihood")}>
                      Likelihood{arrow("likelihood")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-text-muted">
                        <p className="text-lg font-display mb-2">No events found</p>
                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                      </td>
                    </tr>
                  ) : (
                    pageEvents.map((event, index) => (
                      <tr key={event.id} className={`border-t border-border hover:border-l-4 hover:border-l-brand hover:bg-brand/[0.02] transition-all ${index % 2 === 1 ? "bg-bg-subtle" : ""}`}>
                        <td className="px-4 py-3 text-text-muted">{firstResult + index}</td>
                        <td className="px-4 py-3 font-mono text-xs text-text-muted whitespace-nowrap">{event.date} PHT</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-text-primary">{event.location}</p>
                          <p className="text-xs text-text-muted">{event.region}</p>
                        </td>
                        <td className="px-4 py-3"><MagnitudeBadge magnitude={event.magnitude} /></td>
                        <td className="px-4 py-3">
                          <span className="text-text-primary">{event.depth}</span>
                          <span className="text-text-muted ml-1">km</span>
                        </td>
                        <td className="px-4 py-3"><LikelihoodBadge level={event.likelihood} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Link href={`/events/${event.id}`} className="btn-secondary text-xs px-3 py-1.5">Details</Link>
                            <Link href={`/dashboard?event=${event.id}`} className="p-1.5 border border-border rounded-md hover:border-brand hover:text-brand transition-colors" aria-label={`View ${event.location} on map`}>
                              <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                <path strokeLinecap="round" d="M7 1.5c1.5 2.5 4 4.5 4 7a4 4 0 01-8 0c0-2.5 2.5-4.5 4-7z" />
                                <circle cx="7" cy="8.5" r="1.5" />
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
            <p className="text-text-muted">Showing {firstResult}-{lastResult} of {filtered.length} events</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="px-3 py-1.5 border border-border rounded-md text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
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
              <button
                type="button"
                className="px-3 py-1.5 border border-border rounded-md text-text-muted hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
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
