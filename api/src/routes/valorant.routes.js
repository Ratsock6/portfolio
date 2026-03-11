import express from "express";
import { getValorantData, getValorantMatchById } from "../services/valorant.service.js";

const router = express.Router();

router.get("/", (_req, res) => res.json(getValorantData()));

router.get("/matches/:matchId", (req, res) => {
  const match = getValorantMatchById(req.params.matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });
  res.json(match);
});


export default router;