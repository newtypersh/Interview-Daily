import { Stack } from '@mui/material';
import FeedbackItem from './FeedbackItem';
import type { Question, QuestionFeedback } from '../hooks/useFeedbackForm';

interface FeedbackListProps {
  questions: Question[];
  feedbacks: Record<string, QuestionFeedback>;
  playingAudio: string | null;
  onPlayAudio: (id: string) => void;
  onRatingChange: (id: string, rating: number | null) => void;
  onContentChange: (id: string, content: string) => void;
}

export default function FeedbackList({
  questions,
  feedbacks,
  playingAudio,
  onPlayAudio,
  onRatingChange,
  onContentChange,
}: FeedbackListProps) {
  return (
    <Stack spacing={4}>
      {questions.map((q, index) => (
        <FeedbackItem
          key={q.id}
          question={q}
          index={index}
          answer={q.transcript || '답변 내용이 없습니다.'}
          feedback={feedbacks[q.id] || { rating: 0, content: "" }}
          isPlaying={playingAudio === q.id}
          onPlayAudio={() => q.audioUrl && onPlayAudio(q.id)}
          onRatingChange={onRatingChange}
          onContentChange={onContentChange}
        />
      ))}
    </Stack>
  );
}
