import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSnackbar } from './useSnackbar';

describe('useSnackbar', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSnackbar());

    expect(result.current.snackbarOpen).toBe(false);
    expect(result.current.snackbarMessage).toBe('');
    expect(result.current.snackbarSeverity).toBe('success');
  });

  it('should open snackbar with specified message and default severity', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.openSnackbar('Test Message');
    });

    expect(result.current.snackbarOpen).toBe(true);
    expect(result.current.snackbarMessage).toBe('Test Message');
    expect(result.current.snackbarSeverity).toBe('success');
  });

  it('should open snackbar with specified message and severity', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.openSnackbar('Error Message', 'error');
    });

    expect(result.current.snackbarOpen).toBe(true);
    expect(result.current.snackbarMessage).toBe('Error Message');
    expect(result.current.snackbarSeverity).toBe('error');
  });

  it('should close snackbar when closeSnackbar is called', () => {
    const { result } = renderHook(() => useSnackbar());

    // Open first
    act(() => {
      result.current.openSnackbar('To be closed');
    });
    expect(result.current.snackbarOpen).toBe(true);

    // Close
    act(() => {
      result.current.closeSnackbar();
    });

    expect(result.current.snackbarOpen).toBe(false);
    // Message/Severity state usually persists until next open, 
    // but the critical check is that it is closed.
  });
});
