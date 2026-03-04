import { config } from "../../config.js";
import { updateClashRoyaleCache } from "../../services/clash-royale.service.js";

export function clashRoyaleJob() {
  const minutes = config.clashRoyale.refreshMinutes;
  const ms = Math.max(1, minutes) * 60 * 1000;

  return {
    start() {
      updateClashRoyaleCache();
      setInterval(() => updateClashRoyaleCache(), ms);
      console.log(`🕒 ClashRoyale scheduler every ${minutes} min`);
    },
  };
}