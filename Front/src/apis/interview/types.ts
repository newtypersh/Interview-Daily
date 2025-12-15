import type { Question } from '../questionSet/types';

export type InterviewStatus = 'IN_PROGRESS' | 'COMPLETED';

export type InterviewAnswer = {
  id: string;
  interviewId: string;
  questionId: string;
  sequence: number;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
  // Hydrated fields from API
  questionContent?: string;
  transcriptText?: string;
  feedbacks?: { rating: number; feedbackText?: string }[];
};

export type Interview = {
  id: string;
  userId: string;
  questionSetId: string;
  category?: string;
  status: InterviewStatus;
  day: string | null;
  interviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  answers: InterviewAnswer[];
};

export type StartInterviewResponse = {
  resultType: string;
  success: {
    interview: Interview;
  };
  error?: any;
};

export type UploadAudioResponse = {
  answer: {
    id: string;
    audioUrl: string;
    transcriptText?: string;
  };
};

export type InterviewSessionState = {
  currentQuestion: Question | undefined;
  currentIndex: number;
  totalQuestions: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  toNextQuestion: () => void;
  toPrevQuestion: () => void;
};

export type InterviewRecording = {
  isActive: boolean;
  isStopped: boolean;
  start: () => void;
  stop: () => void;
  retry: () => void;
  mediaBlobUrl: string | null;
};

export type InterviewSubmission = {
  isSubmitting: boolean;
  error: Error | null;
  submit: (questionId: string | undefined, mediaBlobUrl: string | null) => void;
  currentAnswerId?: string | null;
};

export type InterviewLoadingStatus = {
  isLoading: boolean;
  error: Error | null;
  interviewId: string | null;
};

export type InterviewContextType = {
  session: InterviewSessionState;
  recording: InterviewRecording;
  submission: InterviewSubmission;
  status: InterviewLoadingStatus;
};

export type CompleteInterviewResponse = {
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
};

export type Feedback = {
  id: string;
  interviewAnswerId: string;
  questionId: string;
  rating: number;
  feedbackText: string | null;
  createdAt: string;
  updatedAt: string;
};

