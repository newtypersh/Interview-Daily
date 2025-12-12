import { z } from 'zod';


// 질문 세트 이름 (예: "React 면접 대비")
export const QuestionSetSchema = z.object({
  name: z.string()
    .min(1, '세트 이름은 최소 1자 이상이어야 합니다.')
    .max(50, '세트 이름은 최대 50자까지 가능합니다.'),
});

// 개별 질문 내용
export const QuestionContentSchema = z.object({
  content: z.string()
    .min(2, '질문은 최소 2자 이상이어야 합니다.')
    .max(200, '질문은 200자 이내로 작성해주세요.'),
});

// 피드백 템플릿 마크다운 내용
export const FeedbackTemplateContentSchema = z.object({
  content: z.string()
    .min(1, '템플릿 내용을 입력해주세요.')
    .max(3000, '템플릿 내용은 3000자 이내로 작성해주세요.'),
});
