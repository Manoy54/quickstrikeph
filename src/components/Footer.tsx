import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-text-inverse" role="contentinfo">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Seismic Monitoring
            </p>
            <p className="mt-1.5 text-xs sm:text-sm text-white/50">
              Seismic monitoring &amp; aftershock likelihood forecasting for the Philippines.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start md:items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">
              Quick Links
            </span>
            {[
              { href: "/", label: "Home" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/about", label: "About" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="text-right max-md:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block mb-1">
              Disclaimer
            </span>
            <p className="text-xs text-white/50 leading-relaxed">
              Data sourced from PHIVOLCS. For academic use only. Not an official warning system.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 text-center text-[10px] sm:text-xs text-white/40">
          Developed by Armenta, Buergo, Candelaria, Pispis — Bicol University BSIT 2025
        </div>
      </div>
    </footer>
  );
}
