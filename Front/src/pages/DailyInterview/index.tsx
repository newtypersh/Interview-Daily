import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Mic as MicIcon,
  Replay as ReplayIcon,
  NavigateNext as NavigateNextIcon,
  FiberManualRecord as RecordIcon,
  Stop as StopIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import type { Question } from '../../types';

// Mock data for demonstration
const mockQuestions: Question[] = [
  { id: '1', content: '1분 자기소개 시작해주세요', order: 1 },
  { id: '2', content: '만일 1분 자기소개에서 말한 1번째 경험을 어떻게 진행했었나요?', order: 2 },
];

export default function DailyInterview() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingStopped(false);
    // TODO: Implement actual recording logic
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingStopped(true);
    // TODO: Save recording
  };

  const handleRetry = () => {
    setIsRecording(false);
    setRecordingStopped(false);
    // TODO: Reset recording
  };

  const handlePrevQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsRecording(false);
      setRecordingStopped(false);
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsRecording(false);
      setRecordingStopped(false);
    }
  };

  const handleSubmit = () => {
    // Save current answer
    setAnswers({ ...answers, [currentQuestion.id]: 'Recorded answer' });

    if (isLastQuestion) {
      // Navigate to feedback page
      navigate('/daily-interview/feedback');
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsRecording(false);
      setRecordingStopped(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 3,
          }}
        >
          {/* Question Counter with Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, gap: 2 }}>
            <IconButton
              onClick={handlePrevQuestion}
              disabled={isFirstQuestion}
              sx={{
                color: '#667eea',
                '&:disabled': {
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Chip
              label={`질문 ${currentQuestionIndex + 1} / ${mockQuestions.length}`}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <IconButton
              onClick={handleNextQuestion}
              disabled={isLastQuestion}
              sx={{
                color: '#667eea',
                '&:disabled': {
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Question */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: '#f5f5f5',
              p: { xs: 3, md: 4 },
              mb: 4,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#667eea',
                mb: 2,
              }}
            >
              질문
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#1f2937',
                fontWeight: 500,
              }}
            >
              {currentQuestion.content}
            </Typography>
          </Paper>

          {/* Recording Section */}
          <Stack spacing={3}>
            {!isRecording && !recordingStopped ? (
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<MicIcon />}
                onClick={handleStartRecording}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                녹음 시작
              </Button>
            ) : isRecording ? (
              <>
                {/* Recording Indicator */}
                <Alert
                  icon={<RecordIcon sx={{ animation: 'pulse 1.5s infinite' }} />}
                  severity="error"
                  sx={{
                    '& .MuiAlert-icon': {
                      color: '#dc2626',
                    },
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    녹음 중...
                  </Typography>
                </Alert>

                {/* Stop Recording Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<StopIcon />}
                  onClick={handleStopRecording}
                  sx={{
                    bgcolor: '#dc2626',
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#b91c1c',
                    },
                  }}
                >
                  녹음 완료
                </Button>
              </>
            ) : (
              <>
                {/* Answer Section */}
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: '#f9fafb',
                    p: 3,
                    borderRadius: 2,
                  }}
                >
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        질문
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {currentQuestion.content}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        답변
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: 'white',
                          p: 2,
                          minHeight: 100,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                          녹음된 답변이 여기에 표시됩니다...
                        </Typography>
                      </Paper>
                    </Box>
                  </Stack>
                </Paper>

                {/* Action Buttons */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<ReplayIcon />}
                    onClick={handleRetry}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#667eea',
                        bgcolor: 'rgba(102, 126, 234, 0.04)',
                      },
                    }}
                  >
                    다시 녹음하기
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={!isLastQuestion && <NavigateNextIcon />}
                    onClick={handleSubmit}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      },
                    }}
                  >
                    {isLastQuestion ? '피드백 작성하기' : '다음 질문'}
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
