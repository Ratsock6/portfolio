import { config } from "../../config.js";
import { updateChessCache } from "../../services/chess.service.js";

export function chessJob() {
  const minutes = config.chess.refreshMinutes;
  const ms = Math.max(1, minutes) * 60 * 1000;

  return {
    start() {
      updateChessCache(config.chess.username);
      setInterval(() => updateChessCache(config.chess.username), ms);
      console.log(`🕒 Chess scheduler every ${minutes} min`);
    },
  };
}