import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInterviewFinisher } from './useInterviewFinisher';
import { useInterviewCompletion } from '../../../../react-query/mutation/DailyInterview/useInterviewCompletion';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../../../react-query/mutation/DailyInterview/useInterviewCompletion', () => ({
  useInterviewCompletion: vi.fn(),
}));

describe('useInterviewFinisher', () => {
  const mockNavigate = vi.fn();
  const mockComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockReturnValue(mockNavigate);
    
    // Default mock for mutation
    (useInterviewCompletion as any).mockReturnValue({
      complete: mockComplete,
      isCompleting: false,
    });
  });

  it('should return complete function and finishing state', () => {
    const { result } = renderHook(() => useInterviewFinisher());

    expect(result.current.complete).toBe(mockComplete);
    expect(result.current.isFinishing).toBe(false);
  });

  it('should navigate to feedback page on success', () => {
    // Capture the options passed to useInterviewCompletion
    let passedOptions: any = {};
    (useInterviewCompletion as any).mockImplementation((options: any) => {
      passedOptions = options;
      return { complete: mockComplete, isCompleting: false };
    });

    renderHook(() => useInterviewFinisher());

    // triggers onSuccess
    act(() => {
      passedOptions.onSuccess({}, 'interview-123');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/daily-interview/interview-123/feedback');
  });
});
