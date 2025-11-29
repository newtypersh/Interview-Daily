import * as service from "../services/interview.service.js";
import { toInterviewDto } from "../dtos/interview.dto.js";
import { StartInterviewRequestDto, UploadAnswerAudioRequestDto } from "../dtos/interview.request.dto.js";
import { StatusCodes } from "http-status-codes";

// POST /api/interviews/start
export const startInterview = async (req, res, next) => {
    try {
        const requestDto = new StartInterviewRequestDto(req.body);
        const payload = requestDto.toServicePayload();

        const session = await service.startInterview(payload);

        return res.status(StatusCodes.CREATED).success({
            interview: toInterviewDto(session)
        });
    } catch (err) {
        next(err);
    }
};

export const postInterviewAnswer = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).error({ error: "unauthorized", });

        const { interviewId } = req.params;
        const { interviewAnswerId, questionId, sequence, audio_url } = req.body ?? {};

        if (!interviewAnswerId && !questionId) {
            return res.status(400).json({ error: "invalid_payload", message: "interviewAnswerId or questionId required" });
        }

        const answer = await service.upsertInterviewAnswer({ interviewId, userId, interviewAnswerId, questionId, sequence, audio_url });
        return res.status(interviewAnswerId ? 200 : 201).json({ answer });
    } catch (err) {
        next(err);
    }
};

// GET /api/interviews/:interviewId
export const getInterview = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "unauthorized", });

        const { interviewId} = req.params;
        const iv = await service.getInterview({ interviewId, userId });
        return res.status(200).json({ interview: toInterviewDto(iv) });
    } catch (err) {
        next(err);
    }
};

// GET /api/interviews/:interviewId/answers
export const getInterviewAnswers = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).error({ error: "unauthorized", });

        const { interviewId } = req.params;
        const payload = await service.getInterviewAnswers({ interviewId, userId });
        return res.status(200).json(payload);
    } catch (err) {
        next(err);
    }
};

// POST /api/interviews/:interviewId/answers/:answerId/audio
export const uploadAnswerAudio = async (req, res, next) => {
    try {
        // 1. DTO를 통한 검증 및 데이터 추출
        const requestDto = new UploadAnswerAudioRequestDto(req);
        const payload = requestDto.toServicePayload();
        
        // 2. 서비스 호출
        const updated = await service.updateAnswerAudio(payload);

        // 3. 응답 반환
        return res.status(200).json({
            answer: {
                id: String(updated.id),
                audioUrl: payload.audioUrl,
            }
        });
    } catch (err) {
        next(err);
    }
};