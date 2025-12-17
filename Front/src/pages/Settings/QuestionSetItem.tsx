import { useState } from 'react';
import { Divider, Stack } from '@mui/material';
import { QuestionSetNameSchema, QuestionContentStringSchema } from '../../schemas/settings';
import SettingsList from './components/SettingsList';
import SettingsItem from './components/SettingsItem';
import { type QuestionSet } from '../../schemas/questionSet';
import {
  useUpdateQuestionSet,
  useDeleteQuestionSet,
} from '../../react-query/mutation/useQuestionSetMutations';
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../../react-query/mutation/useQuestionMutations';
import { useQuestionsQuery } from '../../react-query/queries/useQuestionsQuery';

type QuestionSetItemProps = {
  questionSet: QuestionSet;
  index: number;
}

export default function QuestionSetItem({ questionSet, index }: QuestionSetItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { mutate: updateSet } = useUpdateQuestionSet();
  const { mutate: deleteSet } = useDeleteQuestionSet();

  // Questions logic
  const { data: questions = [] } = useQuestionsQuery(questionSet.id, expanded);

  const { mutate: createQuestion } = useCreateQuestion(questionSet.id);
  const { mutate: updateQuestion } = useUpdateQuestion(questionSet.id);
  const { mutate: deleteQuestion } = useDeleteQuestion(questionSet.id);

  const handleUpdateSet = (name: string) => {
    // Validation is now handled by SettingsItem UI, but we keep a check or just update
    updateSet({ id: questionSet.id, name });
  };

  const handleDeleteSet = () => {
    if (confirm('정말로 이 질문 세트를 삭제하시겠습니까?')) {
      deleteSet(questionSet.id);
    }
  };

  const handleAddQuestion = () => {
    createQuestion('새 질문');
  };

  const handleUpdateQuestion = (id: string | number, content: string) => {
    updateQuestion({ questionId: String(id), content });
  };

  const handleDeleteQuestion = (id: string) => {
    deleteQuestion(id);
  };

  return (
      <SettingsItem
      index={index}
      value={questionSet.name}
      onUpdate={handleUpdateSet}
      onDelete={handleDeleteSet}
      expanded={expanded}
      onExpandToggle={() => setExpanded(!expanded)}
      options={{
        validationSchema: QuestionSetNameSchema,
        placeholder: "질문 세트 이름"
      }}
    >
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.5} sx={{ pl: 5, pr: 2, pb: 2 }}>
        <SettingsList
          data={questions}
          renderItem={(question, index) => (
            <SettingsItem
              key={question.id}
              index={index}
              value={question.content || ''}
              onUpdate={(val) => handleUpdateQuestion(question.id, val)}
              onDelete={() => handleDeleteQuestion(question.id)}
              options={{
                validationSchema: QuestionContentStringSchema,
                placeholder: "질문을 입력하세요"
              }}
            />
          )}
          onAdd={handleAddQuestion}
          addButtonLabel="질문 추가"
          addButtonSx={{ mt: 1 }}
        />
      </Stack>
    </SettingsItem>
  );
}
