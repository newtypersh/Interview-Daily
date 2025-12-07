import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import googleLoginButton from '../../assets/google_Login_button.svg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleGoogleLogin = () => {
    window.location.href = '/oauth2/login/google';
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 2,
          },
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'grey.500',
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ pt: 4, pb: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              textAlign: 'left',
              mb: 4,
            }}
          >
            로그인
          </Typography>

          <Box
            component="img"
            src={googleLoginButton}
            alt="구글로 로그인"
            onClick={handleGoogleLogin}
            sx={{
              width: '100%',
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
}
