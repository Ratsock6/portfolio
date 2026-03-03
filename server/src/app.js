import express from "express";
import cors from "cors";
import chessRoutes from "./routes/chess.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/chess", chessRoutes);

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  return app;
}