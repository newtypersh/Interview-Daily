import express from "express";
import * as ctrl from "../controllers/questionSet.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/question-sets (인증 필요)
router.get("/", ensureAuth, ctrl.list);

// POST /api/question-sets (질문세트 생성 - 인증 필요)
router.post("/", ensureAuth, ctrl.create);

// POST /api/question-sets/:setId/questions
router.post("/:setId/questions", ensureAuth, ctrl.createQuestion);

// GET /api/question-sets/:setId/questions (세트 질문 조회 - 인증 필요하면 ensureAuth 유지)
router.get("/:setId/questions", ensureAuth, ctrl.listQuestions);

export default router;