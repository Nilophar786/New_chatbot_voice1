import express from "express";
import { processMultilingualCommand } from "../controllers/multilingual.controllers.js";

const router = express.Router();

// POST /api/multilingual/reply - Process multilingual voice commands
router.post("/reply", processMultilingualCommand);

export default router;
