import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-md px-4 py-20">
          {/* Broken seismograph SVG */}
          <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-6 text-text-muted" aria-hidden="true">
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
            <polyline points="10,40 20,40 25,28 30,52 35,20 40,50 45,30 50,40 55,40" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <line x1="55" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,4" opacity="0.3" />
          </svg>
          <h1 className="font-display text-3xl text-text-primary mb-3">Page Not Found</h1>
          <p className="text-text-muted mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="btn-primary">Go to Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
