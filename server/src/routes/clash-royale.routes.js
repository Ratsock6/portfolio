import { getClashRoyaleData } from "../services/clash-royale.service.js";
import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(getClashRoyaleData());
});

export default router;