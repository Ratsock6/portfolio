import express from "express";
import { getF1Data } from "../services/f1.service.js";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(getF1Data());
});

export default router;