import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as service from '../services/feedbackTemplate.service.js';
import { toFeedbackTemplateDto } from '../dtos/feedbackTemplate.dto.js';
import {
    GetFeedbackTemplatesRequestDto,
    GetFeedbackTemplatesByCategoryRequestDto,
    UpdateFeedbackTemplateRequestDto
} from '../dtos/feedbackTemplate.request.dto.js';

// GET /api/feedback-templates
export const getFeedbackTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // DTO 생성
        const requestDto = new GetFeedbackTemplatesRequestDto(req);

        // 서비스 호출
        const { userId } = requestDto.toServicePayload();
        const items = await service.getFeedbackTemplates({ userId });
        
        return res.status(StatusCodes.OK).success({ 
            templates: items.map(toFeedbackTemplateDto) 
        });
    } catch (error) {
        return next(error);
    }
};

// GET /api/feedback-templates/:category
export const getFeedbackTemplatesByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDto = new GetFeedbackTemplatesByCategoryRequestDto(req);
        const { userId, category } = requestDto.toServicePayload();
        const items = await service.getFeedbackTemplatesByCategory({ userId, category });
        
        return res.status(StatusCodes.OK).success({ 
            templates: items.map(toFeedbackTemplateDto) 
        });
    } catch (error) {
        return next(error);
    }
};

// PATCH /api/feedback-templates/:category
export const updateFeedbackTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDto = new UpdateFeedbackTemplateRequestDto(req);
        
        const payload = requestDto.toServicePayload();
        // Service export name mismatch fix: updateFeedbackTemplate -> updateTemplate
        const updated = await service.updateTemplate(payload);
        
        return res.status(StatusCodes.OK).success({ 
            template: toFeedbackTemplateDto(updated) 
        });
    } catch (error) {
        return next(error);
    }
};