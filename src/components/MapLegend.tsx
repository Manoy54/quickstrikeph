"use client";

import { useState } from "react";

const LEGEND_ITEMS = [
  { label: "Low", color: "#16a34a" },
  { label: "Medium", color: "#b45309" },
  { label: "High", color: "#dc2626" },
] as const;

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pointer-events-auto absolute top-3 right-3 z-[80] w-[188px] rounded-lg border border-border bg-white/95 text-xs text-text-secondary shadow-md backdrop-blur sm:top-4 sm:right-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label="Toggle map legend"
      >
        <span>Map Legend</span>
        <span
          className={`text-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          v
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-border px-3 pb-3 pt-2 space-y-1.5">
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span>{item.label} likelihood</span>
            </div>
          ))}

          <div className="flex items-center gap-2 pt-1">
            <span className="flex h-4 w-4 items-center justify-center" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-text-muted" />
            </span>
            <span>Dot size shows magnitude</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border-2 border-brand/50 bg-brand/10"
              aria-hidden="true"
            />
            <span>Estimated distance range</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border-2 border-brand bg-white shadow-[0_0_0_3px_rgba(2,62,138,0.18)]"
              aria-hidden="true"
            />
            <span>Selected event</span>
          </div>
        </div>
      )}
    </div>
  );
}
