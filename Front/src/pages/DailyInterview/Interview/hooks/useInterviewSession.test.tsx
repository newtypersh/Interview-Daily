import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useInterviewSession } from './useInterviewSession';
import type { Question } from '../../../../apis/questionSet';

describe('useInterviewSession', () => {
  // Mock questions data
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      content: 'Question 1',
      questionSetId: 'qs1',
      order: 1,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'q2',
      content: 'Question 2',
      questionSetId: 'qs1',
      order: 2,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'q3',
      content: 'Question 3',
      questionSetId: 'qs1',
      order: 3,
      createdAt: '',
      updatedAt: '',
    },
  ];

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useInterviewSession({ questions: mockQuestions }));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
    expect(result.current.totalQuestions).toBe(3);
    expect(result.current.isFirstQuestion).toBe(true);
    expect(result.current.isLastQuestion).toBe(false);
  });

  it('should navigate to next question correctly', () => {
    const { result } = renderHook(() => useInterviewSession({ questions: mockQuestions }));

    act(() => {
      result.current.toNextQuestion();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentQuestion).toEqual(mockQuestions[1]);
    expect(result.current.isFirstQuestion).toBe(false);
    expect(result.current.isLastQuestion).toBe(false);
  });

  it('should navigate to previous question correctly', () => {
    const { result } = renderHook(() => useInterviewSession({ questions: mockQuestions }));

    // Move to index 1 first
    act(() => {
      result.current.toNextQuestion();
    });
    
    // Then move back
    act(() => {
      result.current.toPrevQuestion();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentQuestion).toEqual(mockQuestions[0]);
    expect(result.current.isFirstQuestion).toBe(true);
  });

  it('should not navigate past the last question', () => {
    const { result } = renderHook(() => useInterviewSession({ questions: mockQuestions }));

    // Move to last index (2)
    act(() => {
      result.current.toNextQuestion(); // 1
      result.current.toNextQuestion(); // 2
    });

    expect(result.current.isLastQuestion).toBe(true);

    // Try to move next again
    act(() => {
      result.current.toNextQuestion();
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentQuestion).toEqual(mockQuestions[2]);
  });

  it('should not navigate before the first question', () => {
    const { result } = renderHook(() => useInterviewSession({ questions: mockQuestions }));

    // Try to move prev from start
    act(() => {
      result.current.toPrevQuestion();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isFirstQuestion).toBe(true);
  });

  it('should handle empty questions array', () => {
    const { result } = renderHook(() => useInterviewSession({ questions: [] }));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentQuestion).toBeUndefined();
    expect(result.current.totalQuestions).toBe(0);
    // Logic: isFirstQuestion = (0 === 0) -> true
    expect(result.current.isFirstQuestion).toBe(true); 
    // Logic: isLastQuestion = (0 > 0 && 0 === -1) -> false
    expect(result.current.isLastQuestion).toBe(false); 
  });
});
