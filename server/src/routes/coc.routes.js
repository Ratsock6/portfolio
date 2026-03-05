import express from "express";
import { getCOCData } from "../services/coc.service.js";

const router = express.Router();

// GET /api/coc
router.get("/", (_req, res) => {
  res.json(getCOCData());
});

export default router;