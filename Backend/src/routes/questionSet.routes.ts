import express from "express";
import * as ctrl from "../controllers/questionSet.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import * as schemas from "../schemas/questionSet.schema.js";

const router = express.Router();

// GET /api/question-sets (인증 필요)
router.get("/", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '질문 세트 목록 조회'
        #swagger.description = '사용자가 생성한 모든 질문 세트 목록을 조회합니다.'
    */
    ctrl.listQuestionSets(req, res, next);
});


// GET /api/question-sets/:setId/questions (세트 질문 조회 - 인증 필요하면 ensureAuth 유지)
router.get("/:setId/questions", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '세트 내 질문 목록 조회'
        #swagger.description = '특정 질문 세트에 포함된 질문들을 조회합니다.'
        #swagger.parameters['setId'] = { description: '질문 세트 ID' }
    */
    ctrl.listQuestions(req, res, next);
});


// POST /api/question-sets (질문세트 생성 - 인증 필요)
router.post("/", ensureAuth, validate(schemas.createQuestionSetSchema), (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '질문 세트 생성'
        #swagger.description = '새로운 질문 세트를 생성합니다.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: '질문 세트 정보',
            required: true,
            schema: {
                name: "CS 면접 대비",
                category: "CS",
                description: "운영체제, 네트워크 위주"
            }
        }
    */
    ctrl.create(req, res, next);
}); 


// POST /api/question-sets/:setId/questions
router.post("/:setId/questions", ensureAuth, validate(schemas.createQuestionSchema), (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '질문 추가'
        #swagger.description = '특정 질문 세트에 새로운 질문을 추가합니다.'
        #swagger.parameters['setId'] = { description: '질문 세트 ID' }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '질문 내용',
            required: true,
            schema: {
                content: "프로세스와 스레드의 차이는 무엇인가요?"
            }
        }
    */
    ctrl.createQuestion(req, res, next);
});


// PATCH /api/question-sets/:setId (질문세트 수정)
router.patch("/:setId", ensureAuth, validate(schemas.updateQuestionSetSchema), (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '질문 세트 수정'
        #swagger.description = '질문 세트의 제목이나 설명을 수정합니다.'
        #swagger.parameters['setId'] = { description: '질문 세트 ID' }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '수정할 내용',
            schema: {
                name: "수정된 제목",
                description: "수정된 설명"
            }
        }
    */
    ctrl.updateQuestionSet(req, res, next);
});


// PATCH /api/question-sets/:setId/questions/:questionId (개별 질문 수정)
router.patch("/:setId/questions/:questionId", ensureAuth, validate(schemas.updateQuestionSchema), (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '질문 수정'
        #swagger.description = '세트 내의 특정 질문 내용을 수정합니다.'
        #swagger.parameters['setId'] = { description: '질문 세트 ID' }
        #swagger.parameters['questionId'] = { description: '질문 ID' }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '수정할 질문 내용',
            schema: {
                content: "수정된 질문 내용"
            }
        }
    */
    ctrl.updateQuestion(req, res, next);
});


// DELETE /api/question-sets/:setId (질문세트 삭제)
router.delete("/:setId", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '질문 세트 삭제'
        #swagger.description = '질문 세트와 포함된 모든 질문을 삭제합니다.'
        #swagger.parameters['setId'] = { description: '질문 세트 ID' }
    */
    ctrl.deleteQuestionSet(req, res, next);
});


// DELETE /api/question-sets/:setId/questions/:questionId (질문 삭제)
router.delete("/:setId/questions/:questionId", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['QuestionSet']
        #swagger.summary = '질문 삭제'
        #swagger.description = '세트 내의 특정 질문 하나를 삭제합니다.'
        #swagger.parameters['setId'] = { description: '질문 세트 ID' }
        #swagger.parameters['questionId'] = { description: '질문 ID' }
    */
    ctrl.deleteQuestion(req, res, next);
}); 


export default router;