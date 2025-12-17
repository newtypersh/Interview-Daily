import { api } from '../axios';
import {
  GetFeedbackTemplatesResponseSchema,
  UpdateFeedbackTemplateResponseSchema,
  type GetFeedbackTemplatesResponse,
  type UpdateFeedbackTemplateRequest,
  type UpdateFeedbackTemplateResponse,
  type FeedbackTemplate
} from '../../schemas/feedbackTemplate';

export const getFeedbackTemplates = async (): Promise<FeedbackTemplate[]> => {
  const response = await api.get<GetFeedbackTemplatesResponse>('/feedback-templates');
  const parsed = GetFeedbackTemplatesResponseSchema.parse(response.data);
  return parsed.success.templates;
};

export const getFeedbackTemplateByCategory = async (category: string): Promise<FeedbackTemplate[]> => {
  const response = await api.get<GetFeedbackTemplatesResponse>(`/feedback-templates/${category}`);
  const parsed = GetFeedbackTemplatesResponseSchema.parse(response.data);
  return parsed.success.templates;
};

export const updateFeedbackTemplate = async (data: UpdateFeedbackTemplateRequest): Promise<FeedbackTemplate> => {
  const response = await api.patch<UpdateFeedbackTemplateResponse>(`/feedback-templates/${data.category}`, {
    content: data.content,
  });
  const parsed = UpdateFeedbackTemplateResponseSchema.parse(response.data);
  return parsed.success.template;
};
