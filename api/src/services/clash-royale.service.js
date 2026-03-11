import { config } from "../config.js";
import { readJson, writeJson } from "../cache/cacheStore.js";
import { match } from "assert";
import { upsertArena } from "../cache/arenaRegistry.js";


const CACHE_FILE = "clashRoyale-cache.json";
const DEFAULT = { updatedAt: null, profile: null };
let cache = readJson(CACHE_FILE, DEFAULT);

let isUpdating = false;

function apiFetch(url) {
  const key = config.clashRoyale.apiKey;
  if (!key) throw new Error("apiKey manquant");
  return fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${key}`,
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

export function getClashRoyaleData() {
  return cache;
}

export async function updateClashRoyaleCache() {
  if (isUpdating) return;
  isUpdating = true;

  try {
    const tag  = config.clashRoyale.tag;
    if (!tag) throw new Error("CR_TAG manquant");

    // Get profile
    const profileURL = `https://api.clashroyale.com/v1/players/%23${tag}`;
    const profileRes = await apiFetch(profileURL);
    const profileData = await fetchJson(profileRes, profileURL);

    const profile = {
      name: profileData.name,
      tag: `#${tag}`,
      expLevel: profileData.expLevel, 
      trophies: profileData.trophies,
      bestTrophies: profileData.bestTrophies,
      wins: profileData.wins,
      losses: profileData.losses,
      battleCount: profileData.battleCount,
      threeCrownWins: profileData.threeCrownWins,
      totalDonations: profileData.totalDonations,
      clan: profileData.clan,
      arena: profileData.arena,
    };

    // Gat match history
    const battlesURL = `https://api.clashroyale.com/v1/players/%23${tag}/battlelog`;
    const battlesRes = await apiFetch(battlesURL);
    const battlesData = await fetchJson(battlesRes, battlesURL);

    const matches = (battlesData ?? [])
        .map((m) => ({
            type: m.type ?? null,
            startedAt: m.battleTime ?? null,
            arenaName: m.arena?.name ?? null,
            team: m.team?.map((p) => ({
            name: p.name ?? null,
            tag: p.tag ? `#${p.tag}` : null,
            cards: (p.cards ?? []).map((c, index) => ({
                index,
                name: c?.name ?? null,
                id: c?.id ?? null,
                level: c?.level ?? null,
                maxLevel: c?.maxLevel ?? null,
                rarity: c?.rarity ?? null,
                elixirCost: c?.elixirCost ?? null,
                evolutionLevel: c?.evolutionLevel ?? -1,
                iconUrls: { ...(c?.iconUrls ?? {}) },
            })),
            trophyChange: p.trophyChange ?? null,
            startingTrophies: p.startingTrophies ?? null,
            crowns: p.crowns ?? null,
            elixirLeaked: p.elixirLeaked ?? null,
            })) ?? [],
            opponent: m.opponent?.map((p) => ({
            name: p.name ?? null,
            tag: p.tag ? `#${p.tag}` : null,
            cards: (p.cards ?? []).map((c, index) => ({
                index,
                name: c?.name ?? null,
                id: c?.id ?? null,
                level: c?.level ?? null,
                maxLevel: c?.maxLevel ?? null,
                rarity: c?.rarity ?? null,
                elixirCost: c?.elixirCost ?? null,
                evolutionLevel: c?.evolutionLevel ?? -1,
                iconUrls: { ...(c?.iconUrls ?? {}) },
            })),
            trophyChange: p.trophyChange ?? null,
            startingTrophies: p.startingTrophies ?? null,
            crowns: p.crowns ?? null,
            })) ?? [],
        }));


    upsertArena(profile?.arena);

    cache = {
      updatedAt: new Date().toISOString(),
      profile,
      matches,
    };

    writeJson(CACHE_FILE, cache);
    console.log(`✅ Clash Royale cache updated at ${cache.updatedAt}`);
  } catch (e) {
    console.error("❌ Clash Royale update failed:", e.message);
  } finally {
    isUpdating = false;
  }
}