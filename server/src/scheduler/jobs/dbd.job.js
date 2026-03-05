import { config } from "../../config.js";
import { updateDBDCache } from "../../services/dbd.service.js";

export function dbdJob() {
  const minutes = config.steam.refreshMinutes;
  const ms = Math.max(1, minutes) * 60 * 1000;

  return {
    start() {
      updateDBDCache();
      setInterval(updateDBDCache, ms);
      console.log(`🕒 DBD scheduler every ${minutes} min`);
    },
  };
}