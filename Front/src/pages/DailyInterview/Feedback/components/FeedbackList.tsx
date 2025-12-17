import { Stack } from '@mui/material';
import type { Control } from 'react-hook-form';
import FeedbackItem from './FeedbackItem';
import type { FeedbackQuestion } from '../utils/feedbackMapper';
import type { FeedbackFormValues } from '../schemas/form';

type FeedbackListProps = {
  questions: FeedbackQuestion[];
  control: Control<FeedbackFormValues>;
  playingAudio: string | null;
  onPlayAudio: (id: string) => void;
}

export default function FeedbackList({
  questions,
  control,
  playingAudio,
  onPlayAudio,
}: FeedbackListProps) {
  return (
    <Stack spacing={4}>
      {questions.map((q, index) => (
        <FeedbackItem
          key={q.id}
          question={q}
          index={index}
          answer={q.transcript || '답변 내용이 없습니다.'}
          control={control}
          isPlaying={playingAudio === q.id}
          onPlayAudio={() => q.audioUrl && onPlayAudio(q.id)}
        />
      ))}
    </Stack>
  );
}
