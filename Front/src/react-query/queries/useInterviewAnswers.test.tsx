import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInterviewAnswers } from './useInterviewAnswers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getInterviewAnswers } from '../../apis/interview';

// Mock the API instead of the hook
vi.mock('../../apis/interview', () => ({
    getInterviewAnswers: vi.fn()
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useInterviewAnswers', () => {
    beforeEach(() => {
        // 호출 인자와 호출 횟수등의 초기화를 위해 사용
        vi.clearAllMocks();
    });

    it('should fetch answers if interviewId is provided', async () => {
        const mockData = { answers: [{ id: 'a1', content: 'test' }] };
        (getInterviewAnswers as any).mockResolvedValue(mockData);

        const { result } = renderHook(() => useInterviewAnswers('test-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isPending).toBe(false));

        expect(result.current.interview).toEqual(mockData);
        expect(getInterviewAnswers).toHaveBeenCalledWith('test-id');
    });

    it('should disable query if interviewId is missing', () => {
         const { result } = renderHook(() => useInterviewAnswers(''), {
            wrapper: createWrapper(),
        });

        expect(result.current.isPending).toBe(true); // Initial state is pending/idle for disabled query depending on version, but fetch shouldn't be called
        expect(getInterviewAnswers).not.toHaveBeenCalled();
    });

    it('should return error state when query fails', async () => {
        const mockError = new Error('Fetch failed');
        (getInterviewAnswers as any).mockRejectedValue(mockError);

        const { result } = renderHook(() => useInterviewAnswers('test-id'), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.error).toEqual(mockError));
        expect(result.current.isPending).toBe(false);
    });
});
