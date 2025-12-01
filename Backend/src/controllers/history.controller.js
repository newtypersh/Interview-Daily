import { GetInterviewHistoryRequestDto } from "../dtos/history.request.dto.js";
import { toHistoryResponseDto } from "../dtos/history.response.dto.js";
import * as service from "../services/history.service.js";
import { StatusCodes } from "http-status-codes";

export const getHistory = async (req, res, next) => {
    try {
        const requestDto = GetInterviewHistoryRequestDto(req);
        const payload = requestDto.toServicePayload();

        const interviews = await service.getInterviewHistory(payload);

        return res.status(StatusCodes.OK).success({
            histories: interviews.map(toHistoryResponseDto)
        });
    } catch (err) {
        next(err);
    }
};