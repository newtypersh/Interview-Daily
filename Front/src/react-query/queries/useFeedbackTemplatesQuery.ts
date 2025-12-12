import { useQuery } from '@tanstack/react-query';
import { getFeedbackTemplates } from '../../apis/feedbackTemplate/index';

export const useFeedbackTemplatesQuery = () => {
  return useQuery({
    queryKey: ['feedbackTemplates'],
    queryFn: getFeedbackTemplates,
  });
};
