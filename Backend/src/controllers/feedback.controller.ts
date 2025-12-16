import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as service from "../services/interview.service.js";
import { BadRequestError, UnauthorizedError } from '../errors.js';

// POST /api/interviews/:interviewId/feedbacks
export const postFeedbacksForInterview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req.user as any)?.id;
        if (!userId) {
            throw new UnauthorizedError("로그인이 필요합니다.");
        }

        const { interviewId } = req.params;
        const { feedbacks } = req.body ?? {};

        if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
            throw new BadRequestError("feedbacks 배열이 필요합니다.");
        }

        // 기본적인 항목 유효성 검사
        for (const f of feedbacks) {
            if (!f.interviewAnswerId) {
                throw new BadRequestError("interviewAnswerId가 필요합니다.");
            }
            if (f.rating != null) {
                const r = Number(f.rating);
                if (Number.isNaN(r) || r < 1 || r > 5) {
                    throw new BadRequestError("rating은 1에서 5 사이의 숫자여야 합니다.");
                }
            }
            if (f.feedbackText != null && String(f.feedbackText).length > 2000) {
                throw new BadRequestError("feedbackText가 너무 깁니다.");
            }
        }

        const result = await service.submitFeedbacks({ userId, interviewId, feedbacks });
        
        return res.status(StatusCodes.CREATED).success({
            message: "피드백이 저장되었습니다.",
            count: result.count
        });
    } catch (err) {
        next(err);
    }
};
