import type { Question } from './index';

export interface InterviewAnswerDto {
  id: string;
  interviewId: string;
  questionId: string;
  sequence: number;
  audioUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  questionContent: string;
}

export interface InterviewDto {
  id: string;
  userId: string;
  questionSetId: string;
  day: string | null;
  interviewedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  answers: InterviewAnswerDto[];
}

export interface StartInterviewResponse {
  resultType: string;
  success: {
    interview: InterviewDto;
  };
  error?: any;
}

export interface InterviewSessionState {
  currentQuestion: Question | undefined;
  currentIndex: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  toNextQuestion: () => void;
  toPrevQuestion: () => void;
}

export interface InterviewRecording {
  isActive: boolean;
  isStopped: boolean;
  start: () => void;
  stop: () => void;
  retry: () => void;
}

export interface InterviewSubmission {
  isSubmitting: boolean;
  error: Error | null;
  submit: () => void;
}

export interface InterviewStatus {
  isLoading: boolean;
  error: Error | null;
  interviewId: string | null;
}

export interface InterviewContextType {
  session: InterviewSessionState;
  recording: InterviewRecording;
  submission: InterviewSubmission;
  status: InterviewStatus;
}
