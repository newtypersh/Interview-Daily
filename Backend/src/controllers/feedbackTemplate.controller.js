import * as service from '../services/feedbackTemplate.service.js';
import { toFeedbackTemplateDto } from '../dtos/feedbackTemplate.dto.js';
import {
    GetFeedbackTemplatesRequestDto,
    UpdateFeedbackTemplateRequestDto
} from '../dtos/feedbackTemplate.request.dto.js';
import { StatusCodes } from 'http-status-codes';

// GET /api/feedback-templates
export const getFeedbackTemplates = async (req, res, next) => {
    try {
        // DTO 생성
        const requestDto = new GetFeedbackTemplatesRequestDto(req);

        // 서비스 호출
        const { userId, category } = requestDto.toServicePayload();
        const items = await service.getFeedbackTemplates({ userId, category });
        
        return res.status(StatusCodes.OK).success({ 
            templates: items.map(toFeedbackTemplateDto) 
        });
    } catch (error) {
        return next(error);
    }
};

// GET /api/feedback-templates/:category
export const getFeedbackTemplatesByCategory = async (req, res, next) => {
    try {
        const requestDto = new GetFeedbackTemplatesRequestDto(req);
        const { userId, category } = requestDto.toServicePayload();
        const items = await service.getFeedbackTemplates({ userId, category });
        
        return res.status(StatusCodes.OK).success({ 
            templates: items.map(toFeedbackTemplateDto) 
        });
    } catch (error) {
        return next(error);
    }
};

// PATCH /api/feedback-templates/:category
export const updateFeedbackTemplate = async (req, res, next) => {
    try {
        const requestDto = new UpdateFeedbackTemplateRequestDto(req);
        
        const payload = requestDto.toServicePayload();
        const updated = await service.updateFeedbackTemplate(payload);
        
        return res.status(StatusCodes.OK).success({ 
            template: toFeedbackTemplateDto(updated) 
        });
    } catch (error) {
        return next(error);
    }
};