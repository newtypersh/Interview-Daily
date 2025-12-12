import { useQuery } from '@tanstack/react-query';
import { getFeedbackTemplateByCategory } from '../../apis/feedbackTemplate/index';

export const useFeedbackTemplate = (category: string | undefined | null) => {
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['feedbackTemplates', category],
    queryFn: () => getFeedbackTemplateByCategory(category!),
    enabled: !!category,
  });

  return {
    templates,
    isLoading,
    error,
  };
};
