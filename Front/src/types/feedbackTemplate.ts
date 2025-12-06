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
