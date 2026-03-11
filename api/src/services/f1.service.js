import { readJson, writeJson } from "../cache/cacheStore.js";
import { config } from "../config.js";

const CACHE_FILE = "f1-cache.json";
const DEFAULT = { updatedAt: null, season: config.f1.season, calendar: [], standings: [] };
let cache = readJson(CACHE_FILE, DEFAULT);

const OFFICIAL_CALENDAR_URL = `https://www.formula1.com/en/racing/${config.f1.season}`;
const JOLPICA_BASE = "http://api.jolpi.ca/ergast/f1"; // docs Jolpica :contentReference[oaicite:3]{index=3}

let isUpdating = false;

// --- Helpers ---
function parseOfficialCalendarFromHtml(html) {
  // Simple & robuste: on extrait les "ROUND x" + dates + lieux présents sur la page officielle.
  // (On garde minimal: round, name, location, dateStart/dateEnd)
  // Si tu veux 100% fiable, on peut switch sur la source FIA en JSON/HTML ensuite. :contentReference[oaicite:4]{index=4}
  const items = [];
  const re = /ROUND\s+(\d+)[\s\S]*?GRAND PRIX[^<]*?(\d{2}\s-\s\d{2}\s[A-Za-z]{3})/g; // fallback grossier
  // -> Pour éviter d’être fragile: on préfère utiliser Jolpica pour le calendrier si tu veux.
  // Ici je te propose plutôt Jolpica pour le calendrier aussi (JSON), et on garde Formula1.com comme référence.
  return items;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "antoine-portfolio/1.0", Accept: "application/json" } });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return res.json();
}

// --- Data loaders (Jolpica / Ergast-compatible) ---
async function loadCalendar(season) {
  // /{season}.json => races
  const data = await fetchJson(`${JOLPICA_BASE}/${season}.json`);
  const races = data?.MRData?.RaceTable?.Races ?? [];
  return races.map((r) => ({
    round: Number(r.round),
    raceName: r.raceName,
    circuitName: r.Circuit?.circuitName,
    locality: r.Circuit?.Location?.locality,
    country: r.Circuit?.Location?.country,
    date: r.date,
    time: r.time ?? null,
  }));
}

async function loadDriverStandings(season) {
  // /{season}/driverStandings.json
  const data = await fetchJson(`${JOLPICA_BASE}/${season}/driverStandings.json`);
  const lists = data?.MRData?.StandingsTable?.StandingsLists ?? [];
  const standings = lists[0]?.DriverStandings ?? [];
  return standings.map((s) => ({
    position: Number(s.position),
    points: Number(s.points),
    wins: Number(s.wins),
    driver: {
      id: s.Driver?.driverId,
      givenName: s.Driver?.givenName,
      familyName: s.Driver?.familyName,
      code: s.Driver?.code ?? null,
      number: s.Driver?.permanentNumber ? Number(s.Driver.permanentNumber) : null,
    },
    constructor: {
      id: s.Constructors?.[0]?.constructorId ?? null,
      name: s.Constructors?.[0]?.name ?? null,
    },
  }));
}

export function getF1Data() {
  return cache;
}

export async function updateF1Cache() {
  if (isUpdating) return;
  isUpdating = true;
  try {
    const season = config.f1.season;

    const [calendar, standings] = await Promise.all([
      loadCalendar(season),
      loadDriverStandings(season),
    ]);

    cache = {
      updatedAt: new Date().toISOString(),
      season,
      calendar,
      standings,
    };

    writeJson(CACHE_FILE, cache);
    console.log(`✅ F1 cache updated at ${cache.updatedAt}`);
  } catch (e) {
    console.error("❌ F1 update failed:", e.message);
  } finally {
    isUpdating = false;
  }
}