import type { Question } from '../questionSet/types';

export interface InterviewAnswerDto {
  id: string;
  interviewId: string;
  questionId: string;
  sequence: number;
  audioUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  questionContent: string;
  transcriptText?: string;
  feedbacks?: { rating: number; feedbackText?: string }[];
}

export interface InterviewDto {
  id: string;
  userId: string;
  questionSetId: string;
  category?: string;
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

export interface UploadAudioResponse {
  answer: {
    id: string;
    audioUrl: string;
    transcriptText?: string;
  };
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
  mediaBlobUrl: string | null;
}

export interface InterviewSubmission {
  isSubmitting: boolean;
  error: Error | null;
  submit: (questionId: string | undefined, mediaBlobUrl: string | null) => void;
  currentAnswerId?: string | null;
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
export interface CompleteInterviewResponse {
  id: string;
  status: string;
  category: string;
  answers: {
    id: string;
    sequence: number;
    question: string;
    audioUrl: string | null;
    transcript?: string;
    feedbacks: { rating: number; feedbackText?: string }[];
  }[];
  templates: {
    id: string;
    content: string;
  }[];
}
