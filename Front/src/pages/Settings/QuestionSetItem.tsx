import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Collapse,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { QuestionSet } from '../../types';
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  deleteQuestionSet,
  updateQuestionSet,
} from '../../apis/questionSet';
import QuestionInput from './QuestionInput';

interface QuestionSetItemProps {
  questionSet: QuestionSet;
  index: number;
}

export default function QuestionSetItem({ questionSet, index }: QuestionSetItemProps) {
  const [expanded, setExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: questions = [] } = useQuery({
    queryKey: ['questions', questionSet.id],
    queryFn: () => getQuestions(questionSet.id),
    enabled: expanded,
  });

  const createQuestionMutation = useMutation({
    mutationFn: (content: string) => createQuestion(questionSet.id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSet.id] });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) =>
      updateQuestion(questionSet.id, questionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSet.id] });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionSet.id, questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', questionSet.id] });
    },
  });

  const deleteSetMutation = useMutation({
    mutationFn: () => deleteQuestionSet(questionSet.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
    },
  });

  const updateSetMutation = useMutation({
    mutationFn: (name: string) => updateQuestionSet(questionSet.id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionSets'] });
    },
  });

  const handleAddQuestion = () => {
    createQuestionMutation.mutate('새 질문');
  };

  const handleUpdateQuestion = (questionId: string, content: string) => {
    updateQuestionMutation.mutate({ questionId, content });
  };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        p: 2,
        bgcolor: 'white',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography sx={{ width: 32, color: 'text.secondary' }}>
          {index + 1}.
        </Typography>
        <TextField
          defaultValue={questionSet.name}
          size="small"
          fullWidth
          onBlur={(e) => {
            const newName = e.target.value.trim();
            if (newName && newName !== questionSet.name) {
              updateSetMutation.mutate(newName);
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
        <IconButton onClick={() => deleteSetMutation.mutate()} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={1.5}>
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
                onClick={() => deleteQuestionMutation.mutate(question.id)}
                sx={{ mt: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            sx={{
              borderStyle: 'dashed',
              mt: 1,
            }}
          >
            질문 추가
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
}
