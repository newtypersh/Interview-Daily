export type FeedbackCategory = 'JOB' | 'PERSONAL' | 'MOTIVATION';

export type FeedbackTemplate = {
  id: string;
  userId: string;
  category: FeedbackCategory;
  templateText: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetFeedbackTemplatesResponse = {
  resultType: string;
  success: {
    templates: FeedbackTemplate[];
  };
  error: any;
};

export type UpdateFeedbackTemplateRequest = {
  category: FeedbackCategory;
  content: string;
};

export type UpdateFeedbackTemplateResponse = {
  resultType: string;
  success: {
    template: FeedbackTemplate;
  };
  error: any;
};
