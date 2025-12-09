import { Box, Button, Alert, Typography } from '@mui/material';
import { Mic as MicIcon, Stop as StopIcon, FiberManualRecord as RecordIcon } from '@mui/icons-material';
import type { InterviewRecording } from '../../../../types';

interface RecordingSectionProps {
  recording: InterviewRecording;
}

export default function RecordingSection({ recording }: RecordingSectionProps) {
  const { isActive, start, stop } = recording;

  if (isActive) {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
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

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<StopIcon />}
          onClick={stop}
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
      </Box>
    );
  }

  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      startIcon={<MicIcon />}
      onClick={start}
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
  );
}
