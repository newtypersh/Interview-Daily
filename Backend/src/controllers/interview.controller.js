import * as service from "../services/interview.service.js";
import { toInterviewDto } from "../dtos/interview.dto.js";

export const startInterview = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).error({ errorCode: "unauthorized", });

        const { strategy } = req.body ?? {};
        const session = await service.startInterview({ userId });

        return res.status(200).json({ interview: toInterviewDto(session) })

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