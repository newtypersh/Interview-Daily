import { renderHook, act } from '@testing-library/react';
import { useSubmissionManager } from './useSubmissionManager';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import { useAnswerSubmission } from '../../../../react-query/mutation/DailyInterview/useAnswerSubmission';
import { handleError } from '../../../../utils/errorHandler';

// Mock dependencies
vi.mock('../../../../react-query/mutation/DailyInterview/useAnswerSubmission');
vi.mock('../../../../utils/errorHandler');

describe('useSubmissionManager', () => {
  const mockSubmit = vi.fn();
  const mockUseAnswerSubmission = useAnswerSubmission as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    mockUseAnswerSubmission.mockReturnValue({
      submit: mockSubmit,
      isSubmitting: false,
      error: null,
    });
  });

  it('should initialize with null currentAnswerId', () => {
    const { result } = renderHook(() => 
      useSubmissionManager({ interviewId: 'test-id', currentIndex: 0 })
    );

    expect(result.current.currentAnswerId).toBeNull();
  });

  it('should call submit from useAnswerSubmission', () => {
    const { result } = renderHook(() => 
      useSubmissionManager({ interviewId: 'test-id', currentIndex: 0 })
    );

    result.current.submit('answer-id', 'media-url');

    expect(mockSubmit).toHaveBeenCalledWith('answer-id', 'media-url');
  });

  it('should update currentAnswerId on successful submission', () => {
    // Capture the onSuccess callback passed to useAnswerSubmission
    let capturedOnSuccess: ((data: any) => void) | undefined;

    mockUseAnswerSubmission.mockImplementation(({ onSuccess }) => {
      // onSuccess 콜백을 저장
      capturedOnSuccess = onSuccess;
      return { submit: mockSubmit, isSubmitting: false, error: null };
    });

    const { result } = renderHook(() => 
      useSubmissionManager({ interviewId: 'test-id', currentIndex: 0 })
    );

    // Simulate success callback
    const mockData = { answer: { id: 'new-answer-id' } };
    act(() => {
      capturedOnSuccess?.(mockData);
    });

    expect(result.current.currentAnswerId).toBe('new-answer-id');
  });


});

describe('useSubmissionManager - State Transitions', () => {
    const mockSubmit = vi.fn();
    const mockUseAnswerSubmission = useAnswerSubmission as Mock;
    
    it('should reset currentAnswerId when currentIndex changes', () => {
        let capturedOnSuccess: ((data: any) => void) | undefined;

        mockUseAnswerSubmission.mockImplementation(({ onSuccess }) => {
            capturedOnSuccess = onSuccess;
            return { submit: mockSubmit, isSubmitting: false, error: null };
        });

        const { result, rerender } = renderHook(
            ({ index }) => useSubmissionManager({ interviewId: 'test-id', currentIndex: index }),
            { initialProps: { index: 0 } }
        );

        // 1. Simulate success to set currentAnswerId
        act(() => {
            capturedOnSuccess?.({ answer: { id: 'answer-1' } });
        });
        expect(result.current.currentAnswerId).toBe('answer-1');

        // 2. Change index
        rerender({ index: 1 });

        // 3. Should be reset
        expect(result.current.currentAnswerId).toBeNull();
    });

    it('should call handleError on submission error', () => {
        let capturedOnError: ((error: Error) => void) | undefined;

        mockUseAnswerSubmission.mockImplementation(({ onError }) => {
            capturedOnError = onError;
            return { submit: mockSubmit, isSubmitting: false, error: null };
        });

        renderHook(() => 
            useSubmissionManager({ interviewId: 'test-id', currentIndex: 0 })
        );

        const mockError = new Error('Submission failed');
        act(() => {
            capturedOnError?.(mockError);
        });

        expect(handleError).toHaveBeenCalledWith(mockError);
    });
});
