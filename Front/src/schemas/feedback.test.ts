import { describe, it, expect } from 'vitest';
import { FeedbackSubmissionSchema } from './feedback';

describe('Feedback Schemas', () => {
  describe('FeedbackSubmissionSchema', () => {
    it('should fail if feedbacks record is empty', () => {
      const input = {
        interviewId: 'valid-uuid',
        feedbacks: {}, // Empty record
      };
      const result = FeedbackSubmissionSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.issues[0].message).toBe('최소 하나 이상의 피드백을 작성해야 합니다.');
      }
    });

    it('should pass if feedbacks record has items', () => {
      const input = {
        interviewId: 'valid-uuid',
        feedbacks: {
            'answer-1': { rating: 5, content: 'Good' }
        },
      };
      const result = FeedbackSubmissionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });
});
