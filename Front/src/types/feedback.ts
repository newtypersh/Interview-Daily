export interface FeedbackSubmissionItem {
  answerId: string;
  rating: number;
  feedbackText: string;
}

export interface FeedbackSubmissionRequest {
  feedbacks: FeedbackSubmissionItem[];
}
