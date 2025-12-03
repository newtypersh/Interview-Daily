import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFeedbackTemplates } from '../../apis/feedbackTemplate';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Collapse,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Shuffle as ShuffleIcon,
  TouchApp as TouchAppIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

interface Question {
  id: string;
  text: string;
}

interface QuestionSetSelection {
  id: string;
  name: string;
  questions: Question[];
  expanded?: boolean;
}

interface FeedbackTemplate {
  type: 'job_competency' | 'personality' | 'motivation';
  title: string;
  content: string;
}

// Mock data
const initialQuestionSets = {
  job_competency: [
    {
      id: '1',
      name: '질문세트1',
      questions: [
        { id: '1-1', text: '1분 자기소개 시작해주세요' },
        { id: '1-2', text: '방금 1분 자기소개에서 말한 1번째 경험을 어떻게 진행했나요?' },
      ],
      expanded: false,
    },
    {
      id: '2',
      name: '질문세트2',
      questions: [
        { id: '2-1', text: '본인의 강점을 설명해주세요' },
      ],
      expanded: false,
    },
  ],
  personality: [
    {
      id: '3',
      name: '질문세트1',
      questions: [
        { id: '3-1', text: '팀원과 갈등이 있었던 경험을 말씀해주세요' },
      ],
      expanded: false,
    },
    {
      id: '4',
      name: '질문세트2',
      questions: [
        { id: '4-1', text: '스트레스를 어떻게 해소하시나요?' },
      ],
      expanded: false,
    },
  ],
  motivation: [
    {
      id: '5',
      name: '질문세트1',
      questions: [
        { id: '5-1', text: '우리 회사에 지원한 이유는 무엇인가요?' },
      ],
      expanded: false,
    },
    {
      id: '6',
      name: '질문세트2',
      questions: [
        { id: '6-1', text: '5년 후 본인의 모습은 어떨 것 같나요?' },
      ],
      expanded: false,
    },
  ],
};

const initialTemplates: FeedbackTemplate[] = [
  {
    type: 'job_competency',
    title: '직무 역량 면접',
    content: '## 1. 질문에 대해 들었을 때 무엇을 답변해야 하고 있나요?\n## 2. 질문에 대해 내용을 정리한 경험에 기반하여 리드했던 내용이 있나요?\n## 3. 질문에 대해 주변 수구팀 이외 것이 있나요?'
  },
  {
    type: 'personality',
    title: '인성면접',
    content: '## 1. 질문에 대해 타인이 고워하던 경험을 거라 무릇 수 있나요?\n## 2. 이해가지 않아진 일을 타타이 타타이 타타에 수경이 이성비의 홀려량을 홀래요?\n## 3. 질문에 대해 타타 타타 타타마 본 구해한 경험을 하고 있다면 있나요?'
  },
  {
    type: 'motivation',
    title: '지원동기 면접',
    content: '## 1. 단지에 가기/타타에 타타 보서이 소자이을 끊게 할 발생양니까?\n## 2. 본디의 끊었을 직타인 본류학의 타타마니까?\n## 3. 타타에 구끊스수로 잘 실명하니까?'
  },
];

