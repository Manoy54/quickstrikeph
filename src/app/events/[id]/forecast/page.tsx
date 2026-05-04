import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikelihoodBadge from "@/components/LikelihoodBadge";
import InfoTip from "@/components/InfoTip";

const FORECAST = {
  eventId: "eq-001",
  location: "Cataingan, Masbate",
  magnitude: 6.6,
  date: "Aug 18, 2024",
  probability: 78,
  likelihood: "HIGH" as const,
  distance: "0-45 km",
  maxMag: "Up to M 5.6",
  model: "Machine Learning (Random Forest / Gradient Boosting)",
  preprocessing: "Zaliapin Nearest-Neighbor Declustering",
  dataSource: "PHIVOLCS Earthquake Catalog",
  generated: "2024-08-18 15:00 PHT",
  window: "24 Hours",
  confidence: "Moderate confidence - prototype model output",
  trainingPeriod: "2010-2024 (Philippine PAR)",
};

export default async function ForecastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">
        <div className="mx-auto max-w-[900px] px-3 sm:px-6 py-6 sm:py-14">
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Forecast Report</span>
            <h1 className="font-display text-xl sm:text-4xl text-text-primary mt-2">
              Aftershock Likelihood Forecast
            </h1>
            <p className="text-sm text-text-muted mt-2">
              M {FORECAST.magnitude} - {FORECAST.location} - {FORECAST.date}
            </p>
            <span className="inline-block mt-2 sm:mt-3 px-3 py-1 sm:px-4 sm:py-1.5 bg-brand text-white text-[10px] sm:text-xs font-semibold rounded-full">
              24-Hour Forecast Window
            </span>
          </div>

          <div className="card p-5 sm:p-8 text-center mb-5 sm:mb-8">
            <span className={`font-display text-5xl sm:text-[96px] ${FORECAST.likelihood === "HIGH" ? "text-high" : FORECAST.likelihood === "MEDIUM" ? "text-medium" : "text-low"}`}>
              {FORECAST.probability}%
            </span>
            <p className="text-base text-text-muted mt-2">
              Probability of at least one <InfoTip term="aftershock">A smaller earthquake that may occur after a larger event in the same general area.</InfoTip> occurring
            </p>
            <div className="mt-4">
              <LikelihoodBadge level={FORECAST.likelihood} />
            </div>
          </div>

          <div className="mb-6 sm:mb-10">
            <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, #16a34a, #b45309, #dc2626)" }}>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-text-secondary"
                style={{ left: `${FORECAST.probability}%`, transform: "translate(-50%, -50%)" }}
                aria-label={`Probability gauge at ${FORECAST.probability}%`}
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <p className="text-center font-mono text-sm text-text-muted mt-1">
              Current estimate: {FORECAST.probability}%
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-10">
            {[
              {
                icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><polyline points="2,12 6,12 8,6 11,18 14,4 17,16 20,8 22,12" stroke="#023e8a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                label: <InfoTip term="At least one aftershock">The chance that one or more aftershocks may occur in the forecast window.</InfoTip>,
                value: `${FORECAST.probability}%`,
                sub: "within 24 hours",
              },
              {
                icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="#023e8a" strokeWidth="2" /><circle cx="12" cy="12" r="3" stroke="#023e8a" strokeWidth="1.5" /></svg>,
                label: <InfoTip term="Estimated epicentral distance">The forecasted distance range from the epicenter where aftershocks may occur.</InfoTip>,
                value: FORECAST.distance,
                sub: "from epicenter",
              },
              {
                icon: <svg width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="14" width="4" height="6" rx="1" fill="#023e8a" opacity="0.3" /><rect x="10" y="8" width="4" height="12" rx="1" fill="#023e8a" opacity="0.6" /><rect x="16" y="4" width="4" height="16" rx="1" fill="#023e8a" /></svg>,
                label: <InfoTip term="Possible max aftershock magnitude">An estimated upper magnitude for aftershocks in the forecast window, not a guaranteed value.</InfoTip>,
                value: FORECAST.maxMag,
                sub: "within forecast window",
              },
            ].map(({ icon, label, value, sub }, index) => (
              <div key={index} className="card p-4 sm:p-5 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">{icon}</div>
                <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wide mb-1.5 sm:mb-2">{label}</p>
                <p className="font-display text-xl sm:text-2xl text-text-primary mb-0.5 sm:mb-1">{value}</p>
                <p className="text-[10px] sm:text-xs text-text-muted">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-bg-subtle border border-border rounded-lg p-4 sm:p-6 mb-5 sm:mb-8">
            <h2 className="font-semibold text-sm text-text-primary mb-4">Forecast Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                ["Model Used", FORECAST.model],
                ["Preprocessing", FORECAST.preprocessing],
                ["Data Source", FORECAST.dataSource],
                ["Forecast Generated", FORECAST.generated],
                ["Forecast Window", FORECAST.window],
                ["Confidence Note", FORECAST.confidence],
                ["Training Data Period", FORECAST.trainingPeriod],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-text-muted text-xs uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-text-primary font-mono text-xs">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-l-4 border-medium bg-medium/5 rounded-r-lg p-4 sm:p-5 mb-5 sm:mb-8">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0" aria-hidden="true">!</span>
              <div>
                <p className="font-semibold text-sm text-text-primary mb-1">Important Disclaimer</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  This forecast is an academic prototype output. It is a probability estimate, not an exact earthquake prediction.
                  Aftershocks may or may not occur. Do not use this as a sole basis for emergency decisions.
                  Refer to official PHIVOLCS advisories for authoritative information.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Link href={`/events/${id}`} className="btn-secondary text-xs sm:text-sm">
              Back to Event Details
            </Link>
            <Link href="/forecast-history" className="btn-primary text-xs sm:text-sm">
              View Forecast History
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
