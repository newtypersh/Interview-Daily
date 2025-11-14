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