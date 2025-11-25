import express from "express";
import * as ctrl from "../controllers/history.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/history/interviews?limit=20&cursorCreatedAt=2025-...&cursorId=123
router.get("./interviews", ensureAuth, ctrl.getInterviewHistory);

export default router;