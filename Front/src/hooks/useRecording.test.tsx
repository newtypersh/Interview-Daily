import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecording } from './useRecording';
import { useReactMediaRecorder } from 'react-media-recorder';

// Mock react-media-recorder
vi.mock('react-media-recorder', () => ({
  useReactMediaRecorder: vi.fn(),
}));

describe('useRecording', () => {
  const mockStartRecording = vi.fn();
  const mockStopRecording = vi.fn();
  const mockClearBlobUrl = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    (useReactMediaRecorder as any).mockReturnValue({
      status: 'idle',
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      mediaBlobUrl: undefined,
      clearBlobUrl: mockClearBlobUrl,
    });
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useRecording());

    expect(result.current.isRecording).toBe(false);
    expect(result.current.recordingStopped).toBe(false);
    expect(result.current.mediaBlobUrl).toBeUndefined();
    
    // Verify it calls useReactMediaRecorder with audio: true
    expect(useReactMediaRecorder).toHaveBeenCalledWith({ audio: true });
  });

  it('should reflect recording state when status is "recording"', () => {
    (useReactMediaRecorder as any).mockReturnValue({
      status: 'recording',
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      mediaBlobUrl: undefined,
      clearBlobUrl: mockClearBlobUrl,
    });

    const { result } = renderHook(() => useRecording());

    expect(result.current.isRecording).toBe(true);
    expect(result.current.recordingStopped).toBe(false);
  });

  it('should reflect stopped state when status is "stopped"', () => {
    (useReactMediaRecorder as any).mockReturnValue({
      status: 'stopped',
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      mediaBlobUrl: 'blob:some-url',
      clearBlobUrl: mockClearBlobUrl,
    });

    const { result } = renderHook(() => useRecording());

    expect(result.current.isRecording).toBe(false);
    expect(result.current.recordingStopped).toBe(true);
    expect(result.current.mediaBlobUrl).toBe('blob:some-url');
  });

  it('should call startRecording when start is called', () => {
    const { result } = renderHook(() => useRecording());

    act(() => {
      result.current.start();
    });

    expect(mockStartRecording).toHaveBeenCalled();
  });

  it('should call stopRecording when stop is called', () => {
    const { result } = renderHook(() => useRecording());

    act(() => {
      result.current.stop();
    });

    expect(mockStopRecording).toHaveBeenCalled();
  });

  it('should call clearBlobUrl when reset is called', () => {
    const { result } = renderHook(() => useRecording());

    act(() => {
      result.current.reset();
    });

    expect(mockClearBlobUrl).toHaveBeenCalled();
  });
});
