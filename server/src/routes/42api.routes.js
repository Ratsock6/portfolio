import express from "express";
import { get42Data } from "../services/42api.service.js";

const router = express.Router();

router.get("/", (_req, res) => res.json(get42Data()));

export default router;