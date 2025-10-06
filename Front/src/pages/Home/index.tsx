import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import LoginModal from '../../components/auth/LoginModal';

interface HomeProps {
  isLoggedIn: boolean;
  onLogin: () => void;
}

export default function Home({ isLoggedIn, onLogin }: HomeProps) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDailyInterviewClick = () => {
    navigate('/daily-interview');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {!isLoggedIn ? (
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <PsychologyIcon sx={{ fontSize: 100, color: '#667eea', mb: 3 }} />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Interview Daily
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              매일 성장하는 당신의 면접 파트너
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Stack spacing={4} alignItems="center">
              <PsychologyIcon sx={{ fontSize: 100, color: '#667eea' }} />
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#1f2937',
                }}
              >
                오늘의 면접을 시작해보세요
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleDailyInterviewClick}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 6,
                  py: 2,
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                    boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)',
                  },
                }}
              >
                데일리 인터뷰
              </Button>
            </Stack>
          </Box>
        )}
      </Container>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={onLogin}
      />
    </Box>
  );
}
