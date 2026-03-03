export function startScheduler(jobs) {
  for (const job of jobs) {
    job.start();
  }
}