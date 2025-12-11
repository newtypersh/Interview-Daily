export type User = {
  id: string;
  name: string;
  email: string;
}

export type Question = {
  id: string;
  content: string;
  order: number;
}

export type QuestionSet = {
  id: string;
  name: string;
  category: 'JOB' | 'PERSONAL' | 'MOTIVATION';
  questions: Question[];
}

export type Answer = {
  id: string;
  questionId: string;
  content: string;
  audioUrl?: string;
  createdAt: string;
}

export type Feedback = {
  id: string;
  answerId: string;
  satisfaction: 'satisfied' | 'unsatisfied';
  content: string;
}

export type InterviewSession = {
  id: string;
  date: string;
  questionSetId: string;
  questionSetName: string;
  questionSetType: string;
  answers: Answer[];
  feedbacks: Feedback[];
}



export * from './interview';

