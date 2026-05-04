"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/events", label: "Event List" },
  { href: "/forecast-history", label: "Forecast History" },
  { href: "/about", label: "About" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-3 sm:h-16 sm:px-6">
          <Link
            href="/"
            className="flex shrink-0 items-center text-text-primary transition-opacity hover:opacity-80"
            aria-label="Go to home page"
          >
            <span className="font-display text-lg leading-none sm:text-xl">
              QuickStrike<span className="text-brand">PH</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-brand font-bold underline underline-offset-4 decoration-2"
                      : "text-text-secondary hover:text-brand hover:underline hover:underline-offset-4 hover:decoration-2"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/dashboard" className="btn-primary text-xs px-3 py-1.5">
              View Live Dashboard
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 text-text-secondary hover:text-brand rounded-md"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer — rendered outside nav to avoid sticky stacking context issues */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            className="fixed top-0 right-0 z-[70] h-full w-64 bg-white shadow-xl flex flex-col p-5"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between gap-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center text-text-primary"
              aria-label="Go to home page"
            >
              <span className="font-display text-lg leading-none">
                QuickStrike<span className="text-brand">PH</span>
              </span>
            </Link>
              <button
                className="rounded-md p-2 text-text-secondary hover:text-brand"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand/10 text-brand font-bold"
                        : "text-text-secondary hover:bg-bg-subtle hover:text-brand"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-4 text-center text-sm py-2.5"
            >
              View Live Dashboard
            </Link>
          </div>
        </>
      )}
    </>
  );
}
