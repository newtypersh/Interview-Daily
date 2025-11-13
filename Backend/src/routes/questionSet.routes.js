import express from "express";
import * as ctrl from "../controllers/questionSet.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/question-sets (인증 필요)
router.get("/", ensureAuth, ctrl.list);

// GET /api/question-sets/:setId/questions (세트 질문 조회 - 인증 필요하면 ensureAuth 유지)
router.get("/:setId/questions", ensureAuth, ctrl.listQuestions);

// POST /api/question-sets (질문세트 생성 - 인증 필요)
router.post("/", ensureAuth, ctrl.create);

// POST /api/question-sets/:setId/questions
router.post("/:setId/questions", ensureAuth, ctrl.createQuestion);

// PATCH /api/question-sets/:setId (질문세트 수정)
router.patch("/:setId", ensureAuth, ctrl.updateQuestionSet);

// DELETE /api/question-sets/:setId (질문세트 삭제)
router.delete("/:setId", ensureAuth, ctrl.deleteQuestionSet);

// DELETE /api/question-sets/:setId/questions/:questionId (질문 삭제)
router.delete("/:setId/questions/:questionId", ensureAuth, ctrl.deleteQuestion);



export default router;