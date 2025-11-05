import express from "express";
import * as ctrl from "../controllers/questionSet.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/v1/question-sets (인증 필요)
router.get("/", ensureAuth, ctrl.list);

// GET /api/v1/question-sets/:setId/questions (세트 질문 조회 - 인증 필요하면 ensureAuth 유지)
router.get("/:setId/questions", ensureAuth, ctrl.listQuestions);

export default router;