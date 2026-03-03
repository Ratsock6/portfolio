import express from "express";
import { getValorantData } from "../services/valorant.service.js";

const router = express.Router();

router.get("/", (_req, res) => res.json(getValorantData()));

export default router;