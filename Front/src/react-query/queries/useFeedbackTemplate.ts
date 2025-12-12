import { useQuery } from '@tanstack/react-query';
import { getFeedbackTemplateByCategory } from '../../apis/feedbackTemplate/index';

export const useFeedbackTemplate = (category: string | undefined | null) => {
  return useQuery({
    queryKey: ['feedbackTemplates', category],
    queryFn: () => getFeedbackTemplateByCategory(category!),
    enabled: !!category,
    select: (data) => ({ templates: data }),
  });
};
