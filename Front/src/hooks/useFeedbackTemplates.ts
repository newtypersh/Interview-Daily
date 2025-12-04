import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFeedbackTemplates, updateFeedbackTemplate, FeedbackTemplateDto } from '../apis/feedbackTemplate';
import { INTERVIEW_CATEGORIES, CATEGORY_TITLES, CATEGORY_LIST } from '../constants/interview';

export interface UI_FeedbackTemplate {
  type: keyof typeof INTERVIEW_CATEGORIES;
  title: string;
  content: string;
}

export const useFeedbackTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['feedbackTemplates'],
    queryFn: getFeedbackTemplates,
    select: (data: FeedbackTemplateDto[]): UI_FeedbackTemplate[] => {
      const mapped = data.map((t) => ({
        type: t.category,
        title: CATEGORY_TITLES[t.category] || t.category,
        content: t.templateText || '',
      }));

      // Sort based on CATEGORY_LIST order
      const order = CATEGORY_LIST.map(c => c.id);
      return mapped.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFeedbackTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackTemplates'] });
    },
  });

  return {
    templates,
    isLoading,
    error,
    updateTemplate: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
