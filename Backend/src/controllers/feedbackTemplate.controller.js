import * as service from '../services/feedbackTemplate.service.js';
import { toFeedbackTemplateDto } from '../dtos/feedbackTemplate.dto.js';

// GET /api/feedback-templates
export const listFeedbackTemplates = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) return res.error({ errorCode: "unauthorized", reason: "로그인이 필요합니다." });

        const { category } = req.query ?? {};
        const allowed = ["JOB", "PERSONAL", "MOTIVATION"];
        if (category != null && !allowed.includes(String(category).toUpperCase())) {
            return res.status(400).json({ error: "invalid_category", message: `category must be one of ${allowed.join(", ")}` });
        }

        const items = await service.listFeedbackTemplates(user.id, category ? String(category).toUpperCase() : undefined);
        return res.success({ templates: items.map(toFeedbackTemplateDto) });
    } catch (error) {
        return next(error);
    }
};