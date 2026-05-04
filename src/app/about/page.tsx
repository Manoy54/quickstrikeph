import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about QuakeStrike PH, how it works, the team behind it, and important disclaimers.",
};

const STEPS = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="4" y="6" width="24" height="20" rx="3" stroke="#023e8a" strokeWidth="2" />
        <line x1="4" y1="12" x2="28" y2="12" stroke="#023e8a" strokeWidth="2" />
        <line x1="16" y1="12" x2="16" y2="26" stroke="#023e8a" strokeWidth="2" />
      </svg>
    ),
    title: "Data Collection",
    desc: "PHIVOLCS earthquake catalog data is collected and stored in a structured database for processing.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="10" cy="12" r="4" stroke="#023e8a" strokeWidth="2" />
        <circle cx="22" cy="10" r="3" stroke="#023e8a" strokeWidth="2" />
        <circle cx="18" cy="22" r="4" stroke="#023e8a" strokeWidth="2" />
        <line x1="13" y1="14" x2="18" y2="18" stroke="#023e8a" strokeWidth="1.5" />
        <line x1="14" y1="11" x2="19" y2="10" stroke="#023e8a" strokeWidth="1.5" />
      </svg>
    ),
    title: "Sequence Detection",
    desc: "Zaliapin nearest-neighbor declustering identifies historical mainshock-aftershock relationships.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="18" width="5" height="8" rx="1" fill="#023e8a" opacity="0.3" />
        <rect x="13" y="12" width="5" height="14" rx="1" fill="#023e8a" opacity="0.6" />
        <rect x="20" y="6" width="5" height="20" rx="1" fill="#023e8a" />
      </svg>
    ),
    title: "Likelihood Estimation",
    desc: "A machine learning model generates percentage-based aftershock likelihood outputs within 24 hours.",
  },
];

