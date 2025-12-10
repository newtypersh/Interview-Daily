import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIconButton from '../../components/DeleteIconButton';
import { QuestionSetSchema } from '../../schemas/settings';
import QuestionList from './QuestionList';
import { type QuestionSet } from '../../types';
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

interface QuestionSetItemProps {
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
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1.5,
          bgcolor: expanded ? 'grey.50' : 'transparent',
          borderRadius: 1,
        }}
      >
        <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {String(index + 1).padStart(2, '0')}
        </Typography>
        
        <TextField
          defaultValue={questionSet.name}
          variant="standard"
          fullWidth
          InputProps={{ disableUnderline: !expanded }}
          inputProps={{ sx: { fontWeight: 600 } }}
          onBlur={(e) => {
            const newName = e.target.value.trim();
            if (newName && newName !== questionSet.name) {
              const validation = QuestionSetSchema.safeParse({ name: newName });
              if (!validation.success) {
                alert(validation.error.issues[0]?.message || 'Invalid name');
                e.target.value = questionSet.name; // reset to original
                return;
              }
              handleUpdateSet(newName);
            } else if (!newName) {
                e.target.value = questionSet.name;
            }
          }}
        />
        
        <IconButton
          onClick={() => setExpanded(!expanded)}
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
        
        <DeleteIconButton onClick={handleDeleteSet} />
      </Box>

      <Collapse in={expanded} unmountOnExit>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5} sx={{ pl: 5, pr: 2, pb: 2 }}>
          <QuestionList
            questions={questions}
            onUpdate={handleUpdateQuestion}
            onDelete={handleDeleteQuestion}
            onAdd={handleAddQuestion}
          />
        </Stack>
      </Collapse>
    </Box>
  );
}
