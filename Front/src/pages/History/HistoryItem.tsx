import { Paper, Box, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { InterviewHistoryItem } from '../../schemas/history';

type HistoryItemProps = {
  interview: InterviewHistoryItem;
}

export default function HistoryItem({ interview }: HistoryItemProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) => theme.shadows[2],
        },
        transition: 'all 0.2s',
        cursor: 'pointer',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {format(new Date(interview.createdAt), 'yyyy년 MM월 dd일 HH:mm')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            질문 {interview.questionCount}개
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
            {interview.totalScore}점
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
