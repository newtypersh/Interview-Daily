import { useState, useCallback } from 'react';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface UseSnackbarReturn {
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
    setSnackbarSeverity(severity); // MUI Alert 컴포넌트의 색상과 아이콘 설정
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
