export interface FeedbackSubmissionItem {
  answerId: string;
  score: number;
  comment: string;
}

export interface FeedbackSubmissionRequest {
  feedbacks: FeedbackSubmissionItem[];
}
