import { config } from "./config.js";
import { createApp } from "./app.js";
import { startScheduler } from "./scheduler/scheduler.js";
import { chessJob } from "./scheduler/jobs/chess.job.js";
import { f1Job } from "./scheduler/jobs/f1.job.js";
import { clashRoyaleJob } from "./scheduler/jobs/clash-royale.job.js";
import { valorantJob } from "./scheduler/jobs/valorant.job.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(`✅ Backend running on http://localhost:${config.port}`);
  startScheduler([chessJob(), f1Job(), valorantJob(), clashRoyaleJob()]);
});