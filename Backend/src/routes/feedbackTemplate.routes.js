import express from 'express';
import * as ctrl from "../controllers/feedbackTemplate.controller.js";
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/feedback-templates
router.get('/', ensureAuth, ctrl.getFeedbackTemplates);

// GET /api/feedback-templates/:category
router.get('/:category', ensureAuth, ctrl.getFeedbackTemplatesByCategory);

// PATCH /api/feedback-templates/:category
router.patch('/:category', ensureAuth, ctrl.updateFeedbackTemplate);

export default router;