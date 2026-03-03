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
};