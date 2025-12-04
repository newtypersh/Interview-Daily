import { api } from './axios';

export interface FeedbackTemplateDto {
  id: string;
  userId: string;
  category: 'JOB' | 'PERSONAL' | 'MOTIVATION';
  templateText: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetFeedbackTemplatesResponse {
  resultType: string;
  success: {
    templates: FeedbackTemplateDto[];
  };
  error: any;
}

export const getFeedbackTemplates = async (): Promise<FeedbackTemplateDto[]> => {
  const response = await api.get<GetFeedbackTemplatesResponse>('/feedback-templates');
  return response.data.success.templates;
};

export interface UpdateFeedbackTemplateRequest {
  category: 'JOB' | 'PERSONAL' | 'MOTIVATION';
  content: string;
}

export interface UpdateFeedbackTemplateResponse {
  resultType: string;
  success: {
    template: FeedbackTemplateDto;
  };
  error: any;
}

export const updateFeedbackTemplate = async (data: UpdateFeedbackTemplateRequest): Promise<FeedbackTemplateDto> => {
  const response = await api.patch<UpdateFeedbackTemplateResponse>(`/feedback-templates/${data.category}`, {
    content: data.content,
  });
  return response.data.success.template;
};
