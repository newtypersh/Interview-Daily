import * as service from "../services/history.service.js";
import { toInterviewDto } from "../dtos/interview.dto.js";

/**
 * GET /api/history/interviews
 * query:
 *  - limit (optional, default 20)
 *  - cursorCreatedAt (optional, ISO)
 *  - cursorId (optional, string)
*/
export const getInterviewHistory = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ isSuccess: false, code: "COMMIN401", message: "로그인 필요", result: null });

        const limit = Math.min(100, Number(req.query,limit || 20));
        const cursorCreatedAt = req.query.cursorCreatedAt ?? null;
        const cursorId = req.query.cursorId ?? null;

        const { items , nextCursor } = await service.getInterviewHistory({ userId, limit, cursorCreatedAt, cursorId });

        return res.status(200).json({
            isSuccess: true,
            code: "COMMON200",
            message: "성공입니다.",
            result: {
                items: items.map(i => toInterviewDto(i)),
                nextCursor, // { createdAt: ISOString, id: string } or null
            },
        });
    } catch (err) {
        next(err);
    }
};