import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRecordingManager } from './useRecordingManager';
import { useRecording } from '../../../../hooks/useRecording';

// Mock useRecording
vi.mock('../../../../hooks/useRecording', () => ({
  useRecording: vi.fn(),
}));

describe('useRecordingManager', () => {
  const mockReset = vi.fn();
  const mockStart = vi.fn();
  const mockStop = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    (useRecording as any).mockReturnValue({
      isRecording: false,
      recordingStopped: false,
      mediaBlobUrl: undefined,
      start: mockStart,
      stop: mockStop,
      reset: mockReset,
    });
  });

  it('should map internal recording state to returned values', () => {
    // Setup mock return values
    (useRecording as any).mockReturnValue({
      isRecording: true,
      recordingStopped: false,
      mediaBlobUrl: 'blob:url',
      start: mockStart,
      stop: mockStop,
      reset: mockReset,
    });

    const { result } = renderHook(() => useRecordingManager({ resetOnIndexChange: 0 }));

    expect(result.current.isActive).toBe(true);
    expect(result.current.isStopped).toBe(false);
    expect(result.current.mediaBlobUrl).toBe('blob:url');
    expect(result.current.start).toBe(mockStart);
    expect(result.current.stop).toBe(mockStop);
    expect(result.current.retry).toBe(mockReset);
  });

  it('should call reset when resetOnIndexChange prop changes', () => {
    const { rerender } = renderHook(
      ({ index }) => useRecordingManager({ resetOnIndexChange: index }), 
      { initialProps: { index: 0 } }
    );

    // Initial render should call reset (useEffect runs on mount)
    expect(mockReset).toHaveBeenCalledTimes(1);

    // Change index
    rerender({ index: 1 });

    // Should call reset again
    expect(mockReset).toHaveBeenCalledTimes(2);
  });

  it('should NOT call reset if resetOnIndexChange prop stays the same', () => {
    const { rerender } = renderHook(
      ({ index }) => useRecordingManager({ resetOnIndexChange: index }), 
      { initialProps: { index: 0 } }
    );

    expect(mockReset).toHaveBeenCalledTimes(1);

    // Rerender with same index
    rerender({ index: 0 });

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
