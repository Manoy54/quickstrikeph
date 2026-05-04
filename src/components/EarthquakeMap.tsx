"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, RefObject, WheelEvent as ReactWheelEvent } from "react";
import {
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import Link from "next/link";
import MapLegend from "@/components/MapLegend";

type Likelihood = "LOW" | "MEDIUM" | "HIGH";

export interface EqEvent {
  id: string;
  location: string;
  region: string;
  magnitude: number;
  depth: number;
  date: string;
  likelihood: Likelihood;
  lat: number;
  lng: number;
  distanceRange?: number;
}

function likelihoodColor(likelihood: Likelihood) {
  if (likelihood === "HIGH") return "#dc2626";
  if (likelihood === "MEDIUM") return "#b45309";
  return "#16a34a";
}

function markerScale(magnitude: number) {
  if (magnitude >= 7) return 28;
  if (magnitude >= 6) return 22;
  if (magnitude >= 5) return 18;
  if (magnitude >= 4) return 14;
  return 10;
}

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
const GOOGLE_MAPS_MAP_ID =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || "DEMO_MAP_ID";

const GOOGLE_TILE_SIZE = 256;
const GOOGLE_TILE_LAYER = "m";
const EARTH_CIRCUMFERENCE_METERS = 40075016.686;
const MAX_MERCATOR_LATITUDE = 85.05112878;

const PH_CENTER = { lat: 12.8797, lng: 121.774 };
const PH_BOUNDS = {
  north: 21.45,
  south: 4.35,
  west: 116.0,
  east: 127.7,
};
const PH_ZOOM = 6;
const PH_MIN_ZOOM = 5.75;
const PH_MAP_RESTRICTION = {
  latLngBounds: PH_BOUNDS,
  strictBounds: true,
} as const;

function clampToPhilippines(point: { lat: number; lng: number }) {
  return {
    lat: Math.min(PH_BOUNDS.north, Math.max(PH_BOUNDS.south, point.lat)),
    lng: Math.min(PH_BOUNDS.east, Math.max(PH_BOUNDS.west, point.lng)),
  };
}

function clampMapZoom(zoom: number) {
  return Math.max(PH_ZOOM, Math.min(14, Math.round(zoom)));
}

function worldPixelToLatLng(point: { x: number; y: number }, zoom: number) {
  const worldSize = GOOGLE_TILE_SIZE * 2 ** zoom;
  const lng = (point.x / worldSize) * 360 - 180;
  const mercatorY = 0.5 - point.y / worldSize;
  const lat =
    (90 -
      (360 * Math.atan(Math.exp(-mercatorY * 2 * Math.PI))) / Math.PI);

  return clampToPhilippines({ lat, lng });
}

function PulsingDot({
  color,
  size,
  isSelected,
}: {
  color: string;
  size: number;
  isSelected: boolean;
}) {
  return (
    <div
      style={{ width: size, height: size, position: "relative" }}
      className="flex items-center justify-center"
    >
      <div
        className="absolute inset-0 rounded-full animate-ping"
        style={{
          backgroundColor: color,
          opacity: isSelected ? 0.4 : 0.2,
          animationDuration: "2s",
        }}
      />
      <div
        className="relative z-10 rounded-full border-2 border-white shadow-lg"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: isSelected
            ? `0 0 0 4px ${color}40, 0 2px 8px rgba(0,0,0,0.3)`
            : "0 2px 6px rgba(0,0,0,0.3)",
        }}
      />
    </div>
  );
}

function ProbabilityRadius({
  center,
  radiusKm,
  color,
}: {
  center: { lat: number; lng: number };
  radiusKm: number;
  color: string;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    const circle = new window.google.maps.Circle({
      map,
      center,
      radius: radiusKm * 1000,
      fillColor: color,
      fillOpacity: 0.08,
      strokeColor: color,
      strokeOpacity: 0.35,
      strokeWeight: 2,
    });

    return () => {
      circle.setMap(null);
    };
  }, [map, center, radiusKm, color]);

  return null;
}

function latLngToWorldPixel(
  point: { lat: number; lng: number },
  zoom: number
) {
  const latitude = Math.min(
    MAX_MERCATOR_LATITUDE,
    Math.max(-MAX_MERCATOR_LATITUDE, point.lat)
  );
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);
  const worldSize = GOOGLE_TILE_SIZE * 2 ** zoom;

  return {
    x: ((point.lng + 180) / 360) * worldSize,
    y:
      (0.5 -
        Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) *
      worldSize,
  };
}

