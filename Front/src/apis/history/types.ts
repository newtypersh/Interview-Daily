export type InterviewHistoryItem = {
  id: number;
  createdAt: string;
  totalScore: number;
  questionCount: number;
}

export type InterviewHistoryResponse = {
  data: InterviewHistoryItem[];
  pagination: {
    nextCursorCreatedAt: string | null;
    nextCursorId: number | null;
    hasNext: boolean;
  };
}
