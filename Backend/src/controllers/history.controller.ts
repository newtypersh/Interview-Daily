import { NextFunction, Request, Response } from 'express';
import { GetInterviewHistoryRequestDto } from "../dtos/history.request.dto.js";
import { toHistoryResponseDto } from "../dtos/history.response.dto.js";
import * as service from "../services/history.service.js";
import { StatusCodes } from "http-status-codes";

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDto = new GetInterviewHistoryRequestDto(req);
        const payload = requestDto.toServicePayload();

        const { items, nextCursor } = await service.getInterviewHistory(payload);

        return res.status(StatusCodes.OK).success({
            data: items.map(toHistoryResponseDto),
            pagination: {
                nextCursorCreatedAt: nextCursor?.createdAt || null,
                hasNext: !!nextCursor,
            }
        });
    } catch (err) {
        next(err);
    }
};