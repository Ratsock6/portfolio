import { readJson, writeJson } from "../cache/cacheStore.js";
import { config } from "../config.js";
import { getCOCPlayer, getCOCBattlelog } from "./coc.api.js";

const CACHE_FILE = "coc-cache.json";

const DEFAULT = {
  updatedAt: null,
  playerTag: null,
  profile: null,
  battlelog: { items: [] },
};

let cache = readJson(CACHE_FILE, DEFAULT);
let isUpdating = false;

export function getCOCData() {
  return cache;
}

export async function updateCOCCache() {
  if (isUpdating) return;
  isUpdating = true;

  try {
    const playerTag = config.coc?.playerTag;
    if (!config.coc?.apiToken) throw new Error("COC_API_TOKEN manquant");
    if (!playerTag) throw new Error("COC_PLAYER_TAG manquant");

    const [profile, battlelog] = await Promise.all([
      getCOCPlayer(playerTag),
      getCOCBattlelog(playerTag),
    ]);

    cache = {
      updatedAt: new Date().toISOString(),
      playerTag,
      profile,
      battlelog: battlelog ?? { items: [] },
    };

    writeJson(CACHE_FILE, cache);
    console.log(`✅ COC cache updated at ${cache.updatedAt}`);
  } catch (e) {
    console.error("❌ COC update failed:", e.message);
  } finally {
    isUpdating = false;
  }
}