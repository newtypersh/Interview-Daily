import { Stack } from '@mui/material';
import ContentBox from '../../components/ContentBox';
import SettingsList from './components/SettingsList';
import { CATEGORY_LIST, INTERVIEW_CATEGORIES } from '../../constants/interview';
import { useCreateQuestionSet } from '../../react-query/mutation/useQuestionSetMutations';
import { useQuestionSetsQuery } from '../../react-query/queries/useQuestionSetsQuery';
import QuestionSetItem from './QuestionSetItem';

export default function QuestionSetSection() {
  const { data: questionSets = [] } = useQuestionSetsQuery();
  const { mutate: createQuestionSet } = useCreateQuestionSet();

  const handleAddQuestionSet = (category: keyof typeof INTERVIEW_CATEGORIES) => {
    createQuestionSet({ category, name: '새 질문세트' });
  };

  return (
    <Stack spacing={4}>
      {CATEGORY_LIST.map((category) => (
        <ContentBox key={category.id} title={category.title}>
          <SettingsList
            data={questionSets.filter((set) => set.category === category.id)}
            renderItem={(set, index) => (
              <QuestionSetItem key={set.id} questionSet={set} index={index} />
            )}
            onAdd={() => handleAddQuestionSet(category.id)}
            addButtonLabel="질문세트 추가하기"
            gap={2}
          />
        </ContentBox>
      ))}
    </Stack>
  );
}
