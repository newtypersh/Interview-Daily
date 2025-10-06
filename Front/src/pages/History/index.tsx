import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Rating,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import type { InterviewSession } from '../../types';

// Mock data
const mockHistory: InterviewSession[] = [
  {
    id: '1',
    date: '9/11',
    questionSetId: '1',
    questionSetName: '질문세트1',
    questionSetType: '지원동기 면접',
    answers: [
      {
        id: 'a1',
        questionId: 'q1',
        content: '저는 프론트엔드 개발자로서 3년간 React와 TypeScript를 활용한 웹 애플리케이션 개발 경험을 쌓았습니다. 주로 사용자 경험 개선과 성능 최적화에 집중하여 프로젝트를 진행해왔습니다.',
        createdAt: '2024-09-11T10:00:00Z',
      },
    ],
    feedbacks: [
      {
        id: 'f1',
        answerId: 'a1',
        satisfaction: 'satisfied',
        content: `## 긍정적인 부분
- 답변이 명확하고 구체적이었습니다
- 기술 스택을 정확히 명시했습니다
- 경력 기간을 구체적으로 언급했습니다

## 개선할 점
- 구체적인 프로젝트 예시를 추가하면 더 좋을 것 같습니다
- 성과나 결과를 수치로 표현하면 더욱 인상적일 것입니다`,
      },
    ],
  },
  {
    id: '2',
    date: '9/10',
    questionSetId: '1',
    questionSetName: '질문세트1',
    questionSetType: '지원동기 면접',
    answers: [
      {
        id: 'a2',
        questionId: 'q2',
        content: '팀 프로젝트에서 리더 역할을 맡아 5명의 팀원들과 함께 2개월 동안 전자상거래 플랫폼을 개발했습니다.',
        createdAt: '2024-09-10T10:00:00Z',
      },
    ],
    feedbacks: [
      {
        id: 'f2',
        answerId: 'a2',
        satisfaction: 'unsatisfied',
        content: `## 아쉬운 점
1. 리더로서 구체적으로 어떤 역할을 했는지 명확하지 않습니다
2. 프로젝트 진행 과정에서 발생한 문제와 해결 방법이 없습니다
3. 최종 성과나 결과가 언급되지 않았습니다

## 다음에 시도해볼 것
- STAR 기법 활용 (상황, 과제, 행동, 결과)
- 구체적인 수치와 성과 언급
- 개인의 기여도를 명확히 표현`,
      },
    ],
  },
];

export default function History() {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', py: 8 }}>
      <Container maxWidth="lg">
        {/* History List */}
        <Stack spacing={2}>
          {mockHistory.map((session) => (
            <Accordion
              key={session.id}
              expanded={expanded === session.id}
              onChange={handleAccordionChange(session.id)}
              sx={{
                border: '1px solid #e0e0e0',
                '&:before': { display: 'none' },
                borderRadius: '12px !important',
                overflow: 'hidden',
              }}
            >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: '#fafafa',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    px: 3,
                    py: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      mr: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {session.date}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {session.questionSetName}
                      </Typography>
                    </Box>
                    <Chip
                      label={session.questionSetType}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 3 }}>
                  <Stack spacing={4}>
                    {session.answers.map((answer, index) => {
                      const feedback = session.feedbacks.find(
                        (f) => f.answerId === answer.id
                      );

                      return (
                        <Paper
                          key={answer.id}
                          elevation={0}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: { xs: 3, md: 4 },
                          }}
                        >
                          <Stack spacing={3}>
                            {/* Question */}
                            <Box>
                              <Chip
                                label={`질문 ${index + 1}`}
                                size="small"
                                sx={{
                                  mb: 1,
                                  bgcolor: '#f3f4f6',
                                  color: '#667eea',
                                  fontWeight: 600,
                                }}
                              />
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1f2937',
                                }}
                              >
                                질문 내용이 여기에 표시됩니다
                              </Typography>
                            </Box>

                            <Divider />

                            {/* My Answer */}
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  나의 답변
                                </Typography>
                                <IconButton
                                  sx={{
                                    color: '#667eea',
                                  }}
                                >
                                  <PlayArrowIcon />
                                </IconButton>
                              </Box>
                              <Paper
                                elevation={0}
                                sx={{
                                  bgcolor: '#f9fafb',
                                  p: 2,
                                  borderRadius: 1,
                                }}
                              >
                                <Typography variant="body2" color="text.secondary">
                                  {answer.content}
                                </Typography>
                              </Paper>
                            </Box>

                            <Divider />

                            {/* Rating */}
                            {feedback && (
                              <>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    만족도
                                  </Typography>
                                  <Rating
                                    value={feedback.satisfaction === 'satisfied' ? 5 : 1}
                                    readOnly
                                    size="large"
                                    sx={{
                                      '& .MuiRating-iconFilled': {
                                        color: '#667eea',
                                      },
                                    }}
                                  />
                                </Box>

                                {/* Feedback Text */}
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    피드백
                                  </Typography>
                                  <Box
                                    sx={{
                                      bgcolor: '#f9fafb',
                                      p: 2,
                                      borderRadius: 1,
                                      '& h1, & h2, & h3': {
                                        fontWeight: 600,
                                        mt: 2,
                                        mb: 1,
                                      },
                                      '& p': {
                                        mb: 1,
                                      },
                                      '& ul, & ol': {
                                        pl: 3,
                                        mb: 1,
                                      },
                                    }}
                                  >
                                    <ReactMarkdown>{feedback.content}</ReactMarkdown>
                                  </Box>
                                </Box>
                              </>
                            )}
                          </Stack>
                        </Paper>
                      );
                    })}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
        </Stack>

        {/* Empty State */}
        {mockHistory.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              아직 면접 기록이 없습니다.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
