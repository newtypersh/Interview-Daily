import { useState, useEffect } from 'react';
import { Box, Container, Paper, Button } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import FeedbackHeader from './FeedbackHeader';
import FeedbackTemplateGuide from './FeedbackTemplateGuide';
import FeedbackItemLegacy from './FeedbackItemLegacy';
import type { FeedbackItem } from '../utils/feedbackMapper';
import { useRenderCount } from '../../../../hooks/useRenderCount';

type LegacyState = Record<string, { rating: number; content: string }>;

type FeedbackLayoutLegacyProps = {
  feedbackItems: FeedbackItem[];
  templateContent?: string;
  category?: string;
  playingAudio: string | null;
  onPlayAudio: (url: string) => void;
  // Legacy는 제출 로직은 구현하지 않음 (렌더링 테스트용)
}

export default function FeedbackLayoutLegacy({
  feedbackItems,
  templateContent,
  category,
  playingAudio,
  onPlayAudio,
}: FeedbackLayoutLegacyProps) {
  useRenderCount('FeedbackLayoutLegacy');

  // 단일 State로 모든 입력 관리 (비효율적 패턴)
  const [feedbacks, setFeedbacks] = useState<LegacyState>({});

  // 초기값 설정
  useEffect(() => {
    const initial: LegacyState = {};
    feedbackItems.forEach(item => {
      initial[item.id] = { rating: 0, content: templateContent || '' };
    });
    setFeedbacks(initial);
  }, [feedbackItems, templateContent]);

  const handleRatingChange = (id: string, rating: number | null) => {
    setFeedbacks(prev => ({
      ...prev,
      [id]: { ...prev[id], rating: rating || 0 }
    }));
  };

  const handleContentChange = (id: string, content: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [id]: { ...prev[id], content }
    }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff0f0', py: 6 }}> {/* 구분을 위해 배경색 살짝 변경 */}
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, border: '2px solid #ff6b6b' }}>
          <FeedbackHeader />
          <FeedbackTemplateGuide content={templateContent} category={category} />

          <Box sx={{ mb: 6 }}>
            {feedbackItems.map((item, index) => (
              <Box key={item.id} sx={{ mb: 4 }}>
                <FeedbackItemLegacy
                  question={item}
                  index={index}
                  answer={item.transcript || ''}
                  // State에서 값 꺼내오기
                  rating={feedbacks[item.id]?.rating || 0}
                  content={feedbacks[item.id]?.content || ''}
                  // 핸들러 전달
                  onRatingChange={(val) => handleRatingChange(item.id, val)}
                  onContentChange={(val) => handleContentChange(item.id, val)}
                  
                  isPlaying={playingAudio === item.id}
                  onPlayAudio={onPlayAudio}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 6 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
              onClick={() => alert('Legacy 모드입니다. 렌더링 횟수만 확인하세요!')}
              sx={{
                bgcolor: '#ff6b6b',
                py: 2,
                fontSize: '1.125rem',
                fontWeight: 600,
                '&:hover': { bgcolor: '#fa5252' },
              }}
            >
              [Legacy] 렌더링 테스트 중...
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
