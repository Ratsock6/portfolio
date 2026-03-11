import express from "express";
import { getDBDData } from "../services/dbd.service.js";

const router = express.Router();

router.get("/", (_req, res) => res.json(getDBDData()));

export default router;