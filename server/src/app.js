import express from "express";
import cors from "cors";
import chessRoutes from "./routes/chess.routes.js";
import f1Routes from "./routes/f1.routes.js";
import valorantRoutes from "./routes/valorant.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/chess", chessRoutes);
  app.use("/api/f1", f1Routes);
  app.use("/api/valorant", valorantRoutes);
  

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  return app;
}