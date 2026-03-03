import { readJson, writeJson } from "../cache/cacheStore.js";

const CACHE_FILE = "chess-cache.json";
const DEFAULT = {
  updatedAt: null,
  stats: null,
  games: [],
  _archives: [],
  etag: { stats: null, archives: null, games: {} },
  lastModified: { stats: null, archives: null, games: {} },
};

let cache = readJson(CACHE_FILE, DEFAULT);
let isUpdating = false;

function headers(etag, lastModified) {
  const h = {
    "User-Agent": "antoine-portfolio/1.0",
    Accept: "application/json",
  };
  if (etag) h["If-None-Match"] = etag;
  if (lastModified) h["If-Modified-Since"] = lastModified;
  return h;
}

async function fetchJson(url, scopeKey) {
  const etag =
    scopeKey === "stats"
      ? cache.etag.stats
      : scopeKey === "archives"
      ? cache.etag.archives
      : cache.etag.games[scopeKey];

  const lastModified =
    scopeKey === "stats"
      ? cache.lastModified.stats
      : scopeKey === "archives"
      ? cache.lastModified.archives
      : cache.lastModified.games[scopeKey];

  const res = await fetch(url, { headers: headers(etag, lastModified) });

  if (res.status === 304) return { data: null, notModified: true };

  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);

  const newEtag = res.headers.get("etag");
  const newLast = res.headers.get("last-modified");
  const data = await res.json();

  if (scopeKey === "stats") {
    if (newEtag) cache.etag.stats = newEtag;
    if (newLast) cache.lastModified.stats = newLast;
  } else if (scopeKey === "archives") {
    if (newEtag) cache.etag.archives = newEtag;
    if (newLast) cache.lastModified.archives = newLast;
  } else {
    if (newEtag) cache.etag.games[scopeKey] = newEtag;
    if (newLast) cache.lastModified.games[scopeKey] = newLast;
  }

  return { data, notModified: false };
}

export function getChessSummary(username) {
  const s = cache.stats ?? {};
  const getRating = (obj) => obj?.last?.rating ?? null;

  return {
    username,
    updatedAt: cache.updatedAt,
    ratings: {
      bullet: getRating(s.chess_bullet),
      blitz: getRating(s.chess_blitz),
      rapid: getRating(s.chess_rapid),
      daily: getRating(s.chess_daily),
    },
  };
}

export function getChessGames(limit = 10) {
  return {
    updatedAt: cache.updatedAt,
    games: (cache.games ?? []).slice(0, Math.min(limit, 50)),
  };
}

export async function updateChessCache(username) {
  if (isUpdating) return;
  isUpdating = true;

  try {
    const statsUrl = `https://api.chess.com/pub/player/${username}/stats`;
    const archivesUrl = `https://api.chess.com/pub/player/${username}/games/archives`;

    const statsRes = await fetchJson(statsUrl, "stats");
    if (statsRes.data) cache.stats = statsRes.data;

    const archivesRes = await fetchJson(archivesUrl, "archives");
    if (archivesRes.data?.archives) cache._archives = archivesRes.data.archives;

    const wanted = 10;
    const games = [];
    const archiveUrls = cache._archives ?? [];

    for (let i = archiveUrls.length - 1; i >= 0 && games.length < wanted; i--) {
      const archive = archiveUrls[i];
      const monthRes = await fetchJson(archive, archive);
      const monthGames = monthRes.data?.games ?? null;
      if (!monthGames) continue;

      monthGames.sort((a, b) => (b.end_time ?? 0) - (a.end_time ?? 0));
      for (const g of monthGames) {
        games.push(g);
        if (games.length >= wanted) break;
      }
    }

    cache.games = games.slice(0, wanted).map((g) => ({
      url: g.url,
      time_control: g.time_control,
      time_class: g.time_class ?? null,
      end_time: g.end_time,
      rated: g.rated,
      rules: g.rules,
      white: g.white,
      black: g.black,
    }));

    cache.updatedAt = new Date().toISOString();
    writeJson(CACHE_FILE, cache);
    console.log(`✅ Chess cache updated at ${cache.updatedAt}`);
  } catch (e) {
    console.error("❌ Chess update failed:", e.message);
  } finally {
    isUpdating = false;
  }
}