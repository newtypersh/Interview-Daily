
export type QuestionCategory = 'JOB' | 'PERSONAL' | 'MOTIVATION';

export type Question = {
  id: string;
  questionSetId: string;
  content: string | null;
  order: number | null;
  createdAt: string;
  updatedAt: string;
};

export type QuestionSet = {
  id: string;
  userId: string;
  name: string;
  category: QuestionCategory;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
};
