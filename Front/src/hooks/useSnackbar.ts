import { useState, useCallback } from 'react';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface UseSnackbarReturn {
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: SnackbarSeverity;
  openSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  closeSnackbar: () => void;
}

export const useSnackbar = (): UseSnackbarReturn => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<SnackbarSeverity>('success');

  const openSnackbar = useCallback((message: string, severity: SnackbarSeverity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  return {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    openSnackbar,
    closeSnackbar,
  };
};
