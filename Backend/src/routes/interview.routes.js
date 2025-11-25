import express from "express";
import * as ctrl from "../controllers/interview.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { audioUploader } from "../middleware/audioUploader.js";

const router = express.Router();

// POST /api/interviews/start
router.post("/start", ensureAuth, ctrl.startInterview);

// GET /api/interviews/:interviewId/
router.get("/:interviewId/", ensureAuth, ctrl.getInterview);

// GET /api/interviews/:interviewId/answers
router.get("/:interviewId/answers", ensureAuth, ctrl.getInterviewAnswers);

// GET /api/interviews/:interviewId/feedback-templates
router.get("/:interviewId/feedback-templates", ensureAuth, ctrl.getInterviewFeedbackTemplates);

// POST /api/interviews/:interviewId/feedbacks
router.post("/:interviewId/feedbacks", ensureAuth, ctrl.postFeedbacksForInterview);

// POST /api/interviews/:interviewId/answers/:answerId/audio
router.post("/:interviewId/answers/:answerId/audio", ensureAuth, audioUploader.single("file"), ctrl.uploadAnswerAudio);

export default router;