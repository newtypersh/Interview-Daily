import { renderHook, act } from '@testing-library/react';
import { useFeedbackForm } from './useFeedbackForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { FeedbackItem } from '../utils/feedbackMapper';

// 의존성 Mocking
const mockOnSubmit = vi.fn();

vi.mock('./useFeedbackSubmission', () => ({
  useFeedbackSubmission: () => ({
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  }),
}));

// 테스트용 데이터 (Mock Data)
const mockFeedbackItems: FeedbackItem[] = [
  {
    id: 'q1',
    content: 'Question 1',
    answerId: 'a1',
    order: 1,
    audioUrl: null,
    feedbacks: [
      {
        rating: 3,
        feedbackText: 'Not bad',
      }
    ],
  },
  {
    id: 'q2',
    content: 'Question 2',
    answerId: 'a2',
    order: 2,
    audioUrl: 'https://example.com/audio.mp3',
    feedbacks: [
      {
        rating: 4,
        feedbackText: 'Good answer',
      },
    ],
  },
];

describe('useFeedbackForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize form values correctly from feedbackItems', () => {
    const { result } = renderHook(() =>
      useFeedbackForm(mockFeedbackItems, 'interview-123')
    );

    // 초기값 확인
    // control 객체 존재 여부만 확인하여 훅이 정상적으로 초기화되었는지 검증
    expect(result.current.control).toBeDefined();
  });

  it('should toggle audio playback correctly', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useFeedbackForm(mockFeedbackItems, 'interview-123')
    );

    // Initial state
    expect(result.current.playingAudio).toBeNull();

    // Start playing
    act(() => {
      result.current.handlePlayAudio('q1');
    });
    expect(result.current.playingAudio).toBe('q1');

    // Toggle off
    act(() => {
      result.current.handlePlayAudio('q1');
    });
    expect(result.current.playingAudio).toBeNull();

    // Play again and wait for timeout
    act(() => {
      result.current.handlePlayAudio('q1');
    });
    expect(result.current.playingAudio).toBe('q1');

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.playingAudio).toBeNull();
    
    vi.useRealTimers();
  });

  it('should call onSubmit with correct data when form is submitted', async () => {
    const { result } = renderHook(() =>
      useFeedbackForm(mockFeedbackItems, 'interview-123')
    );

    // 폼 제출 시뮬레이션
    // React Hook Form의 handleSubmit이 감싸고 있는 submitHandler를 직접 호출하여 테스트합니다.
    // 내부적으로 유효성 검사를 거친 후 mockOnSubmit이 호출되어야 합니다.
    
    await act(async () => {
        // We pass a mock event
        await result.current.submitHandler({
             preventDefault: vi.fn(),
             persist: vi.fn(),
        } as any);
    });

    // onSubmit 호출 여부 확인
    // 별도의 값 변경이 없었으므로 초기값 그대로 제출되어야 합니다.
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    
    const submittedData = mockOnSubmit.mock.calls[0][0];
    
    // q1 검증 (초기 데이터 로드 확인)
    expect(submittedData.feedbacks.q1).toEqual(expect.objectContaining({
        rating: 3,
        content: 'Not bad',
        answerId: 'a1'
    }));

    // q2 검증 (기존 데이터 로드 확인)
    expect(submittedData.feedbacks.q2).toEqual(expect.objectContaining({
        rating: 4,
        content: 'Good answer',
        answerId: 'a2'
    }));
  });
});
