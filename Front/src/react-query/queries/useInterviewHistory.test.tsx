import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInterviewHistory } from './useInterviewHistory';
import { getInterviews } from '../../apis/history';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock API
vi.mock('../../apis/history', () => ({
  getInterviews: vi.fn(),
}));

// Create a local wrapper if project doesn't have a shared one valid for this scope
const createTestWrapper = () => {
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

describe('useInterviewHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch initial page with correct parameters', async () => {
    (getInterviews as any).mockResolvedValue({
        data: [],
        pagination: { hasNext: false, nextCursorCreatedAt: null }
    });

    const { result } = renderHook(() => useInterviewHistory(), {
        wrapper: createTestWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getInterviews).toHaveBeenCalledWith({
        limit: 20,
        cursorCreatedAt: null, // Initial page param
    });
  });

  it('should handle getNextPageParam correctly when hasNext is true', async () => {
    (getInterviews as any)
        .mockResolvedValueOnce({
            data: [{ id: 1 }],
            pagination: { hasNext: true, nextCursorCreatedAt: '2024-01-01' }
        })
        .mockResolvedValueOnce({
            data: [{ id: 2 }],
            pagination: { hasNext: false, nextCursorCreatedAt: null }
        });

    const { result } = renderHook(() => useInterviewHistory(), {
        wrapper: createTestWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // TanStack Query v5 logic: we can check data.pages or hasNextPage
    expect(result.current.hasNextPage).toBe(true);

    // Trigger next page fetch
    await result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages.length).toBe(2));

    expect(getInterviews).toHaveBeenCalledTimes(2);
    expect(getInterviews).toHaveBeenLastCalledWith({
        limit: 20,
        cursorCreatedAt: '2024-01-01',
    });
  });

  it('should handle getNextPageParam correctly when hasNext is false', async () => {
    (getInterviews as any).mockResolvedValue({
        data: [{ id: 1 }],
        pagination: { hasNext: false, nextCursorCreatedAt: null }
    });

    const { result } = renderHook(() => useInterviewHistory(), {
        wrapper: createTestWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.hasNextPage).toBe(false);
  });
});
