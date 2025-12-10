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
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DashedButton from '../../components/DashedButton';
import { QuestionSetSchema } from '../../schemas/settings';
import QuestionInput from './QuestionInput';
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
  // Fetch questions only when expanded or to show count?
  // If we want to show count in header, we need to fetch. 
  // For now, let's fetch when expanded to save resources if list is long, 
  // unless we want to preload. 
  // Given "expanded" is false by default.
  // Actually, 'QuestionSet' type has 'questions' array. If it's populated, we use it.
  // But 'useQuestionsQuery' is the source of truth for the *latest* questions if they change.
  // Let's use the query.
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
        
        <IconButton onClick={handleDeleteSet} color="error" size="small">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded} unmountOnExit>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5} sx={{ pl: 5, pr: 2, pb: 2 }}>
          {questions.map((question, qIndex) => (
            <Box key={question.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Typography sx={{ minWidth: 24, pt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                {qIndex + 1}.
              </Typography>
              <QuestionInput
                id={question.id}
                initialText={question.content}
                onUpdate={handleUpdateQuestion}
              />
              <IconButton
                size="small"
                onClick={() => handleDeleteQuestion(question.id)}
                sx={{ mt: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <DashedButton
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            sx={{
              mt: 1,
              mx: 'auto',
              width: 'fit-content'
            }}
          >
            질문 추가
          </DashedButton>
        </Stack>
      </Collapse>
    </Box>
  );
}
