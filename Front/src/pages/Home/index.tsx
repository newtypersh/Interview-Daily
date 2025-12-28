import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import LoginModal from '../../components/auth/LoginModal';
import { useAuth } from '../../hooks/useAuth.ts';

export default function Home() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: isLoggedIn = false, isPending, refetch } = useAuth();

  // 로그인 성공 후 리다이렉트 처리 로직
  useEffect(() => {
    const isSuccess = searchParams.get('success');

    if (isSuccess === 'true') {
      refetch().then(() => {
        navigate('/', { replace: true });
      });
    }

  }, [searchParams, refetch, navigate]);

  const handleDailyInterviewClick = () => {
    navigate('/daily-interview');
  };

  // 로딩 중일 때 깜빡임 방지
  if (isPending) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
            }}
          >
            <Stack spacing={4} alignItems="center">
              <PsychologyIcon sx={{ fontSize: 100, color: '#667eea' }} />
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
        onLogin={() => setLoginModalOpen(false)}
      />
    </Box>
  );
}
