import express from 'express';
import * as ctrl from "../controllers/feedbackTemplate.controller.js";
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/feedback-templates
router.get('/feedback-templates', ensureAuth, ctrl.getFeedbackTemplates);

// PATCH /api/feedback-templates/:templateId
router.patch('/feedback-templates/:templateId', ensureAuth, ctrl.updateFeedbackTemplate);

export default router;