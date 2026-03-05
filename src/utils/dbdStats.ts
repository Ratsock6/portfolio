import { dbdStatMeta } from "../data/dbdStatMeta";

export function getDbdMeta(key: string) {
  return dbdStatMeta[key] ?? null;
}

export function getDbdCategory(key: string): DbdCategory {
  return getDbdMeta(key)?.category ?? "other";
}

export function getDbdLabel(key: string): string {
  return getDbdMeta(key)?.label ?? key;
}

export function isNoiseStat(key: string) {
  // On considère comme "bruit" les stats trop spécifiques
  return (
    key.startsWith("DBD_Chapter") ||
    key.startsWith("DBD_DLC") ||
    key.startsWith("DBD_Event") ||
    key.startsWith("DBD_FixSecondFloorGenerator") ||
    key.startsWith("DBD_FinishWithPerks_Idx") ||
    key.startsWith("DBD_PerksCount_Idx") ||
    key.includes("_Map")
  );
}

export function sortByMeta(aKey: string, bKey: string) {
  const ao = getDbdMeta(aKey)?.order ?? 999;
  const bo = getDbdMeta(bKey)?.order ?? 999;
  if (ao !== bo) return ao - bo;
  return aKey.localeCompare(bKey);
}