import { config } from "../config.js";

function requireSteam() {
  if (!config.steam.apiKey) throw new Error("STEAM_API_KEY manquant");
  if (!config.steam.steamId) throw new Error("STEAM_ID manquant");
}

async function steamFetch(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "antoine-portfolio/1.0" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Steam API ${res.status}: ${text} (${url})`);
  }
  return res.json();
}

export async function getPlayerSummaries() {
  requireSteam();
  const url =
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/` +
    `?key=${encodeURIComponent(config.steam.apiKey)}` +
    `&steamids=${encodeURIComponent(config.steam.steamId)}`;
  const json = await steamFetch(url);
  return json?.response?.players?.[0] ?? null;
}

export async function getOwnedGames() {
  requireSteam();
  const url =
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/` +
    `?key=${encodeURIComponent(config.steam.apiKey)}` +
    `&steamid=${encodeURIComponent(config.steam.steamId)}` +
    `&include_appinfo=1&include_played_free_games=1`;
  return steamFetch(url);
}

export async function getUserStatsForGame(appId) {
  requireSteam();
  const url =
    `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/` +
    `?key=${encodeURIComponent(config.steam.apiKey)}` +
    `&steamid=${encodeURIComponent(config.steam.steamId)}` +
    `&appid=${encodeURIComponent(appId)}`;
  return steamFetch(url);
}

export async function getSchemaForGame(appId) {
  requireSteam();
  const url =
    `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/` +
    `?key=${encodeURIComponent(config.steam.apiKey)}` +
    `&appid=${encodeURIComponent(appId)}`;
  return steamFetch(url);
}

export async function getPlayerAchievements(appId) {
  requireSteam();
  const url =
    `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/` +
    `?key=${encodeURIComponent(config.steam.apiKey)}` +
    `&steamid=${encodeURIComponent(config.steam.steamId)}` +
    `&appid=${encodeURIComponent(appId)}`;
  return steamFetch(url);
}