const TEAM = [
  { name: "Armenta, Sean Dylan L.", role: "Developer" },
  { name: "Buergo, Chenie Niña E.", role: "Developer" },
  { name: "Candelaria, John Benedict B.", role: "Developer" },
  { name: "Pispis, Dan Emanuel G.", role: "Developer" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        {/* Hero */}
        <section className="bg-brand py-10 sm:py-20 text-center" aria-labelledby="about-heading">
          <div className="mx-auto max-w-3xl px-3 sm:px-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Academic Prototype
            </span>
            <h1 id="about-heading" className="font-display text-2xl sm:text-4xl text-white mt-3 sm:mt-4">
              About QuakeStrike PH
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-white/80 max-w-xl mx-auto">
              A web-based aftershock likelihood forecasting system using PHIVOLCS earthquake data.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-3 sm:px-6 py-8 sm:py-14 space-y-10 sm:space-y-16">
          {/* Section 1 — Overview */}
          <section aria-labelledby="overview-heading">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Overview</span>
            <h2 id="overview-heading" className="font-display text-xl sm:text-2xl mt-2 mb-3 sm:mb-4">What Is QuakeStrike PH?</h2>
            <p className="text-sm sm:text-base text-text-secondary leading-7">
              The Philippines sits along the Pacific Ring of Fire, making it one of the most
              seismically active countries in the world. QuakeStrike PH is an academic prototype
              designed to monitor Philippine seismic activity and provide probability-based
              aftershock likelihood forecasts, helping communities understand what may come after
              a significant earthquake event.
            </p>
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-brand/5 border-l-4 border-brand rounded-r-lg">
              <p className="text-sm text-text-secondary leading-relaxed">
                QuakeStrike PH is an academic capstone prototype. It is not an official PHIVOLCS
                product and should not be used as the sole basis for emergency decisions.
              </p>
            </div>
          </section>

          {/* Section 2 — How It Works */}
          <section aria-labelledby="methodology-heading">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Methodology</span>
            <h2 id="methodology-heading" className="font-display text-xl sm:text-2xl mt-2 mb-4 sm:mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {STEPS.map((step, i) => (
                <div key={step.title} className="card p-4 sm:p-6 text-center relative">
                  <div className="mb-4 flex justify-center">{step.icon}</div>
                  <p className="text-xs font-bold text-brand mb-1">Step {i + 1}</p>
                  <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <span className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-brand text-xl font-bold z-10" aria-hidden="true">→</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 — Likelihood Levels */}
          <section aria-labelledby="levels-heading">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Interpretation Guide</span>
            <h2 id="levels-heading" className="font-display text-xl sm:text-2xl mt-2 mb-4 sm:mb-6">Understanding Likelihood Levels</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {[
                { level: "LOW", color: "bg-low", desc: "Lower probability of significant aftershock activity within 24 hours. Normal precautions advised." },
                { level: "MEDIUM", color: "bg-medium", desc: "Moderate probability. Continued awareness and preparedness are recommended." },
                { level: "HIGH", color: "bg-high", desc: "Higher probability of aftershock activity. Follow official PHIVOLCS advisories and local government guidelines." },
              ].map(({ level, color, desc }) => (
                <div key={level} className="card p-4 sm:p-5">
                  <span className={`badge text-white ${color === "bg-low" ? "badge-low" : color === "bg-medium" ? "badge-medium" : "badge-high"} mb-3`}>
                    {level}
                  </span>
                  <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 — Data Source */}
          <section aria-labelledby="data-heading">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Data</span>
            <h2 id="data-heading" className="font-display text-xl sm:text-2xl mt-2 mb-3 sm:mb-4">Data Source</h2>
            <p className="text-sm sm:text-base text-text-secondary leading-7">
              All seismic data is sourced from the Philippine Institute of Volcanology and Seismology
              (PHIVOLCS) earthquake catalog. The system utilizes event parameters including date-time,
              latitude, longitude, depth, and magnitude for its forecasting models.
            </p>
            <div className="mt-4 card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                  <circle cx="10" cy="10" r="8" stroke="#023e8a" strokeWidth="1.5" />
                  <path d="M10 6v4l2.5 2.5" stroke="#023e8a" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">Philippine Institute of Volcanology and Seismology</p>
                <a
                  href="https://www.phivolcs.dost.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand hover:underline inline-flex items-center gap-1"
                >
                  Visit PHIVOLCS
                  <svg width="12" height="12" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" d="M3 9l6-6M5 3h4v4" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Section 5 — The Team */}
          <section aria-labelledby="team-heading">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Developers</span>
            <h2 id="team-heading" className="font-display text-xl sm:text-2xl mt-2 mb-4 sm:mb-6">Development Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TEAM.map(({ name, role }) => (
                <div key={name} className="card p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-bg-subtle flex items-center justify-center text-brand font-bold text-lg">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{name}</p>
                    <p className="text-xs text-text-muted">{role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">Bicol University College of Science — Information Technology Department, Legazpi City</p>
              <p className="text-sm text-text-muted mt-1">Adviser: <strong>Dr. Aris J. Ordoñez</strong></p>
            </div>
          </section>

          {/* Section 6 — Disclaimer */}
          <section className="bg-text-secondary rounded-xl p-5 sm:p-8 text-white text-center" aria-labelledby="disclaimer-heading">
            <span className="text-3xl mb-3 block" aria-hidden="true">⚠️</span>
            <h2 id="disclaimer-heading" className="font-display text-xl mb-3">Important Disclaimer</h2>
            <p className="text-sm text-white/80 leading-relaxed max-w-xl mx-auto">
              This system is an academic capstone prototype and is not an official PHIVOLCS product.
              It provides probability-based estimates, not deterministic earthquake predictions.
              Aftershocks may or may not occur. Do not use this as the sole basis for emergency
              decisions. Always refer to official PHIVOLCS advisories for authoritative information.
            </p>
            <a
              href="https://www.phivolcs.dost.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-white text-white text-sm font-semibold rounded-lg hover:bg-white hover:text-text-secondary transition-colors"
            >
              Visit PHIVOLCS Official Website
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" d="M3 11l8-8M5 3h6v6" />
              </svg>
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
