import { GetInterviewHistoryRequestDto } from "../dtos/history.request.dto.js";
import { toHistoryResponseDto } from "../dtos/history.response.dto.js";
import * as service from "../services/history.service.js";
import { StatusCodes } from "http-status-codes";

export const getHistory = async (req, res, next) => {
    try {
        const requestDto = new GetInterviewHistoryRequestDto(req);
        const payload = requestDto.toServicePayload();

        const { items, nextCursor } = await service.getInterviewHistory(payload);

        return res.status(StatusCodes.OK).success({
            data: items.map(toHistoryResponseDto),
            pagination: {
                nextCursorCreatedAt: nextCursor?.createdAt || null,
                nextCursorId: nextCursor?.id ? Number(nextCursor.id) : null,
                hasNext: !!nextCursor,
            }
        });
    } catch (err) {
        next(err);
    }
};