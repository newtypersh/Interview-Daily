import { Stack } from '@mui/material';
import type { Control } from 'react-hook-form';
import FeedbackItemComponent from './FeedbackItem';
import type { FeedbackItem } from '../utils/feedbackMapper';
import type { FeedbackFormValues } from '../schemas/form';

type FeedbackListProps = {
  feedbackItems: FeedbackItem[];
  control: Control<FeedbackFormValues>;
  playingAudio: string | null;
  onPlayAudio: (id: string) => void;
}

export default function FeedbackList({
  feedbackItems,
  control,
  playingAudio,
  onPlayAudio,
}: FeedbackListProps) {
  return (
    <Stack spacing={4}>
      {feedbackItems.map((q, index) => (
        <FeedbackItemComponent
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
