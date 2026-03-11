import { config } from "../../config.js";
import { updateCOCCache } from "../../services/coc.service.js";

export function cocJob() {
  const minutes = Number(config.coc?.refreshMinutes ?? 30);
  const ms = Math.max(1, minutes) * 60 * 1000;

  return {
    start() {
      updateCOCCache();
      setInterval(updateCOCCache, ms);
      console.log(`🕒 COC scheduler every ${minutes} min`);
    },
  };
}