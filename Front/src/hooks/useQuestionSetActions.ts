import {
  useDeleteQuestionSet,
  useUpdateQuestionSet,
} from '../react-query/mutation/useQuestionSetMutations';
import { useQuestionsQuery } from '../react-query/queries/useQuestionsQuery';
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../react-query/mutation/useQuestionMutations';

export const useQuestionSetActions = (questionSetId: string, expanded: boolean = false) => {
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuestionsQuery(
    questionSetId,
    expanded
  );

  const { mutate: createQuestion, isPending: isCreatingQuestion } = useCreateQuestion(questionSetId);
  const { mutate: updateQuestion, isPending: isUpdatingQuestion } = useUpdateQuestion(questionSetId);
  const { mutate: deleteQuestion, isPending: isDeletingQuestion } = useDeleteQuestion(questionSetId);

  const { mutate: deleteSet, isPending: isDeletingSet } = useDeleteQuestionSet();
  const { mutate: updateSet, isPending: isUpdatingSet } = useUpdateQuestionSet();

  return {
    questions,
    isLoadingQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    deleteSet: () => deleteSet(questionSetId),
    updateSet: (name: string) => updateSet({ id: questionSetId, name }),
    isCreatingQuestion,
    isUpdatingQuestion,
    isDeletingQuestion,
    isDeletingSet,
    isUpdatingSet,
  };
};
