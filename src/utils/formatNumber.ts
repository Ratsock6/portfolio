export function formatNumber(n: unknown) {
  const x = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(x)) return "—";

  const abs = Math.abs(x);

  // Abréviations lisibles
  if (abs >= 1_000_000_000) return `${(x / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(x / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(x / 1_000).toFixed(1)}k`;

  // Sinon format FR classique
  return x.toLocaleString("fr-FR");
}