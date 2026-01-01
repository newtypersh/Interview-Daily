import { renderHook, act } from '@testing-library/react';
import { useFeedbackSubmission } from './useFeedbackSubmission';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mocks
const mockNavigate = vi.fn();
const mockMutate = vi.fn();

// Hoisted mock to control return values dynamically
const { mockUseSubmitFeedback } = vi.hoisted(() => ({
  mockUseSubmitFeedback: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock useSubmitFeedback
vi.mock('../../../../react-query/mutation/useSubmitFeedback', () => ({
  useSubmitFeedback: mockUseSubmitFeedback,
}));

describe('useFeedbackSubmission', () => {
  const interviewId = 'test-interview-id';

  // Alert spy
  const alertSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    mockUseSubmitFeedback.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    // Setup window.alert mock
    if (typeof window !== 'undefined') { // 브라우저 or 가상 브라우저 환경일 경우
      window.alert = alertSpy;
    } else {
      vi.stubGlobal('alert', alertSpy);
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should transform data and call mutate on submit', () => {
    const { result } = renderHook(() => useFeedbackSubmission({ interviewId }));

    const formData = {
      feedbacks: {
        q1: { rating: 5, content: 'Great', answerId: 'a1' },
        q2: { rating: 4, content: 'Good', answerId: 'a2' },
      },
    };

    // forward all arguments to the act function
    act(() => {
      // result.current는 현재 훅의 결과물
      result.current.onSubmit(formData);
    });

    // mockMutate는 submit이후 return value
    expect(mockMutate).toHaveBeenCalledTimes(1);
    
    // Check payload
    const calledPayload = mockMutate.mock.calls[0][0];
    expect(calledPayload).toEqual({
      feedbacks: [
        { answerId: 'a1', rating: 5, feedbackText: 'Great' },
        { answerId: 'a2', rating: 4, feedbackText: 'Good' },
      ]
    });
  });



  it('should navigate to home on success', () => {
    const { result } = renderHook(() => useFeedbackSubmission({ interviewId }));
    
    // Trigger submit
    act(() => {
      result.current.onSubmit({ feedbacks: { q1: { rating: 5, content: 'Good', answerId: 'a1' } } });
    });
    
    // Get the options object passed to mutate (second argument)
    const mutationOptions = mockMutate.mock.calls[0][1];
    
    // Simulate Success
    mutationOptions.onSuccess();

    expect(alertSpy).toHaveBeenCalledWith('피드백이 성공적으로 제출되었습니다.');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should alert on error', () => {
    const { result } = renderHook(() => useFeedbackSubmission({ interviewId }));
    
    act(() => {
      result.current.onSubmit({ feedbacks: { q1: { rating: 5, content: 'Good', answerId: 'a1' } } });
    });
    
    const mutationOptions = mockMutate.mock.calls[0][1];
    
    // Simulate Error
    mutationOptions.onError();

    expect(alertSpy).toHaveBeenCalledWith('피드백 제출에 실패했습니다.');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should reflect isSubmitting state', () => {
    // Override mock to return isPending: true
    mockUseSubmitFeedback.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    const { result } = renderHook(() => useFeedbackSubmission({ interviewId }));
    
    expect(result.current.isSubmitting).toBe(true);
  });


});
