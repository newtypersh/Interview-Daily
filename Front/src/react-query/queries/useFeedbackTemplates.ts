import { useQuery } from '@tanstack/react-query';
import { getFeedbackTemplates, getFeedbackTemplateByCategory } from '../../apis/feedbackTemplate/index';


export const useFeedbackTemplates = () => {
  return useQuery({
    queryKey: ['feedbackTemplates'],
    queryFn: getFeedbackTemplates,
  });
};

export const useFeedbackTemplatesByCategory = (category: string | undefined | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['feedbackTemplates', category],
    queryFn: () => getFeedbackTemplateByCategory(category!),
    enabled: !!category,
  });

  return {
    templates: data,
    isLoading,
    error,
  };
};
