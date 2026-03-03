import { config } from "./config.js";
import { createApp } from "./app.js";
import { startScheduler } from "./scheduler/scheduler.js";
import { chessJob } from "./scheduler/jobs/chess.job.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(`✅ Backend running on http://localhost:${config.port}`);
  startScheduler([chessJob()]);
});