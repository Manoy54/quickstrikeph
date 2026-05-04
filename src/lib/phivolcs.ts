import https from "node:https";
import type { EqEvent } from "@/components/EarthquakeMap";
import { getLikelihood } from "@/lib/aftershock";

const PHIVOLCS_LATEST_URL = "https://tsunami.phivolcs.dost.gov.ph/EQLatest.html";
const PHIVOLCS_TIME_ZONE_OFFSET_MS = 8 * 60 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

export interface PhivolcsEvent extends EqEvent {
  latitude: number;
  longitude: number;
  sourceUrl: string;
}

export async function getRecentPhivolcsEvents(): Promise<PhivolcsEvent[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);

  try {
    const html = await fetchPhivolcsHtml(controller.signal);
    return parsePhivolcsLatestHtml(html, Date.now());
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchPhivolcsHtml(signal: AbortSignal) {
  try {
    const response = await fetch(PHIVOLCS_LATEST_URL, {
      cache: "no-store",
      signal,
      headers: {
        "user-agent": "QuickStrikePH academic prototype",
      },
    });

    if (!response.ok) {
      throw new Error(`PHIVOLCS request failed with ${response.status}`);
    }

    return response.text();
  } catch {
    return fetchPhivolcsHtmlWithNodeHttps(signal);
  }
}

function fetchPhivolcsHtmlWithNodeHttps(signal: AbortSignal) {
  return new Promise<string>((resolve, reject) => {
    const request = https.get(
      PHIVOLCS_LATEST_URL,
      {
        headers: {
          "user-agent": "QuickStrikePH academic prototype",
        },
        rejectUnauthorized: false,
      },
      (response) => {
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`PHIVOLCS request failed with ${response.statusCode}`));
          return;
        }

        response.setEncoding("utf8");

        let html = "";
        response.on("data", (chunk: string) => {
          html += chunk;
        });
        response.on("end", () => resolve(html));
      }
    );

    request.on("error", reject);
    signal.addEventListener(
      "abort",
      () => {
        request.destroy(new Error("PHIVOLCS request timed out"));
      },
      { once: true }
    );
  });
}

export async function getPhivolcsEventById(id: string) {
  const events = await getRecentPhivolcsEvents();
  return events.find((event) => event.id === id) ?? null;
}

export function parsePhivolcsLatestHtml(html: string, nowMs = Date.now()) {
  const cells = Array.from(html.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)).map(
    ([, cell]) => normalizeCell(cell)
  );
  const eventsById = new Map<string, PhivolcsEvent>();

  for (let index = 0; index <= cells.length - 6; index += 1) {
    const event = parsePhivolcsCells(cells.slice(index, index + 6), nowMs);

    if (event) {
      eventsById.set(event.id, event);
      index += 5;
    }
  }

  return Array.from(eventsById.values()).sort((a, b) => b.id.localeCompare(a.id));
}

function parsePhivolcsCells(cells: string[], nowMs: number): PhivolcsEvent | null {
  const [dateTimeText, latText, lngText, depthText, magnitudeText, locationText] =
    cells;
  const eventTimeMs = parsePhivolcsDateTime(dateTimeText);
  if (eventTimeMs === null || nowMs - eventTimeMs > ONE_DAY_MS || eventTimeMs > nowMs + 60_000) {
    return null;
  }

  const latitude = Number(latText);
  const longitude = Number(lngText);
  const depth = Number(depthText);
  const magnitude = Number(magnitudeText);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(depth) ||
    !Number.isFinite(magnitude)
  ) {
    return null;
  }

  const date = formatPhilippineDateTime(eventTimeMs);
  const location = locationText || "Philippine Area of Responsibility";
  const id = makeEventId(eventTimeMs, latitude, longitude, magnitude);

  return {
    id,
    location,
    region: extractRegion(location),
    magnitude,
    depth,
    date,
    likelihood: getLikelihood(magnitude),
    lat: latitude,
    lng: longitude,
    latitude,
    longitude,
    sourceUrl: PHIVOLCS_LATEST_URL,
  };
}

function parsePhivolcsDateTime(value: string) {
  const match = value.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );
  if (!match) return null;

  const [, dayText, monthText, yearText, hourText, minuteText, meridiemText] =
    match;
  const month = MONTHS[monthText.toLowerCase()];
  if (month === undefined) return null;

  let hour = Number(hourText);
  if (meridiemText.toUpperCase() === "PM" && hour !== 12) hour += 12;
  if (meridiemText.toUpperCase() === "AM" && hour === 12) hour = 0;

  const localUtcEquivalent = Date.UTC(
    Number(yearText),
    month,
    Number(dayText),
    hour,
    Number(minuteText)
  );

  return localUtcEquivalent - PHIVOLCS_TIME_ZONE_OFFSET_MS;
}

function formatPhilippineDateTime(timeMs: number) {
  const date = new Date(timeMs + PHIVOLCS_TIME_ZONE_OFFSET_MS);
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hour = pad(date.getUTCHours());
  const minute = pad(date.getUTCMinutes());

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function makeEventId(timeMs: number, latitude: number, longitude: number, magnitude: number) {
  const timestamp = formatPhilippineDateTime(timeMs).replace(/\D/g, "");
  const lat = coordinateKey(latitude);
  const lng = coordinateKey(longitude);
  const mag = Math.round(magnitude * 10);

  return `phivolcs-${timestamp}-${lat}-${lng}-m${mag}`;
}

function coordinateKey(value: number) {
  return String(Math.round(value * 100)).replace("-", "n");
}

function extractRegion(location: string) {
  const match = location.match(/\(([^)]+)\)\s*$/);
  return match?.[1] ?? "Philippines";
}

function normalizeCell(value: string) {
  return decodeHtmlEntities(stripTags(value)).replace(/\s+/g, " ").trim();
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&deg;/gi, "deg")
    .replace(/&#176;/gi, "deg")
    .replace(/&ndash;/gi, "-")
    .replace(/&mdash;/gi, "-");
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}
