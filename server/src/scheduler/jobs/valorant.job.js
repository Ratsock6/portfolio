import { config } from "../../config.js";
import { updateValorantCache } from "../../services/valorant.service.js";

export function valorantJob() {
  const minutes = config.valorant.refreshMinutes;
  const ms = Math.max(1, minutes) * 60 * 1000;

  return {
    start() {
      updateValorantCache();
      setInterval(updateValorantCache, ms);
      console.log(`🕒 Valorant scheduler every ${minutes} min`);
    },
  };
}