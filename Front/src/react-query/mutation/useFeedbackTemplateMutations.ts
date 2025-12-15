import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeedbackTemplate } from '../../apis/feedbackTemplate/index';
import type { FeedbackTemplate, UpdateFeedbackTemplateRequest } from '../../apis/feedbackTemplate/types';

export const useUpdateFeedbackTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<FeedbackTemplate, Error, UpdateFeedbackTemplateRequest>({
    mutationFn: (data) => updateFeedbackTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackTemplates'] });
    },
  });
};
