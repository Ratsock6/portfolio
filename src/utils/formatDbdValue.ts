import { getDbdMeta } from "./dbdStats";

export function formatDbdValue(key: string, value: number) {
  const meta = getDbdMeta(key);
  const fmt = meta?.format ?? "int";

  if (!Number.isFinite(value)) return "—";

  if (fmt === "floatPct") {
    // tes valeurs float sont souvent énormes, on arrondit bien
    // (tu peux ajuster si tu veux une vraie interprétation)
    return value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  }

  if (fmt === "bloodpoints") {
    const v = Math.round(value);
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 10_000) return `${(v / 1_000).toFixed(1)}k`;
    return v.toLocaleString("fr-FR");
  }

  // int par défaut
  return Math.round(value).toLocaleString("fr-FR");
}