function projectPointToPreview(
  point: { lat: number; lng: number },
  center: { lat: number; lng: number },
  zoom: number,
  size: { width: number; height: number }
) {
  const worldPoint = latLngToWorldPixel(clampToPhilippines(point), zoom);
  const worldCenter = latLngToWorldPixel(center, zoom);

  return {
    x: worldPoint.x - worldCenter.x + size.width / 2,
    y: worldPoint.y - worldCenter.y + size.height / 2,
  };
}

function radiusKmToPreviewPixels(
  radiusKm: number,
  latitude: number,
  zoom: number
) {
  const latitudeRadians = (latitude * Math.PI) / 180;
  const worldSize = GOOGLE_TILE_SIZE * 2 ** zoom;
  const metersPerPixel =
    (Math.cos(latitudeRadians) * EARTH_CIRCUMFERENCE_METERS) / worldSize;

  return Math.max(8, (radiusKm * 1000) / metersPerPixel);
}

function GoogleTileBasemap({
  center,
  zoom,
  size,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  size: { width: number; height: number };
}) {
  const [tilesReady, setTilesReady] = useState(false);
  const loadedCountRef = useRef(0);
  const batchIdRef = useRef(0);

  const tiles = useMemo(() => {
    if (size.width === 0 || size.height === 0) return [];

    const centerPixel = latLngToWorldPixel(center, zoom);
    const topLeft = {
      x: centerPixel.x - size.width / 2,
      y: centerPixel.y - size.height / 2,
    };
    const maxTileIndex = 2 ** zoom;
    const startTileX = Math.floor(topLeft.x / GOOGLE_TILE_SIZE);
    const endTileX = Math.floor((topLeft.x + size.width) / GOOGLE_TILE_SIZE);
    const startTileY = Math.max(
      0,
      Math.floor(topLeft.y / GOOGLE_TILE_SIZE)
    );
    const endTileY = Math.min(
      maxTileIndex - 1,
      Math.floor((topLeft.y + size.height) / GOOGLE_TILE_SIZE)
    );
    const nextTiles: Array<{
      key: string;
      src: string;
      left: number;
      top: number;
    }> = [];

    for (let tileX = startTileX; tileX <= endTileX; tileX += 1) {
      const wrappedTileX =
        ((tileX % maxTileIndex) + maxTileIndex) % maxTileIndex;

      for (let tileY = startTileY; tileY <= endTileY; tileY += 1) {
        const serverIndex = (wrappedTileX + tileY) % 4;

        nextTiles.push({
          key: `${zoom}-${wrappedTileX}-${tileY}`,
          src: `https://mt${serverIndex}.google.com/vt/lyrs=${GOOGLE_TILE_LAYER}&x=${wrappedTileX}&y=${tileY}&z=${zoom}&hl=en`,
          left: tileX * GOOGLE_TILE_SIZE - topLeft.x,
          top: tileY * GOOGLE_TILE_SIZE - topLeft.y,
        });
      }
    }

    return nextTiles;
  }, [center, size.height, size.width, zoom]);

  // Reset loading state when tiles change and preload them
  useEffect(() => {
    if (tiles.length === 0) {
      setTilesReady(true);
      return;
    }

    batchIdRef.current += 1;
    const currentBatch = batchIdRef.current;
    loadedCountRef.current = 0;
    setTilesReady(false);

    let settled = false;

    const onSettled = () => {
      if (settled || currentBatch !== batchIdRef.current) return;
      loadedCountRef.current += 1;
      if (loadedCountRef.current >= tiles.length) {
        settled = true;
        setTilesReady(true);
      }
    };

    tiles.forEach((tile) => {
      const img = new Image();
      img.onload = onSettled;
      img.onerror = onSettled;
      img.src = tile.src;
    });

    // Fallback: reveal after a short timeout so the map is never blank for too long
    const fallbackTimer = setTimeout(() => {
      if (currentBatch === batchIdRef.current && !settled) {
        settled = true;
        setTilesReady(true);
      }
    }, 2500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [tiles]);

  return (
    <div className="absolute inset-0 bg-[#73cfe0]" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          opacity: tilesReady ? 1 : 0,
          transition: "opacity 250ms ease-in",
        }}
      >
        {tiles.map((tile) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            draggable={false}
            loading="eager"
            // @ts-expect-error -- fetchPriority is valid HTML but React types may lag
            fetchpriority="high"
            decoding="async"
            className="absolute max-w-none select-none"
            style={{
              left: tile.left,
              top: tile.top,
              width: GOOGLE_TILE_SIZE,
              height: GOOGLE_TILE_SIZE,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-1 left-1 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 shadow-sm">
        Google
      </div>
    </div>
  );
}

function getEventRadiusKm(event: EqEvent) {
  return event.distanceRange ?? getDefaultRadius(event.magnitude);
}

function getRadiusEvents(events: EqEvent[], showProbabilityRadius: boolean) {
  if (!showProbabilityRadius) return [];
  return events;
}

function PreviewMap({
  events,
  activeEventId,
  onMarkerClick,
  showProbabilityRadius,
  center,
  zoom,
  className,
  showLegend,
}: {
  events: EqEvent[];
  activeEventId: string | null;
  onMarkerClick: (eventId: string) => void;
  showProbabilityRadius: boolean;
  center: { lat: number; lng: number };
  zoom: number;
  className: string;
  showLegend: boolean;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const activePointersRef = useRef(new Map<number, { x: number; y: number }>());
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startCenterPixel: { x: number; y: number };
  } | null>(null);
  const pinchStateRef = useRef<{
    startDistance: number;
    startZoom: number;
  } | null>(null);
  const [mapSize, setMapSize] = useState({ width: 1280, height: 720 });
  const [viewCenter, setViewCenter] = useState(() => clampToPhilippines(center));
  const [viewZoom, setViewZoom] = useState(() => clampMapZoom(zoom));
  const [isDragging, setIsDragging] = useState(false);
  const activeEvent = events.find((event) => event.id === activeEventId) ?? null;
  const radiusEvents = getRadiusEvents(events, showProbabilityRadius);
  const tileZoom = clampMapZoom(viewZoom);

  useMapGestureGuards(mapRef);

  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    const updateSize = () => {
      const { width, height } = mapElement.getBoundingClientRect();
      setMapSize({
        width: Math.round(width),
        height: Math.round(height),
      });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(mapElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      activePointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      event.currentTarget.setPointerCapture(event.pointerId);

      if (activePointersRef.current.size >= 2) {
        const [firstPointer, secondPointer] = Array.from(
          activePointersRef.current.values()
        );

        pinchStateRef.current = {
          startDistance: getPointerDistance(firstPointer, secondPointer),
          startZoom: tileZoom,
        };
        dragStateRef.current = null;
        setIsDragging(false);
        return;
      }

      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startCenterPixel: latLngToWorldPixel(viewCenter, tileZoom),
      };
      setIsDragging(true);
    },
    [tileZoom, viewCenter]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (activePointersRef.current.has(event.pointerId)) {
        activePointersRef.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
      }

      const pinchState = pinchStateRef.current;
      if (pinchState && activePointersRef.current.size >= 2) {
        const [firstPointer, secondPointer] = Array.from(
          activePointersRef.current.values()
        );
        const nextDistance = getPointerDistance(firstPointer, secondPointer);

        if (pinchState.startDistance > 0 && nextDistance > 0) {
          setViewZoom(
            clampMapZoom(
              pinchState.startZoom +
                Math.log2(nextDistance / pinchState.startDistance)
            )
          );
        }

        return;
      }

      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) return;

      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      const nextCenterPixel = {
        x: dragState.startCenterPixel.x - deltaX,
        y: dragState.startCenterPixel.y - deltaY,
      };

      setViewCenter(worldPixelToLatLng(nextCenterPixel, tileZoom));
    },
    [tileZoom]
  );

  const endPointerDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      activePointersRef.current.delete(event.pointerId);
      if (activePointersRef.current.size < 2) {
        pinchStateRef.current = null;
      }

      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        return;
      }

      dragStateRef.current = null;
      setIsDragging(false);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setViewZoom((currentZoom) =>
      clampMapZoom(currentZoom + (event.deltaY < 0 ? 1 : -1))
    );
  }, []);

  const zoomIn = useCallback(() => {
    setViewZoom((currentZoom) => clampMapZoom(currentZoom + 1));
  }, []);

  const zoomOut = useCallback(() => {
    setViewZoom((currentZoom) => clampMapZoom(currentZoom - 1));
  }, []);

  return (
    <div
      ref={mapRef}
      className={`${className} relative touch-none overscroll-contain overflow-hidden bg-sky-100 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointerDrag}
      onPointerCancel={endPointerDrag}
      onWheel={handleWheel}
      aria-label="Interactive Google map of Philippine seismic activity"
    >
      <GoogleTileBasemap center={viewCenter} zoom={tileZoom} size={mapSize} />

      <div
        className="absolute left-3 top-3 z-20 overflow-hidden rounded-md border border-border bg-white shadow-sm"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center border-b border-border text-lg font-semibold text-text-primary hover:bg-bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={zoomIn}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center text-lg font-semibold text-text-primary hover:bg-bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          onClick={zoomOut}
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      {events.length === 0 ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center p-4"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="rounded-lg bg-white/92 px-4 py-3 text-center shadow-sm ring-1 ring-border backdrop-blur">
            <p className="text-sm font-semibold text-text-primary">
              No events match the current filters
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Adjust the filters to show earthquakes on the preview map.
            </p>
          </div>
        </div>
      ) : (
        <>
          {radiusEvents.map((event) => {
            const position = projectPointToPreview({
              lat: event.lat,
              lng: event.lng,
            }, viewCenter, tileZoom, mapSize);
            const radiusPixels = radiusKmToPreviewPixels(
              getEventRadiusKm(event),
              event.lat,
              tileZoom
            );

            return (
              <div
                key={`preview-radius-${event.id}`}
                className="pointer-events-none absolute z-[4] -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                style={{
                  left: position.x,
                  top: position.y,
                  width: radiusPixels * 2,
                  aspectRatio: "1 / 1",
                  borderColor: `${likelihoodColor(event.likelihood)}88`,
                  backgroundColor: `${likelihoodColor(event.likelihood)}1f`,
                }}
              />
            );
          })}

          {events.map((event) => {
            const position = projectPointToPreview({
              lat: event.lat,
              lng: event.lng,
            }, viewCenter, tileZoom, mapSize);
            const isSelected = activeEventId === event.id;

            return (
              <button
                key={`preview-marker-${event.id}`}
                type="button"
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                style={{ left: position.x, top: position.y }}
                onClick={() => onMarkerClick(event.id)}
                onPointerDown={(event) => event.stopPropagation()}
                aria-pressed={isSelected}
                aria-label={`${event.location}, magnitude ${event.magnitude}, ${event.likelihood.toLowerCase()} likelihood`}
              >
                <PulsingDot
                  color={likelihoodColor(event.likelihood)}
                  size={markerScale(event.magnitude)}
                  isSelected={isSelected}
                />
              </button>
            );
          })}
        </>
      )}

      {activeEvent && (
        <div
          className="absolute inset-x-3 bottom-3 z-20 rounded-xl bg-white/94 p-3 shadow-lg ring-1 ring-border backdrop-blur"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {activeEvent.location}
              </p>
              <p className="text-xs text-text-muted">{activeEvent.region}</p>
            </div>
            <span
              className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white"
              style={{
                backgroundColor: likelihoodColor(activeEvent.likelihood),
              }}
            >
              {activeEvent.likelihood}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="font-mono">{activeEvent.date}</span>
            <span>{activeEvent.depth} km depth</span>
            <span>M {activeEvent.magnitude.toFixed(1)}</span>
            <span>{getEventRadiusKm(activeEvent)} km radius</span>
          </div>
          <Link
            href={`/events/${activeEvent.id}`}
            className="mt-3 block w-full rounded px-3 py-1.5 text-center text-xs font-semibold text-white"
            style={{ backgroundColor: "#023e8a" }}
          >
            View Full Details
          </Link>
        </div>
      )}

      {showLegend && (
        <div
          className="pointer-events-none absolute inset-0 z-[80]"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <MapLegend />
        </div>
      )}
    </div>
  );
}

function MapViewportController({
  enabled,
  center,
  zoom,
}: {
  enabled: boolean;
  center: { lat: number; lng: number };
  zoom: number;
}) {
  const map = useMap();
  const { lat, lng } = center;

  useEffect(() => {
    if (!enabled || !map) return;

    map.moveCamera({
      center: { lat, lng },
      zoom: Math.max(PH_MIN_ZOOM, zoom),
    });
  }, [enabled, lat, lng, zoom, map]);

  return null;
}

function PhilippinesBoundsController({
  enabled,
  onMinZoomChange,
}: {
  enabled: boolean;
  onMinZoomChange: (zoom: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !map || !window.google?.maps) return;

    const bounds = new window.google.maps.LatLngBounds(
      { lat: PH_BOUNDS.south, lng: PH_BOUNDS.west },
      { lat: PH_BOUNDS.north, lng: PH_BOUNDS.east }
    );

    const idleListener = window.google.maps.event.addListenerOnce(
      map,
      "idle",
      () => {
        const fittedZoom = map.getZoom();
        if (typeof fittedZoom === "number") {
          onMinZoomChange(Math.max(PH_MIN_ZOOM, fittedZoom));
        }
      }
    );

    map.fitBounds(bounds, 24);

    return () => {
      window.google.maps.event.removeListener(idleListener);
    };
  }, [enabled, map, onMinZoomChange]);

  return null;
}

interface EarthquakeMapProps {
  events: EqEvent[];
  selectedEventId?: string | null;
  onSelectEvent?: (id: string | null) => void;
  showProbabilityRadius?: boolean;
  centerOnEvent?: EqEvent | null;
  zoom?: number;
  center?: { lat: number; lng: number };
  className?: string;
  mapId?: string;
  showLegend?: boolean;
  showZoomControl?: boolean;
  preferStaticOnMobile?: boolean;
}

export default function EarthquakeMap({
  events,
  selectedEventId,
  onSelectEvent,
  showProbabilityRadius = true,
  centerOnEvent,
  zoom,
  center,
  className = "w-full h-full",
  mapId,
  showLegend = true,
  showZoomControl = true,
  preferStaticOnMobile = false,
}: EarthquakeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [infoEventId, setInfoEventId] = useState<string | null>(null);
  const [effectiveMinZoom, setEffectiveMinZoom] = useState(PH_MIN_ZOOM);
  const useStaticMobileMap = useIsMobileViewport(preferStaticOnMobile);
  const hasApiKey = !!GOOGLE_MAPS_API_KEY;
  const activeEventId = selectedEventId ?? infoEventId;

  const mapCenter = useMemo(() => {
    if (centerOnEvent) {
      return clampToPhilippines({
        lat: centerOnEvent.lat,
        lng: centerOnEvent.lng,
      });
    }
    if (center) return clampToPhilippines(center);
    return PH_CENTER;
  }, [centerOnEvent, center]);

  const mapZoom = useMemo(() => {
    if (zoom) return zoom;
    if (centerOnEvent) return 10;
    return PH_ZOOM;
  }, [zoom, centerOnEvent]);

  const handleMarkerClick = useCallback(
    (eventId: string) => {
      const nextEventId = eventId === activeEventId ? null : eventId;
      setInfoEventId(nextEventId);
      onSelectEvent?.(nextEventId);
    },
    [activeEventId, onSelectEvent]
  );

  const radiusEvents = useMemo(() => {
    return getRadiusEvents(events, showProbabilityRadius);
  }, [events, showProbabilityRadius]);

  useMapGestureGuards(mapContainerRef);

  if (!hasApiKey || useStaticMobileMap) {
    return (
      <PreviewMap
        key={`${mapCenter.lat}-${mapCenter.lng}-${mapZoom}`}
        events={events}
        activeEventId={activeEventId}
        onMarkerClick={handleMarkerClick}
        showProbabilityRadius={showProbabilityRadius}
        center={mapCenter}
        zoom={mapZoom}
        className={className}
        showLegend={showLegend}
      />
    );
  }

  const usePhilippinesBounds = !centerOnEvent && !center && zoom === undefined;
  const shouldFocusCamera = !!centerOnEvent || !!center || zoom !== undefined;

  return (
    <div
      ref={mapContainerRef}
      className={`${className} relative touch-none overscroll-contain overflow-hidden`}
    >
      <GoogleMap
        defaultBounds={
          usePhilippinesBounds ? { ...PH_BOUNDS, padding: 24 } : undefined
        }
        defaultCenter={usePhilippinesBounds ? undefined : mapCenter}
        defaultZoom={
          usePhilippinesBounds ? undefined : Math.max(effectiveMinZoom, mapZoom)
        }
        minZoom={effectiveMinZoom}
        restriction={PH_MAP_RESTRICTION}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl={showZoomControl}
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        mapId={mapId || GOOGLE_MAPS_MAP_ID}
        style={{ width: "100%", height: "100%" }}
      >
        <PhilippinesBoundsController
          enabled={usePhilippinesBounds}
          onMinZoomChange={setEffectiveMinZoom}
        />
        <MapViewportController
          enabled={shouldFocusCamera}
          center={mapCenter}
          zoom={mapZoom}
        />

        {radiusEvents.map((event) => (
          <ProbabilityRadius
            key={`radius-${event.id}`}
            center={{ lat: event.lat, lng: event.lng }}
            radiusKm={getEventRadiusKm(event)}
            color={likelihoodColor(event.likelihood)}
          />
        ))}

        {events.map((event) => {
          const isSelected = activeEventId === event.id;
          return (
            <AdvancedMarker
              key={event.id}
              position={{ lat: event.lat, lng: event.lng }}
              onClick={() => handleMarkerClick(event.id)}
              zIndex={isSelected ? 100 : 10}
              title={`${event.location} - magnitude ${event.magnitude}, ${event.likelihood.toLowerCase()} likelihood`}
              clickable
            >
              <PulsingDot
                color={likelihoodColor(event.likelihood)}
                size={markerScale(event.magnitude)}
                isSelected={isSelected}
              />
            </AdvancedMarker>
          );
        })}

        {infoEventId &&
          (() => {
            const event = events.find((item) => item.id === infoEventId);
            if (!event) return null;

            return (
              <InfoWindow
                position={{ lat: event.lat, lng: event.lng }}
                onCloseClick={() => {
                  setInfoEventId(null);
                  onSelectEvent?.(null);
                }}
                pixelOffset={[0, -markerScale(event.magnitude) / 2 - 4]}
              >
                <div className="min-w-[200px] p-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {event.location}
                  </p>
                  <p className="text-xs text-gray-500">{event.region}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{
                        backgroundColor: likelihoodColor(event.likelihood),
                      }}
                    >
                      {event.magnitude}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.depth} km depth
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">
                      {event.date}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span
                      className="inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                      style={{
                        backgroundColor: likelihoodColor(event.likelihood),
                      }}
                    >
                      {event.likelihood}
                    </span>
                  </div>
                  <Link
                    href={`/events/${event.id}`}
                    className="mt-3 block w-full rounded px-3 py-1.5 text-center text-xs font-semibold text-white"
                    style={{ backgroundColor: "#023e8a" }}
                  >
                    View Full Details
                  </Link>
                </div>
              </InfoWindow>
            );
          })()}
      </GoogleMap>
      {showLegend && (
        <div className="pointer-events-none absolute inset-0 z-[80]">
          <MapLegend />
        </div>
      )}
    </div>
  );
}

function useIsMobileViewport(enabled: boolean) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, [enabled]);

  return enabled && isMobile;
}

function useMapGestureGuards(mapRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    const preventBrowserZoom = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;

      event.preventDefault();
    };

    const preventPagePinchZoom = (event: TouchEvent) => {
      if (event.touches.length < 2) return;

      event.preventDefault();
    };

    mapElement.addEventListener("wheel", preventBrowserZoom, {
      passive: false,
    });
    mapElement.addEventListener("touchmove", preventPagePinchZoom, {
      passive: false,
    });

    return () => {
      mapElement.removeEventListener("wheel", preventBrowserZoom);
      mapElement.removeEventListener("touchmove", preventPagePinchZoom);
    };
  }, [mapRef]);
}

function getPointerDistance(
  firstPointer: { x: number; y: number },
  secondPointer: { x: number; y: number }
) {
  return Math.hypot(
    firstPointer.x - secondPointer.x,
    firstPointer.y - secondPointer.y
  );
}

function getDefaultRadius(magnitude: number): number {
  if (magnitude >= 7) return 80;
  if (magnitude >= 6) return 55;
  if (magnitude >= 5) return 35;
  if (magnitude >= 4) return 20;
  return 10;
}
