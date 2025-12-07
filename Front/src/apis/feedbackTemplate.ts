import { api } from './axios';
import type { 
  FeedbackTemplateDto, 
  GetFeedbackTemplatesResponse, 
  UpdateFeedbackTemplateRequest, 
  UpdateFeedbackTemplateResponse 
} from '../types';

export const getFeedbackTemplates = async (): Promise<FeedbackTemplateDto[]> => {
  const response = await api.get<GetFeedbackTemplatesResponse>('/feedback-templates');
  return response.data.success.templates;
};

export const getFeedbackTemplateByCategory = async (category: string): Promise<FeedbackTemplateDto[]> => {
  const response = await api.get<GetFeedbackTemplatesResponse>(`/feedback-templates/${category}`);
  return response.data.success.templates;
};

export const updateFeedbackTemplate = async (data: UpdateFeedbackTemplateRequest): Promise<FeedbackTemplateDto> => {
  const response = await api.patch<UpdateFeedbackTemplateResponse>(`/feedback-templates/${data.category}`, {
    content: data.content,
  });
  return response.data.success.template;
};
