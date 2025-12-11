export interface InterviewHistoryItem {
  id: number;
  createdAt: string;
  totalScore: number;
  questionCount: number;
}

export interface InterviewHistoryResponse {
  data: InterviewHistoryItem[];
  pagination: {
    nextCursorCreatedAt: string | null;
    nextCursorId: number | null;
    hasNext: boolean;
  };
}
