import { config } from "../../config.js";
import { update42apiCache } from "../../services/42api.service.js";

export function _42Job() {
  const minutes = config._42.refreshMinutes;
  const ms = Math.max(1, minutes) * 60 * 1000;

  return {
    start() {
      update42apiCache();
      setInterval(update42apiCache, ms);
      console.log(`🕒 42API scheduler every ${minutes} min`);
    },
  };
}