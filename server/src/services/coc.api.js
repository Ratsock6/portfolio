import { config } from "../config.js";

const BASE = "https://api.clashofclans.com/v1";

function requireCOC() {
  if (!config.coc?.apiToken) throw new Error("COC_API_TOKEN manquant");
}

function encodeTag(tag) {
  // "#PP9YQ0PU9" -> "%23PP9YQ0PU9"
  const t = String(tag ?? "").trim();
  if (!t) return "";
  return encodeURIComponent(t.startsWith("#") ? t : `#${t}`);
}

async function cocFetch(path) {
  requireCOC();

  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${config.coc.apiToken}`,
      "User-Agent": "antoine-portfolio/1.0",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`COC API ${res.status} ${path}: ${text || "{}"}`);
  }
  return res.json();
}

export async function getCOCPlayer(playerTag) {
  const tag = encodeTag(playerTag);
  return cocFetch(`/players/${tag}`);
}

export async function getCOCBattlelog(playerTag) {
  const tag = encodeTag(playerTag);
  return cocFetch(`/players/${tag}/battlelog`);
}