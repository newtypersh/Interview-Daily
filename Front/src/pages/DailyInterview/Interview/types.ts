import type { Question } from '../../../apis/questionSet';

export type InterviewSessionState = {
  currentIndex: number;
  totalQuestions: number;
  currentQuestion: Question | undefined;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  toNextQuestion: () => void;
  toPrevQuestion: () => void;
};

export type InterviewRecording = {
  isActive: boolean;
  isStopped: boolean;
  mediaBlobUrl: string | null;
  start: () => void;
  stop: () => void;
  retry: () => void;
};

export type InterviewSubmission = {
  isSubmitting: boolean;
  error: Error | null;
  submit: (questionId: string | undefined, mediaBlobUrl: string | null) => void;
  currentAnswerId: string | null;
};

export type InterviewLoadingStatus = {
  isLoading: boolean;
  error: Error | null;
  interviewId: string | null;
};
