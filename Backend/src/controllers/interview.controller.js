import * as service from "../services/interview.service.js";
import { toInterviewDto } from "../dtos/interview.dto.js";
import { startInterviewRequestDto } from "../dtos/interview.request.dto.js";
import { StatusCodes } from "http-status-codes";

export const startInterview = async (req, res, next) => {
    try {
        const requestDto = new startInterviewRequestDto(req.body);
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



export const uploadAnswerAudio = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ isSuccess: false, code: "COMMON401", message: "로그인이 필요합니다.", result: null });

        const { interviewId, answerId } = req.params;
        if (!req.file) return res.status(400).json({ isSuccess: false, code: "INVALID_PAYLOAD", message: "파일이 필요합니다.", result: null });

        const audioUrl = req.file.location;
        const size = req.file.size;

        const updated = await service.updateAnswerAudio({ interviewId, answerId, userId, audioUrl });

        return res.status(200).json({
            isSuccess: true,
            code: "COMMON200",
            message: "성공입니다.",
            result: { answer: { id: String(updated.id), audioUrl } }
        });
    } catch (err) {
        next(err);
    }
};