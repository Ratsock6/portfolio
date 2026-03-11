import { readJson, writeJson } from "../cache/cacheStore.js";
import { config } from "../config.js";

const CACHE_FILE = "valorant-cache.json";
const DEFAULT = { updatedAt: null, profile: null, matches: [], favorites: null };
let cache = readJson(CACHE_FILE, DEFAULT);

let isUpdating = false;

function henrikFetch(url) {
  const key = config.valorant.henrikApiKey;
  if (!key) throw new Error("HENRIK_API_KEY manquant");
  return fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: key,
      "User-Agent": "antoine-portfolio/1.0",
    },
  });
}

async function fetchJson(res, url) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${url} ${text}`);
  }
  return res.json();
}

export function getValorantData() {
  return cache;
}

export async function updateValorantCache() {
  if (isUpdating) return;
  isUpdating = true;

  try {
    const { region, name, tag } = config.valorant;
    if (!name || !tag) throw new Error("VAL_NAME/VAL_TAG manquant");

    // Rank + RR (MMR)
    // Docs HenrikDev: /valorant/v2/mmr/{region}/{name}/{tag} :contentReference[oaicite:4]{index=4}
    const mmrUrl = `https://api.henrikdev.xyz/valorant/v2/mmr/${region}/${encodeURIComponent(
      name
    )}/${encodeURIComponent(tag)}`;
    const mmrRes = await henrikFetch(mmrUrl);
    const mmrData = await fetchJson(mmrRes, mmrUrl);

    // Match history (v3 matches) :contentReference[oaicite:5]{index=5}
    const matchesUrl = `https://api.henrikdev.xyz/valorant/v3/matches/${region}/${encodeURIComponent(
      name
    )}/${encodeURIComponent(tag)}`;
    const matchesRes = await henrikFetch(matchesUrl);
    const matchesData = await fetchJson(matchesRes, matchesUrl);

    // Normalisation (backend -> format stable)
    const profile = {
      name,
      tag,
      region,
      rank: mmrData?.data?.current_data?.currenttierpatched ?? null,
      rr: mmrData?.data?.current_data?.ranking_in_tier ?? null,
      mmr: mmrData?.data?.elo ?? null,
      lastUpdated: mmrData?.data?.current_data?.last_update ?? null,
    };

    const matches = (matchesData?.data ?? [])
      .slice(0, 10)
      .map((m) => ({
        matchId: m.metadata?.matchid ?? null,
        startedAt: m.metadata?.game_start_patched ?? null,
        map: m.metadata?.map ?? null,
        mode: m.metadata?.mode ?? null,
        queue: m.metadata?.queue ?? null,
        won: m.teams?.red?.has_won ?? null, // attention: à recaler côté joueur si besoin
        teams: m.teams ?? null,
        players: m.players ?? null,
        stats: m.stats ?? null,
      }));

    cache = {
      updatedAt: new Date().toISOString(),
      profile,
      matches,
      // on mettra tes "agents/maps préférés" ici plus tard (backend)
      favorites: {
        agents: ["Jett", "Omen"],
        maps: ["Ascent", "Haven"],
      },
    };

    writeJson(CACHE_FILE, cache);
    console.log(`✅ Valorant cache updated at ${cache.updatedAt}`);
  } catch (e) {
    console.error("❌ Valorant update failed:", e.message);
  } finally {
    isUpdating = false;
  }
}


export function getValorantMatchById(matchId) {
  const m = (cache.matches ?? []).find((x) => {
    const id = x?.metadata?.matchid ?? x?.matchId ?? null;
    return String(id) === String(matchId);
  });
  return m ?? null;
}