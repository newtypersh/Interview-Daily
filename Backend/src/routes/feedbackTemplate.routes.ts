import express from 'express';
import * as ctrl from "../controllers/feedbackTemplate.controller.js";
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/feedback-templates
router.get('/', ensureAuth, 
    /* 
        #swagger.tags = ['FeedbackTemplate']
        #swagger.summary = '피드백 템플릿 전체 조회'
        #swagger.description = '모든 카테고리의 피드백 템플릿 목록을 조회합니다.'
        #swagger.responses[200] = {
            description: '조회 성공',
            schema: {
                resultType: "SUCCESS",
                success: [
                    { id: 1, category: "CS", content: "..." }
                ]
            }
        }
    */
    ctrl.getFeedbackTemplates
);


// GET /api/feedback-templates/:category
router.get('/:category', ensureAuth, 
    /* 
        #swagger.tags = ['FeedbackTemplate']
        #swagger.summary = '카테고리별 템플릿 조회'
        #swagger.parameters['category'] = {
            in: 'path',
            description: '조회할 템플릿 카테고리 (예: CS, BE, FE)',
            required: true
        }
        #swagger.responses[200] = {
            description: '조회 성공'
        }
    */
    ctrl.getFeedbackTemplatesByCategory
);


// PATCH /api/feedback-templates/:category
router.patch('/:category', ensureAuth, 
    /* 
        #swagger.tags = ['FeedbackTemplate']
        #swagger.summary = '피드백 템플릿 수정'
        #swagger.description = '특정 카테고리의 피드백 템플릿 내용을 수정합니다.'
        #swagger.parameters['category'] = {
            in: 'path',
            description: '수정할 템플릿 카테고리',
            required: true
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '수정할 템플릿 데이터',
            required: true,
            schema: {
                content: "수정된 템플릿 내용입니다."
            }
        }
        #swagger.responses[200] = {
            description: '수정 성공'
        }
    */
    ctrl.updateFeedbackTemplate
);


export default router;