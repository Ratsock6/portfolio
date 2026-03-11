import express from "express";
import cors from "cors";
import chessRoutes from "./routes/chess.routes.js";
import f1Routes from "./routes/f1.routes.js";
import valorantRoutes from "./routes/valorant.routes.js";
import clashRoyaleRoutes from "./routes/clash-royale.routes.js";
import dbdRoutes from "./routes/dbd.routes.js";
import cocRoutes from "./routes/coc.routes.js";
import _42Routes from "./routes/42api.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/chess", chessRoutes);
  app.use("/api/f1", f1Routes);
  app.use("/api/valorant", valorantRoutes);
  app.use("/api/clash-royale", clashRoyaleRoutes);
  app.use("/api/coc", cocRoutes);
  
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/dbd", dbdRoutes);

  app.use("/api/42", _42Routes);

  return app;
}