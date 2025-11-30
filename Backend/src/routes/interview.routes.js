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

// POST /api/interviews/:interviewId/feedbacks
router.post("/:interviewId/feedbacks", ensureAuth, ctrl.postFeedbacksForInterview);

// POST /api/interviews/:interviewId/answers/:answerId/audio
router.post("/:interviewId/answers/:answerId/audio", ensureAuth, audioUploader.single("file"), ctrl.uploadAnswerAudio);

// POST /api/interviews/:interviewId/complete   
router.post("/:interviewId/complete", ensureAuth, ctrl.completeInterview);

export default router;