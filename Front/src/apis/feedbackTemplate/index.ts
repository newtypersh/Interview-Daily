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
  const parsed = GetFeedbackTemplatesResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('getFeedbackTemplates validation failed:', parsed.error);
    throw new Error('피드백 템플릿 목록 검증에 실패했습니다.');
  }
  return parsed.data.success.templates;
};

export const getFeedbackTemplateByCategory = async (category: string): Promise<FeedbackTemplate[]> => {
  const response = await api.get<GetFeedbackTemplatesResponse>(`/feedback-templates/${category}`);
  const parsed = GetFeedbackTemplatesResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('getFeedbackTemplateByCategory validation failed:', parsed.error);
    throw new Error('카테고리별 피드백 템플릿 검증에 실패했습니다.');
  }
  return parsed.data.success.templates;
};

export const updateFeedbackTemplate = async (data: UpdateFeedbackTemplateRequest): Promise<FeedbackTemplate> => {
  const response = await api.patch<UpdateFeedbackTemplateResponse>(`/feedback-templates/${data.category}`, {
    content: data.content,
  });
  const parsed = UpdateFeedbackTemplateResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    console.error('updateFeedbackTemplate validation failed:', parsed.error);
    throw new Error('피드백 템플릿 수정 결과 검증에 실패했습니다.');
  }
  return parsed.data.success.template;
};
