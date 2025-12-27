import { api } from '../axios';
import { 
  QuestionSetSchema, 
  QuestionSchema,
  type Question,
  type QuestionSet,
 } from '../../schemas/questionSet';

export type { Question, QuestionSet };
export { QuestionSetSchema, QuestionSchema };
import { z } from 'zod';

// Question Set APIs
export const getQuestionSets = async (): Promise<QuestionSet[]> => {
  const response = await api.get<{ success: QuestionSet[] }>('/question-sets');
  return z.array(QuestionSetSchema).parse(response.data.success);
};

export const createQuestionSet = async (category: 'JOB' | 'PERSONAL' | 'MOTIVATION', name: string): Promise<QuestionSet> => {
  const response = await api.post<{ success: { questionSet: QuestionSet } }>('/question-sets', { category, name });
  const schema = z.object({ questionSet: QuestionSetSchema });
  return schema.parse(response.data.success).questionSet;
};

export const deleteQuestionSet = async (setId: string): Promise<void> => {
  await api.delete(`/question-sets/${setId}`);
};

export const updateQuestionSet = async (setId: string, data: { name?: string; category?: 'JOB' | 'PERSONAL' | 'MOTIVATION' }): Promise<QuestionSet> => {
  const response = await api.patch<{ success: { questionSet: QuestionSet } }>(`/question-sets/${setId}`, data);
  const schema = z.object({ questionSet: QuestionSetSchema });
  return schema.parse(response.data.success).questionSet;
};

// Question APIs
export const getQuestions = async (setId: string): Promise<Question[]> => {
  const response = await api.get<{ success: { items: Question[] } }>(`/question-sets/${setId}/questions`);
  const schema = z.object({ items: z.array(QuestionSchema) });
  return schema.parse(response.data.success).items;
};

export const createQuestion = async (setId: string, content: string): Promise<Question> => {
  const response = await api.post<{ success: { question: Question } }>(`/question-sets/${setId}/questions`, { content });
  const schema = z.object({ question: QuestionSchema });
  return schema.parse(response.data.success).question;
};

export const updateQuestion = async (setId: string, questionId: string, content: string): Promise<Question> => {
  const response = await api.patch<{ success: { question: Question } }>(`/question-sets/${setId}/questions/${questionId}`, { content });
  const schema = z.object({ question: QuestionSchema });
  return schema.parse(response.data.success).question;
};

export const deleteQuestion = async (setId: string, questionId: string): Promise<void> => {
  await api.delete(`/question-sets/${setId}/questions/${questionId}`);
};
