import type { InterviewAnswerDto } from '../../../../types';

export interface FeedbackQuestion {
  id: string;
  content: string;
  order: number;
  answerId: string;
  audioUrl: string | null;
  transcript?: string;
}

export const mapInterviewToQuestions = (answers: InterviewAnswerDto[] | undefined): FeedbackQuestion[] => {
  if (!answers) return [];

  return answers.map(a => ({
    id: a.questionId, // 답변 ID가 아닌 질문 ID를 식별자로 사용 (일관성 유지)
    content: a.questionContent,
    order: a.sequence,
    answerId: a.id, // 답변 고유 ID도 필요할 수 있으므로 저장 (useFeedbackForm에서 활용 가능성)
    audioUrl: a.audioUrl,
    transcript: a.transcriptText,
  }));
};
