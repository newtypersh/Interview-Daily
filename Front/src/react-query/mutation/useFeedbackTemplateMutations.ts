import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFeedbackTemplate } from '../../apis/feedbackTemplate/index';

export const useUpdateFeedbackTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFeedbackTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbackTemplates'] });
    },
  });
};