export default function Settings() {
  const [questionSets, setQuestionSets] = useState(initialQuestionSets);
  const [templates, setTemplates] = useState<FeedbackTemplate[]>(initialTemplates);

  const { data: fetchedTemplates } = useQuery({
    queryKey: ['feedbackTemplates'],
    queryFn: getFeedbackTemplates,
  });

  useEffect(() => {
    if (fetchedTemplates) {
      const mappedTemplates: FeedbackTemplate[] = fetchedTemplates.map((t) => {
        let type: FeedbackTemplate['type'] = 'job_competency';
        let title = '직무 역량 면접';

        if (t.category === 'JOB') {
          type = 'job_competency';
          title = '직무 역량 면접';
        } else if (t.category === 'PERSONAL') {
          type = 'personality';
          title = '인성면접';
        } else if (t.category === 'MOTIVATION') {
          type = 'motivation';
          title = '지원동기 면접';
        }

        return {
          type,
          title,
          content: t.templateText || '',
        };
      });
      
      // Sort to match the order: job, personality, motivation
      const order = ['job_competency', 'personality', 'motivation'];
      mappedTemplates.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

      setTemplates(mappedTemplates);
    }
  }, [fetchedTemplates]);
  const [activeTab, setActiveTab] = useState(0);
  // 전체 질문세트 중 선택 모드 및 선택된 질문세트
  const [selectionMode, setSelectionMode] = useState<'random' | 'choice'>('choice');
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<{
    category: keyof typeof questionSets | null;
    setId: string | null;
  }>({
    category: 'job_competency',
    setId: '1',
  });

  const handleQuestionSetSelect = (
    category: keyof typeof questionSets,
    id: string
  ) => {
    if (selectionMode === 'choice') {
      // 선택 모드: 전체에서 하나만 선택 가능
      // 같은 질문세트를 다시 클릭하면 선택 해제
      if (selectedQuestionSet.category === category && selectedQuestionSet.setId === id) {
        setSelectedQuestionSet({ category: null, setId: null });
      } else {
        setSelectedQuestionSet({ category, setId: id });
      }
    }
    // random 모드에서는 선택 불가
  };

  const handleTemplateChange = (type: FeedbackTemplate['type'], content: string) => {
    setTemplates(
      templates.map((template) =>
        template.type === type ? { ...template, content } : template
      )
    );
  };

  const handleSelectionModeChange = (mode: 'random' | 'choice') => {
    setSelectionMode(mode);
    // 랜덤 모드로 변경하면 선택 해제
    if (mode === 'random') {
      setSelectedQuestionSet({ category: null, setId: null });
    }
  };

  const handleAddQuestionSet = (category: keyof typeof questionSets) => {
    const newId = String(Date.now());
    const newSetNumber = questionSets[category].length + 1;
    setQuestionSets({
      ...questionSets,
      [category]: [
        ...questionSets[category],
        {
          id: newId,
          name: `질문세트${newSetNumber}`,
          questions: [],
          expanded: false,
        },
      ],
    });
  };

  const handleToggleExpand = (category: keyof typeof questionSets, id: string) => {
    setQuestionSets({
      ...questionSets,
      [category]: questionSets[category].map((set) =>
        set.id === id ? { ...set, expanded: !set.expanded } : set
      ),
    });
  };

  const handleAddQuestion = (category: keyof typeof questionSets, setId: string) => {
    const newQuestionId = `${setId}-${Date.now()}`;
    setQuestionSets({
      ...questionSets,
      [category]: questionSets[category].map((set) =>
        set.id === setId
          ? {
              ...set,
              questions: [
                ...set.questions,
                { id: newQuestionId, text: '' },
              ],
            }
          : set
      ),
    });
  };

  const handleDeleteQuestion = (
    category: keyof typeof questionSets,
    setId: string,
    questionId: string
  ) => {
    setQuestionSets({
      ...questionSets,
      [category]: questionSets[category].map((set) =>
        set.id === setId
          ? {
              ...set,
              questions: set.questions.filter((q) => q.id !== questionId),
            }
          : set
      ),
    });
  };

  const handleQuestionTextChange = (
    category: keyof typeof questionSets,
    setId: string,
    questionId: string,
    text: string
  ) => {
    setQuestionSets({
      ...questionSets,
      [category]: questionSets[category].map((set) =>
        set.id === setId
          ? {
              ...set,
              questions: set.questions.map((q) =>
                q.id === questionId ? { ...q, text } : q
              ),
            }
          : set
      ),
    });
  };

  const renderQuestionCategory = (
    category: keyof typeof questionSets,
    title: string
  ) => {
    const isChoiceMode = selectionMode === 'choice';

    return (
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, bgcolor: 'white' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>

        <Stack spacing={2}>
          {questionSets[category].map((set, index) => {
            const isSelected =
              selectedQuestionSet.category === category &&
              selectedQuestionSet.setId === set.id;

            return (
              <Box
                key={set.id}
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
                    value={set.name}
                    size="small"
                    fullWidth
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                  {isChoiceMode && (
                    <Chip
                      label={isSelected ? '선택됨' : '선택'}
                      onClick={() => handleQuestionSetSelect(category, set.id)}
                      color={isSelected ? 'warning' : 'default'}
                      icon={isSelected ? <CheckIcon /> : undefined}
                      sx={{
                        minWidth: 90,
                        fontWeight: 500,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: isSelected ? 'warning.main' : 'action.hover',
                        },
                      }}
                    />
                  )}
                  <IconButton
                    onClick={() => handleToggleExpand(category, set.id)}
                    sx={{
                      transform: set.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>

                <Collapse in={set.expanded}>
                  <Divider sx={{ mb: 2 }} />

                  {/* 질문 목록 */}
                  <Stack spacing={1.5}>
                    {set.questions.map((question, qIndex) => (
                      <Box key={question.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <Typography sx={{ minWidth: 24, pt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                          {qIndex + 1}.
                        </Typography>
                        <TextField
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionTextChange(category, set.id, question.id, e.target.value)
                          }
                          placeholder="질문을 입력하세요"
                          size="small"
                          fullWidth
                          multiline
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteQuestion(category, set.id, question.id)}
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
                      onClick={() => handleAddQuestion(category, set.id)}
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
          })}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => handleAddQuestionSet(category)}
            sx={{
              borderStyle: 'dashed',
              borderWidth: 2,
              color: 'text.secondary',
              borderColor: 'divider',
              '&:hover': {
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: 'text.secondary',
              },
            }}
          >
            질문세트 추가하기
          </Button>
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
              },
            }}
          >
            <Tab label="질문 설정" />
            <Tab label="피드백 템플릿 설정" />
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 6 } }}>
            {activeTab === 0 ? (
              <>
                {/* 전체 질문 선택 방식 */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                  <ToggleButtonGroup
                    value={selectionMode}
                    exclusive
                    onChange={(_, newMode) => {
                      if (newMode !== null) {
                        handleSelectionModeChange(newMode);
                      }
                    }}
                    size="medium"
                  >
                    <ToggleButton value="choice" sx={{ px: 4 }}>
                      <TouchAppIcon sx={{ mr: 1 }} />
                      선택
                    </ToggleButton>
                    <ToggleButton value="random" sx={{ px: 4 }}>
                      <ShuffleIcon sx={{ mr: 1 }} />
                      랜덤
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Stack spacing={4}>
                  {renderQuestionCategory('job_competency', '직무 역량 면접')}
                  {renderQuestionCategory('personality', '인성면접')}
                  {renderQuestionCategory('motivation', '지원동기 면접')}
                </Stack>
              </>
            ) : (
              <Stack spacing={4}>
                {templates.map((template) => (
                  <Box key={template.type} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, bgcolor: 'white' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      {template.title}
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      {/* 편집기 */}
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          편집
                        </Typography>
                        <TextField
                          multiline
                          fullWidth
                          value={template.content}
                          onChange={(e) => handleTemplateChange(template.type, e.target.value)}
                          placeholder="마크다운 형식으로 작성하세요..."
                          sx={{
                            flex: 1,
                            '& .MuiInputBase-root': {
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                              height: '480px',
                              alignItems: 'flex-start',
                              padding: '16px',
                            },
                            '& .MuiInputBase-input': {
                              height: '100% !important',
                              overflow: 'auto !important',
                              padding: '0 !important',
                            },
                          }}
                        />
                      </Box>

                      {/* 미리보기 */}
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          미리보기
                        </Typography>
                        <Box
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            p: 2,
                            height: 'calc(480px - 2px)',
                            overflowY: 'auto',
                            bgcolor: '#fcfcfc',
                            boxSizing: 'border-box',
                            '& h1, & h2, & h3': {
                              fontWeight: 600,
                              mt: 2,
                              mb: 1,
                            },
                            '& h1': {
                              fontSize: '1.5rem',
                            },
                            '& h2': {
                              fontSize: '1.25rem',
                            },
                            '& h3': {
                              fontSize: '1.1rem',
                            },
                            '& p': {
                              mb: 1,
                            },
                            '& ul, & ol': {
                              pl: 3,
                              mb: 1,
                            },
                            '& li': {
                              mb: 0.5,
                            },
                          }}
                        >
                          <ReactMarkdown>{template.content}</ReactMarkdown>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
