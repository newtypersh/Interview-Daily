import express from "express";
import * as ctrl from "../controllers/history.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import * as schemas from "../schemas/history.schema.js";

const router = express.Router();

// GET /api/history/interviews?limit=20&cursorCreatedAt=2025-...&cursorId=123
router.get("/interviews", ensureAuth, validate(schemas.getInterviewHistorySchema), (req, res, next) => {
    /* 
        #swagger.tags = ['History']
        #swagger.summary = '면접 기록 조회 (커서 페이징)'
        #swagger.description = '사용자의 지난 면접 기록을 조회합니다. 무한 스크롤을 위한 커서 기반 페이징을 지원합니다.'
        
        #swagger.parameters['limit'] = {
            in: 'query',
            description: '한 번에 가져올 항목 수 (기본값: 20)',
            type: 'integer'
        }
        #swagger.parameters['cursorCreatedAt'] = {
            in: 'query',
            description: '페이징 커서: 마지막으로 조회된 면접의 생성일시 (ISO String)',
            type: 'string'
        }
        #swagger.parameters['cursorId'] = {
            in: 'query',
            description: '페이징 커서: 마지막으로 조회된 면접의 ID (중복 방지용)',
            type: 'integer'
        }

        #swagger.responses[200] = {
            description: '조회 성공',
            schema: {
                resultType: "SUCCESS",
                success: {
                    data: [
                        {
                            id: 1,
                            createdAt: "2023-12-01T09:00:00.000Z",
                            totalScore: 85,
                            questionCount: 5
                        }
                    ],
                    pagination: {
                        nextCursorCreatedAt: "2023-11-30T09:00:00.000Z",
                        nextCursorId: 5,
                        hasNext: true
                    }
                }
            }
        }
    */
    ctrl.getHistory(req, res, next);
});


export default router;