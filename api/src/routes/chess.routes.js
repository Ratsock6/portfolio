import express from "express";
import { config } from "../config.js";
import { getChessGames, getChessSummary } from "../services/chess.service.js";

const router = express.Router();

router.get("/summary", (_req, res) => {
  res.json(getChessSummary(config.chess.username));
});

router.get("/games", (req, res) => {
  const limit = Number(req.query.limit || 10);
  res.json({ username: config.chess.username, ...getChessGames(limit) });
});

export default router;