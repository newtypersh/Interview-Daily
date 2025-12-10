import { Box, Stack, Typography } from '@mui/material';
import AddButton from './components/AddButton';
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
        <Box
          key={category.id}
          sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, bgcolor: 'white' }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            {category.title}
          </Typography>

          <Stack spacing={2}>
            {questionSets
              .filter((set) => set.category === category.id)
              .map((set, index) => (
                <QuestionSetItem key={set.id} questionSet={set} index={index} />
              ))}
            <AddButton onClick={() => handleAddQuestionSet(category.id)}>
              질문세트 추가하기
            </AddButton>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
