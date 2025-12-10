import { Box, Typography } from '@mui/material';
import AddButton from './components/AddButton';
import DeleteIconButton from '../../components/DeleteIconButton';
import QuestionInput from './QuestionInput';
import { type Question } from '../../types';

interface QuestionListProps {
  questions: Question[];
  onUpdate: (id: string | number, content: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function QuestionList({ questions, onUpdate, onDelete, onAdd }: QuestionListProps) {
  return (
    <>
      {questions.map((question, index) => (
        <Box
          key={question.id}
          sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
        >
          <Typography
            sx={{
              minWidth: 24,
              pt: 1,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            {index + 1}.
          </Typography>
          <QuestionInput
            id={question.id}
            initialText={question.content}
            onUpdate={onUpdate}
          />
          <DeleteIconButton
            onClick={() => onDelete(question.id)}
            sx={{ mt: 0.5 }}
          />
        </Box>
      ))}
      <AddButton onClick={onAdd} sx={{ mt: 1 }}>
        질문 추가
      </AddButton>
    </>
  );
}
