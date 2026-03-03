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
};