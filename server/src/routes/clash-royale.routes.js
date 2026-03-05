import express from "express";
import { getClashRoyaleData } from "../services/clash-royale.service.js";
import { getArenaRegistry } from "../cache/arenaRegistry.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(getClashRoyaleData());
});

router.get("/arenas-registry", (_req, res) => {
  res.json(getArenaRegistry());
});

export default router;