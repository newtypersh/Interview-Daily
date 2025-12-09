import express from "express";
import * as ctrl from "../controllers/interview.controller.js";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { audioUploader } from "../middleware/audioUploader.js";

const router = express.Router();

// POST /api/interviews/start
router.post("/start", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['Interview']
        #swagger.summary = '면접 시작'
        #swagger.description = '새로운 면접 세션을 생성하고 첫 번째 질문 세트를 할당합니다.'
        #swagger.parameters['body'] = {
            in: 'body',
            description: '면접 설정',
            required: false,
            schema: {
                strategy: "random"
            }
        }
        #swagger.responses[201] = {
            description: '면접 생성 성공',
            schema: {
                resultType: "SUCCESS",
                success: {
                    interview: {
                        id: "1",
                        userId: "1",
                        questionSetId: "1",
                        answers: []
                    }
                }
            }
        }
    */
    ctrl.startInterview(req, res, next);
});


// GET /api/interviews/:interviewId/
router.get("/:interviewId/", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['Interview']
        #swagger.summary = '면접 상세 정보 조회'
        #swagger.parameters['interviewId'] = { description: '면접 ID' }
    */
    ctrl.getInterview(req, res, next);
});


// GET /api/interviews/:interviewId/answers
router.get("/:interviewId/answers", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['Interview']
        #swagger.summary = '면접 답변 목록 조회'
        #swagger.description = '특정 면접의 모든 질문과 사용자의 답변(오디오 URL, STT 결과 포함)을 조회합니다.'
        #swagger.parameters['interviewId'] = { description: '면접 ID' }
        #swagger.responses[200] = {
            description: '조회 성공',
            schema: {
                id: "1",
                userId: "1",
                questionSetId: "1",
                answers: [{
                    id: "1",
                    interviewId: "1",
                    questionId: "1",
                    sequence: 1,
                    questionContent: "질문 내용",
                    audioUrl: "https://...",
                    transcriptText: "답변 내용",
                    createdAt: "2023-01-01T00:00:00Z",
                    updatedAt: "2023-01-01T00:00:00Z"
                }]
            }
        }
    */
    ctrl.getInterviewAnswers(req, res, next);
});


// POST /api/interviews/:interviewId/feedbacks
router.post("/:interviewId/feedbacks", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['Interview']
        #swagger.summary = '피드백 제출'
        #swagger.description = '면접이 끝난 후, 사용자가 스스로 평가한 피드백 점수와 코멘트를 저장합니다.'
        #swagger.parameters['interviewId'] = { description: '면접 ID' }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '피드백 데이터 목록',
            required: true,
            schema: {
                feedbacks: [
                    { answerId: 1, score: 5, comment: "잘 답변함" },
                    { answerId: 2, score: 3, comment: "보통임" }
                ]
            }
        }
    */
    ctrl.submitFeedbacks(req, res, next);
});


// POST /api/interviews/:interviewId/answers/:answerId/audio
router.post("/:interviewId/answers/:answerId/audio", ensureAuth, audioUploader.single("file"), (req, res, next) => {
    /* 
        #swagger.tags = ['Interview']
        #swagger.summary = '답변 오디오 업로드'
        #swagger.description = '특정 질문에 대한 사용자의 음성 답변 파일을 업로드합니다.'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['interviewId'] = { description: '면접 ID' }
        #swagger.parameters['answerId'] = { description: '답변(질문) ID' }
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            required: true,
            description: '업로드할 오디오 파일 (mp3, wav, m4a 등)'
        }
    */
    ctrl.uploadAnswerAudio(req, res, next);
});


// POST /api/interviews/:interviewId/complete   
router.post("/:interviewId/complete", ensureAuth, (req, res, next) => {
    /* 
        #swagger.tags = ['Interview']
        #swagger.summary = '면접 종료'
        #swagger.description = '면접 상태를 완료(COMPLETED)로 변경합니다.'
        #swagger.parameters['interviewId'] = { description: '면접 ID' }
    */
    ctrl.completeInterview(req, res, next);
});


export default router;