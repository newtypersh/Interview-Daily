import { INTERVIEW_CATEGORIES } from '../../constants/interview';

export interface UI_FeedbackTemplate {
  type: keyof typeof INTERVIEW_CATEGORIES;
  title: string;
  content: string;
}
