"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorReference = error.digest;

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-md px-4 py-20">
          <span className="text-5xl mb-4 block" aria-hidden="true">⚠️</span>
          <h1 className="font-display text-3xl text-text-primary mb-3">Something Went Wrong</h1>
          <p className="text-text-muted mb-8">
            An unexpected error occurred. Please try again later.
          </p>
          {errorReference && (
            <p className="text-xs text-text-muted mb-4 font-mono">
              Reference: {errorReference}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="btn-primary">Retry</button>
            <Link href="/" className="btn-secondary">Go to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
