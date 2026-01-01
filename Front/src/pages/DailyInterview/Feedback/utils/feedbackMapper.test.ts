import { describe, it, expect } from 'vitest';
import { mapInterviewToFeedbackItems } from './feedbackMapper';
import type { InterviewAnswer } from '../../../../apis/interview';

describe('mapInterviewToFeedbackItems', () => {
  it('should return empty array if input is undefined or null', () => {
    expect(mapInterviewToFeedbackItems(undefined)).toEqual([]);
    // @ts-ignore - Check for null safety if applicable in JS runtime
    expect(mapInterviewToFeedbackItems(null)).toEqual([]);
  });

  it('should return empty array if input is empty array', () => {
    expect(mapInterviewToFeedbackItems([])).toEqual([]);
  });

  it('should map API response to FeedbackItem correctly', () => {
    const mockAnswers: InterviewAnswer[] = [
      {
        id: 'answer-1',
        interviewId: 'interview-1',
        questionId: 'question-1',
        sequence: 1,
        questionContent: 'Question Content',
        audioUrl: 'http://example.com/audio.webm',
        transcriptText: 'Transcript text',
        feedbacks: [{ rating: 5, feedbackText: 'Good' }],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];

    const result = mapInterviewToFeedbackItems(mockAnswers);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 'question-1',      // mapped from questionId
      content: 'Question Content', // mapped from questionContent
      order: 1,              // mapped from sequence
      answerId: 'answer-1',  // mapped from id
      audioUrl: 'http://example.com/audio.webm',
      transcript: 'Transcript text',
      feedbacks: [{ rating: 5, feedbackText: 'Good' }],
    });
  });

  it('should handle missing optional fields safely', () => {
    const mockAnswers: InterviewAnswer[] = [
      {
        id: 'answer-2',
        interviewId: 'interview-1',
        questionId: 'question-2',
        sequence: 2,
        questionContent: null, // Test nullable
        audioUrl: null,
        // transcriptText missing
        // feedbacks missing
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ];

    const result = mapInterviewToFeedbackItems(mockAnswers);

    expect(result[0]).toEqual({
      id: 'question-2',
      content: '', // Should fallback to empty string
      order: 2,
      answerId: 'answer-2',
      audioUrl: null,
      transcript: undefined,
      feedbacks: undefined,
    });
  });
});
