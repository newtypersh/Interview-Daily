import { describe, it, expect } from 'vitest';
import { FeedbackFormInputSchema, FeedbackFormSchema } from './form';

describe('Feedback Form Schemas', () => {
  describe('FeedbackFormInputSchema', () => {
    it('should pass validation for valid input', () => {
      const validData = {
        feedbacks: {
          q1: { rating: 5, content: 'Great', answerId: 'a1' },
          q2: { rating: 3, content: 'Okay', answerId: 'a2' },
        },
      };

      const result = FeedbackFormInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if rating is 0', () => {
      const invalidData = {
        feedbacks: {
          q1: { rating: 0, content: '', answerId: 'a1' },
        },
      };

      const result = FeedbackFormInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('평가를 완료해주세요.');
        expect(result.error.issues[0].path).toEqual(['feedbacks', 'q1', 'rating']);
      }
    });

    it('should fail validation if any item has rating 0 (multiple items)', () => {
      const invalidData = {
        feedbacks: {
            q1: { rating: 5, content: 'Good', answerId: 'a1' },
            q2: { rating: 0, content: '', answerId: 'a2' },
        },
      };

      const result = FeedbackFormInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
         // Should find error for q2
         const error = result.error.issues.find(issue => issue.path.includes('q2'));
         expect(error).toBeDefined();
         expect(error?.message).toBe('평가를 완료해주세요.');
      }
    });
  });

  describe('FeedbackFormSchema (Transformation)', () => {
    it('should transform valid input to submission payload format', () => {
      const validData = {
        feedbacks: {
          q1: { rating: 5, content: 'Great job', answerId: 'a1' },
          q2: { rating: 4, content: 'Good', answerId: 'a2' },
        },
      };

      const result = FeedbackFormSchema.parse(validData);

      expect(result).toEqual({
        feedbacks: [
          { answerId: 'a1', rating: 5, feedbackText: 'Great job' },
          { answerId: 'a2', rating: 4, feedbackText: 'Good' },
        ],
      });
    });

    it('should transform empty input to empty array', () => {
        const emptyData = { feedbacks: {} };
        const result = FeedbackFormSchema.parse(emptyData);
        expect(result).toEqual({ feedbacks: [] });
    });
  });
});
