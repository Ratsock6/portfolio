import { readJson, writeJson } from "../cache/cacheStore.js";

const FILE = "clash-arenas-registry.json";
const DEFAULT = { updatedAt: null, arenas: {} }; 

export function loadArenaRegistry() {
  return readJson(FILE, DEFAULT);
}

export function upsertArena(arena) {
  if (!arena?.id) return;

  const reg = loadArenaRegistry();
  const id = Number(arena.id);
  const now = new Date().toISOString();

  const existing = reg.arenas[id] ?? null;

  reg.arenas[id] = {
    id,
    name: arena.name ?? existing?.name ?? null,
    rawName: arena.rawName ?? existing?.rawName ?? null,
    firstSeenAt: existing?.firstSeenAt ?? now,
    lastSeenAt: now,
  };

  reg.updatedAt = now;
  writeJson(FILE, reg);
}

export function getArenaRegistry() {
  return loadArenaRegistry();
}