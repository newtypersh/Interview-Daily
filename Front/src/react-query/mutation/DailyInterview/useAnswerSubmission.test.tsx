import { renderHook, waitFor } from '@testing-library/react';
import { useAnswerSubmission } from './useAnswerSubmission';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../../apis/interview';

// Mock API
vi.mock('../../../apis/interview', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../apis/interview')>();
  return {
    ...actual,
    processAndUploadAudio: vi.fn(),
  };
});

describe('useAnswerSubmission', () => {
  let queryClient: QueryClient;
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();
  
  // Capture original fetch
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const createWrapper = () => ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should not mutate if arguments are missing', async () => {
    const { result } = renderHook(
      () => useAnswerSubmission({ interviewId: 'i1', onSuccess: mockOnSuccess, onError: mockOnError }),
      { wrapper: createWrapper() }
    );

    // Call with missing args
    result.current.submit(undefined, 'url');
    result.current.submit('id', null);

    // Mutation should not start because submit() checks args
    expect(api.processAndUploadAudio).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledWith(new Error('제출에 필요한 정보가 누락되었습니다.'));
    expect(result.current.isSubmitting).toBe(false);
  });
  
  it('should fail validation if interviewId is missing', async () => {
    // Mock validation failure inside the API function
    (api.processAndUploadAudio as any).mockRejectedValue(new Error('Interview ID is missing'));

    const { result } = renderHook(
        () => useAnswerSubmission({ interviewId: null, onSuccess: mockOnSuccess, onError: mockOnError }),
        { wrapper: createWrapper() }
    );
    
    // Call with valid args for submit(), but interviewId hook prop is null
    result.current.submit('answer-1', 'url');
    
    await waitFor(() => {
        expect(api.processAndUploadAudio).toHaveBeenCalled();
        expect(mockOnError).toHaveBeenCalled();
        expect(mockOnError.mock.calls[0][0]).toEqual(new Error('Interview ID is missing'));
    });
  });

  it('should call processAndUploadAudio successfully', async () => {
    // Mock API success
    (api.processAndUploadAudio as any).mockResolvedValue({ key: 'uploaded-key' });

    const { result } = renderHook(
      () => useAnswerSubmission({ interviewId: 'interview-1', onSuccess: mockOnSuccess, onError: mockOnError }),
      { wrapper: createWrapper() }
    );

    // Trigger submit
    result.current.submit('answer-1', 'blob:http://localhost/123');

    // Verify API call
    await waitFor(() => {
      expect(api.processAndUploadAudio).toHaveBeenCalledWith('interview-1', 'answer-1', 'blob:http://localhost/123');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnSuccess.mock.calls[0][0]).toEqual({ key: 'uploaded-key' });
    });
  });

  it('should handle API errors', async () => {
    // Mock API error
    (api.processAndUploadAudio as any).mockRejectedValue(new Error('Processing Failed'));

    const { result } = renderHook(
      () => useAnswerSubmission({ interviewId: 'interview-1', onSuccess: mockOnSuccess, onError: mockOnError }),
      { wrapper: createWrapper() }
    );

    result.current.submit('answer-1', 'blob:http://localhost/123');

    await waitFor(() => {
       expect(mockOnError).toHaveBeenCalled();
       expect(mockOnError.mock.calls[0][0]).toEqual(expect.any(Error));
       expect(mockOnError.mock.calls[0][0].message).toBe('Processing Failed');
    });
  });


});
