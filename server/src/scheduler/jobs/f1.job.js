import { config } from "../../config.js";
import { updateF1Cache } from "../../services/f1.service.js";

export function f1Job() {
  const minutes = config.f1.refreshMinutes;
  const ms = Math.max(1, minutes) * 60 * 1000;

  return {
    start() {
      updateF1Cache();
      setInterval(updateF1Cache, ms);
      console.log(`🕒 F1 scheduler every ${minutes} min`);
    },
  };
}