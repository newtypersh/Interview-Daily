import express from 'express';
import { ensureAuth } from '../middleware/authMiddleware.js';
import * as ctrl from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', ensureAuth, (req, res, next) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = '내 정보 조회'
    #swagger.description = '현재 로그인된 사용자의 정보를 반환합니다. (세션 쿠키 필요)'
    
    #swagger.responses[200] = {
        description: '조회 성공',
        schema: {
            resultType: "SUCCESS",
            error: null,
            success: {
                id: "1",
                email: "user@example.com",
                name: "이름",
            }
        }
    }
    #swagger.responses[401] = {
        description: '로그인하지 않음 (세션 만료)'
    }
    */ 
    ctrl.getMyInfo(req, res, next)
});

export default router;