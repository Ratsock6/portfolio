import dotenv from "dotenv";
dotenv.config({ quiet: true });

function num(name, def) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : def;
}

export const config = {
  port: num("PORT", 4000),

  chess: {
    username: process.env.CHESS_USERNAME,
    refreshMinutes: num("CHESS_REFRESH_MINUTES", num("REFRESH_MINUTES", 10)),
  },

  f1: {
    season: Number(process.env.F1_SEASON || 2026),
    refreshMinutes: num("F1_REFRESH_MINUTES", 60),
  },

  valorant: {
    region: process.env.VAL_REGION || "eu",
    name: process.env.VAL_NAME,
    tag: process.env.VAL_TAG,
    refreshMinutes: num("VAL_REFRESH_MINUTES", 10),
    henrikApiKey: process.env.HENRIK_API_KEY,
  },

  clashRoyale: {
    tag: process.env.CR_TAG,
    apiKey: process.env.CR_API_KEY,
    refreshMinutes: num("CR_REFRESH_MINUTES", 10),
  },

  steam: {
    apiKey: process.env.STEAM_API_KEY,
    steamId: process.env.STEAM_ID,
    refreshMinutes: num("STEAM_REFRESH_MINUTES", 60),
  },

  coc: {
    apiToken: process.env.COC_API_TOKEN,
    playerTag: process.env.COC_PLAYER_TAG,
    refreshMinutes: Number(process.env.COC_REFRESH_MINUTES ?? 30),
  },

  _42: {
    secret: process.env.SECRET_KEY,
    uid: process.env.UID_KEY,
    login: process.env.LOGIN,
    refreshMinutes: num("42_REFRESH_MINUTES", 60),
  },
};