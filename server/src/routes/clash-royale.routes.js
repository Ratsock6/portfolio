import express from "express";
import { getClashRoyaleData } from "../services/clash-royale.service.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(getClashRoyaleData());
});

export default router;