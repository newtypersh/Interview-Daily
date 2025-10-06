export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Question {
  id: string;
  content: string;
  order: number;
}

export interface QuestionSet {
  id: string;
  name: string;
  type: 'job_competency' | 'personality' | 'motivation';
  questions: Question[];
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  audioUrl?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  answerId: string;
  satisfaction: 'satisfied' | 'unsatisfied';
  content: string;
}

export interface InterviewSession {
  id: string;
  date: string;
  questionSetId: string;
  questionSetName: string;
  questionSetType: string;
  answers: Answer[];
  feedbacks: Feedback[];
}
