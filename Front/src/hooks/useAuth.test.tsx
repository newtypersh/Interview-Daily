import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { api } from '../apis/axios';
import React from 'react';

// Mock the api module
vi.mock('../apis/axios', () => ({
  api: {
    get: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Turn off retries for testing
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when login check succeeds', async () => {
    // Mock success response
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetched).toBe(true));
    expect(result.current.data).toBe(true);
  });

  it('should return false when login check fails', async () => {
    // Mock failure response
    (api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetched).toBe(true));
    // Since checkLoginStatus catches error and returns false, useQuery should be successful with data=false
    expect(result.current.data).toBe(false);
  });
});
