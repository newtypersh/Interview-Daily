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
