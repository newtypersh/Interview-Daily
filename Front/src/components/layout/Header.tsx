import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Divider,
  Button,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  AccountCircle as AccountCircleIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import LoginModal from '../auth/LoginModal';
import { useAuth } from '../../hooks/useAuth.ts';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: isLoggedIn } = useAuth();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <PsychologyIcon
              sx={{
                display: 'flex',
                mr: 1,
                color: '#667eea',
                fontSize: 32,
              }}
            />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
                flexGrow: 1,
              }}
            >
              Interview Daily
            </Typography>

            {isLoggedIn ? (
              <Box>
                <IconButton
                  size="large"
                  onClick={handleMenuOpen}
                  sx={{
                    color: '#667eea',
                  }}
                >
                  <AccountCircleIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    mt: 1,
                  }}
                >
                  <MenuItem onClick={() => handleNavigate('/history')}>
                    <HistoryIcon sx={{ mr: 1.5, color: '#667eea' }} />
                    기록 보기
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigate('/settings')}>
                    <SettingsIcon sx={{ mr: 1.5, color: '#667eea' }} />
                    설정
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1.5, color: '#667eea' }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={handleLoginClick}
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
                로그인
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLoginSuccess}
      />
    </>
  );
}
