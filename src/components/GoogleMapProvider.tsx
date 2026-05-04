"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import type { ReactNode } from "react";

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
const GOOGLE_MAPS_LIBRARIES = ["marker"];

interface GoogleMapProviderProps {
  children: ReactNode;
}

/**
 * Wraps children with the Google Maps API provider.
 * Map components render a setup state when no browser API key exists.
 */
export default function GoogleMapProvider({ children }: GoogleMapProviderProps) {
  if (!GOOGLE_MAPS_API_KEY) {
    return <>{children}</>;
  }

  return (
    <APIProvider
      apiKey={GOOGLE_MAPS_API_KEY}
      libraries={GOOGLE_MAPS_LIBRARIES}
      region="PH"
      language="en"
    >
      {children}
    </APIProvider>
  );
}
