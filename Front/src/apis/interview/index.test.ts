import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processAndUploadAudio } from './index';
import { api } from '../axios';

// Mock axios instance
vi.mock('../axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Interview API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('processAndUploadAudio', () => {
    // interviewId에 null, undefined, ''를 넣었을 때 에러가 발생하는지 확인
    it('should throw error if interviewId is missing', async () => {
      // 비동기 코드에는 rejects를 사용
      await expect(processAndUploadAudio(null, 'answer-id', 'blob:url'))
        .rejects.toThrow('Interview ID is missing');
      
      await expect(processAndUploadAudio(undefined, 'answer-id', 'blob:url'))
        .rejects.toThrow('Interview ID is missing');

      await expect(processAndUploadAudio('', 'answer-id', 'blob:url'))
        .rejects.toThrow('Interview ID is missing');
    });
    // answerId에 null, undefined, ''를 넣었을 때 에러가 발생하는지 확인
    it('should throw error if answerId is missing', async () => {
        await expect(processAndUploadAudio('interview-id', null, 'blob:url'))
          .rejects.toThrow('Answer ID is missing');
        
        await expect(processAndUploadAudio('interview-id', undefined, 'blob:url'))
          .rejects.toThrow('Answer ID is missing');
  
        await expect(processAndUploadAudio('interview-id', '', 'blob:url'))
          .rejects.toThrow('Answer ID is missing');
      });
    // interviewId와 answerId가 둘 다 null을 넣었을 때 에러가 발생하는지 확인
    it('should throw aggregated error if both interviewId and answerId are missing', async () => {
        await expect(processAndUploadAudio(null, null, 'blob:url'))
          .rejects.toThrow('Interview ID, Answer ID is missing');
      });

    it('should proceed to upload if validation passes', async () => {
        // Mock get blob
        const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
        (api.get as any).mockResolvedValue({ data: mockBlob });
        
        // Mock upload success
        (api.post as any).mockResolvedValue({ 
            data: { 
                answer: {
                    id: 'answer-1',
                    audioUrl: 'http://s3.com/uploaded-file.webm'
                }
            } 
        });

        const result = await processAndUploadAudio('interview-1', 'answer-1', 'blob:url');

        expect(api.get).toHaveBeenCalledWith('blob:url', { responseType: 'blob' });
        expect(api.post).toHaveBeenCalledWith(
            '/interviews/interview-1/answers/answer-1/audio', 
            expect.any(FormData), 
            expect.objectContaining({
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        );
        expect(result).toEqual({ 
            answer: {
                id: 'answer-1',
                audioUrl: 'http://s3.com/uploaded-file.webm'
            }
        });
    });
  });
});
