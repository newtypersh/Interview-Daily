
export type FeedbackCategory = 'JOB' | 'PERSONAL' | 'MOTIVATION';

export type FeedbackTemplate = {
  id: string;
  userId: string;
  category: FeedbackCategory;
  templateText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FeedbackTemplateDto = FeedbackTemplate;

export interface GetFeedbackTemplatesResponse {
  resultType: string;
  success: {
    templates: FeedbackTemplateDto[];
  };
  error: any;
}

export interface UpdateFeedbackTemplateRequest {
  category: FeedbackCategory;
  content: string;
}

export interface UpdateFeedbackTemplateResponse {
  resultType: string;
  success: {
    template: FeedbackTemplateDto;
  };
  error: any;
}
