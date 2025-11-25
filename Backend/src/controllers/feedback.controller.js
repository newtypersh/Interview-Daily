import * as service from "../services/interview.service.js";

// POST /api/interviews/:interviewId/feedbacks
export const postFeedbacksForInterview = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ isSuccess: false, code: "COMMON401", message: "로그인이 필요합니다.", result: null });

        const { interviewId } = req.params;
        const { feedbacks } = req.body ?? {};

        if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
            return res.status(400).json({ isSuccess: false, code: "INVALID_PAYLOAD", message: "feedbacks 배열이 필요합니다.", result: null });
        }

        // 기본적인 항목 유효성 검사
        for (const f of feedbacks) {
            if (!f.intervieweAnswerId) {
                return res.status(400).json({ isSuccess: false, code: "INVALID_PAYLOAD", message: "interviewAnswerId가 필요합니다.", result: null });
            }
            if (f.rating != null) {
                const r = Number(f.rating);
                if (Number.isNaN(r) || r < 1 || r > 5) {
                    return res.status(400).json({ isSuccess: false, code: "INVALID_PAYLOAD", message: "rating은 1에서 5 사이의 숫자여야 합니다.", result: null });
                }
            }
            if (f.feedbackText != null && String(f.feedbackText).length > 2000) {
                return res.status(400).json({ isSuccess: false, code: "INVALID_PAYLOAD", message: "feedbackText가 너무 깁니다.", result: null });
            }
        }

        const created = await service.createFeedbacksForInterview( interviewId, userId, feedbacks );
        return res.status(201).json({
            isSuccess: true,
            code: "COMMON201",
            message: "피드백이 저장되었습니다.",
            result: { created: created.map(c => ({id: String(c.id), interviewAnswerId: String(c.interview_answer_id)})) }
        });
    } catch (err) {
        next(err);
    }
};
