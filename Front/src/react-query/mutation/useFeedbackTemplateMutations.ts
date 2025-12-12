import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeedbackTemplate } from '../../apis/feedbackTemplate/index';
import type { FeedbackTemplateDto, UpdateFeedbackTemplateRequest } from '../../apis/feedbackTemplate/types';

export const useUpdateFeedbackTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation<FeedbackTemplateDto, Error, UpdateFeedbackTemplateRequest>({
    mutationFn: (data) => updateFeedbackTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackTemplates'] });
    },
  });
};
