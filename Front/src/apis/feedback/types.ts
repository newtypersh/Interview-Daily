export type FeedbackSubmissionItem = {
  answerId: string;
  rating: number;
  feedbackText: string;
};

export type FeedbackSubmissionRequest = {
  feedbacks: FeedbackSubmissionItem[];
};
