import { useState } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';

export interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export function CustomSnackbar({ open, message, severity, onClose }: CustomSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const showSnackbar = (message: string, severity: AlertColor = 'success') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  return {
    open,
    message,
    severity,
    showSnackbar,
    closeSnackbar,
  };
}
