import express from "express";
import * as ctrl from "../controllers/interview.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", ensureAuth, ctrl.startInterview);

export default router;