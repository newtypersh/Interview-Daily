import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInterviews } from './index';
import { api } from '../axios';

// Mock axios instance
vi.mock('../axios', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('History API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('getInterviews', () => {
    it('should return data if response is valid', async () => {
      const mockResponse = {
        resultType: 'SUCCESS',
        success: {
          data: [
            { 
              id: 1, 
              createdAt: '2024-01-01T00:00:00Z', 
              totalScore: 85,
              questionCount: 5 
            }
          ],
          pagination: {
            hasNext: true,
            nextCursorCreatedAt: '2023-12-31T00:00:00Z'
          }
        }
      };

      (api.get as any).mockResolvedValue({ data: mockResponse });

      const result = await getInterviews({ limit: 10 });
      
      expect(api.get).toHaveBeenCalledWith('/history/interviews', {
        params: { limit: 10 }
      });
      expect(result).toEqual(mockResponse.success);
    });

    it('should include cursorCreatedAt in params if provided', async () => {
      const mockResponse = {
        resultType: 'SUCCESS',
        success: {
          data: [],
          pagination: { hasNext: false, nextCursorCreatedAt: null }
        }
      };

      (api.get as any).mockResolvedValue({ data: mockResponse });

      await getInterviews({ limit: 10, cursorCreatedAt: '2024-01-01' });

      expect(api.get).toHaveBeenCalledWith('/history/interviews', {
        params: { limit: 10, cursorCreatedAt: '2024-01-01' }
      });
    });

    it('should throw error if response validation fails', async () => {
      // Mock invalid response (missing pagination)
      (api.get as any).mockResolvedValue({
        data: {
          success: {
            data: []
            // missing pagination
          }
        }
      });

      await expect(getInterviews({ limit: 10 }))
        .rejects.toThrow('면접 기록 목록 검증에 실패했습니다.');
    });

    it('should propagate API errors', async () => {
      (api.get as any).mockRejectedValue(new Error('Network Error'));

      await expect(getInterviews({ limit: 10 }))
        .rejects.toThrow('Network Error');
    });
  });
});
