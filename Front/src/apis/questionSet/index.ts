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
  const result = z.array(QuestionSetSchema).safeParse(response.data.success);
  
  if (!result.success) {
    console.error('getQuestionSets validation failed:', result.error);
    throw new Error('질문 세트 데이터 검증에 실패했습니다.');
  }
  
  return result.data;
};

export const createQuestionSet = async (category: 'JOB' | 'PERSONAL' | 'MOTIVATION', name: string): Promise<QuestionSet> => {
  const response = await api.post<{ success: { questionSet: QuestionSet } }>('/question-sets', { category, name });
  const schema = z.object({ questionSet: QuestionSetSchema });
  const result = schema.safeParse(response.data.success);

  if (!result.success) {
    console.error('createQuestionSet validation failed:', result.error);
    throw new Error('질문 세트 생성 데이터 검증에 실패했습니다.');
  }

  return result.data.questionSet;
};

export const deleteQuestionSet = async (setId: string): Promise<void> => {
  await api.delete(`/question-sets/${setId}`);
};

export const updateQuestionSet = async (setId: string, data: { name?: string; category?: 'JOB' | 'PERSONAL' | 'MOTIVATION' }): Promise<QuestionSet> => {
  const response = await api.patch<{ success: { questionSet: QuestionSet } }>(`/question-sets/${setId}`, data);
  const schema = z.object({ questionSet: QuestionSetSchema });
  const result = schema.safeParse(response.data.success);

  if (!result.success) {
    console.error('updateQuestionSet validation failed:', result.error);
    throw new Error('질문 세트 수정 데이터 검증에 실패했습니다.');
  }

  return result.data.questionSet;
};

// Question APIs
export const getQuestions = async (setId: string): Promise<Question[]> => {
  const response = await api.get<{ success: { items: Question[] } }>(`/question-sets/${setId}/questions`);
  const schema = z.object({ items: z.array(QuestionSchema) });
  const result = schema.safeParse(response.data.success);

  if (!result.success) {
    console.error('getQuestions validation failed:', result.error);
    throw new Error('질문 목록 데이터 검증에 실패했습니다.');
  }

  return result.data.items;
};

export const createQuestion = async (setId: string, content: string): Promise<Question> => {
  const response = await api.post<{ success: { question: Question } }>(`/question-sets/${setId}/questions`, { content });
  const schema = z.object({ question: QuestionSchema });
  const result = schema.safeParse(response.data.success);

  if (!result.success) {
    console.error('createQuestion validation failed:', result.error);
    throw new Error('질문 생성 데이터 검증에 실패했습니다.');
  }

  return result.data.question;
};

export const updateQuestion = async (setId: string, questionId: string, content: string): Promise<Question> => {
  const response = await api.patch<{ success: { question: Question } }>(`/question-sets/${setId}/questions/${questionId}`, { content });
  const schema = z.object({ question: QuestionSchema });
  const result = schema.safeParse(response.data.success);

  if (!result.success) {
    console.error('updateQuestion validation failed:', result.error);
    throw new Error('질문 수정 데이터 검증에 실패했습니다.');
  }

  return result.data.question;
};

export const deleteQuestion = async (setId: string, questionId: string): Promise<void> => {
  await api.delete(`/question-sets/${setId}/questions/${questionId}`);
};
