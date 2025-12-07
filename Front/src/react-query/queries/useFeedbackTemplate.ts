import { useQuery } from '@tanstack/react-query';
import { getFeedbackTemplateByCategory } from '../../apis/feedbackTemplate';

export const useFeedbackTemplate = (category: string | undefined | null) => {
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['feedbackTemplates', category],
    queryFn: () => getFeedbackTemplateByCategory(category!),
    enabled: !!category,
  });

  // Since we expect a single active template for the interview context usually, 
  // or maybe a list. The component can handle the list.
  return {
    templates,
    isLoading,
    error,
  };
};
