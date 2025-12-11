import { useQuery } from '@tanstack/react-query';
import { getFeedbackTemplates } from '../../apis/feedbackTemplate';
import type { FeedbackTemplateDto } from '../../apis/feedbackTemplate/types';

export const useFeedbackTemplatesQuery = () => {
  return useQuery<FeedbackTemplateDto[]>({
    queryKey: ['feedbackTemplates'],
    queryFn: getFeedbackTemplates,
  });
};
