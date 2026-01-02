import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInterviewAnswers } from './useInterviewAnswers';
import * as ReactQuery from '@tanstack/react-query';

// Mock useQuery to inspect options
vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query');
    return {
        ...actual,
        useQuery: vi.fn(),
    };
});

describe('useInterviewAnswers', () => {
    const mockUseQuery = ReactQuery.useQuery as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should configure query with correct keys and options', () => {
        mockUseQuery.mockReturnValue({
            data: { answers: [] },
            isPending: false,
            error: null,
        });

        renderHook(() => useInterviewAnswers('test-id'));

        const calls = mockUseQuery.mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        
        const options = calls[0][0];
        
        // 1. Check Query Key
        expect(options.queryKey).toEqual(['interview', 'test-id', 'answers']);
        
        // 2. Check enabled (should be true for valid ID)
        expect(options.enabled).toBe(true);

        // 3. Check staleTime (CRITICAL: should be 0 for fresh fetching)
        expect(options.staleTime).toBe(0);
    });

    it('should be disabled if interviewId is missing', () => {
        mockUseQuery.mockReturnValue({});

        // @ts-ignore - Testing invalid input
        renderHook(() => useInterviewAnswers(''));
        
        const options = mockUseQuery.mock.calls[0][0];
        expect(options.enabled).toBe(false);
    });

    it('should return data when query is successful', () => {
        const mockData = { answers: [{ id: 'a1', content: 'test' }] };
        
        // 1. Success State
        mockUseQuery.mockReturnValue({
            data: mockData,
            isPending: false,
            error: null,
        });

        const { result } = renderHook(() => useInterviewAnswers('test-id'));

        expect(result.current.interview).toEqual(mockData);
        expect(result.current.isPending).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should return pending state when loading', () => {
        // 2. Pending State
        mockUseQuery.mockReturnValue({
            data: undefined,
            isPending: true,
            error: null,
        });

        const { result } = renderHook(() => useInterviewAnswers('test-id'));

        expect(result.current.interview).toBeUndefined();
        expect(result.current.isPending).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('should return error state when query fails', () => {
        const mockError = new Error('Test Error');
        
        // 3. Error State
        mockUseQuery.mockReturnValue({
            data: undefined,
            isPending: false,
            error: mockError,
        });

        const { result } = renderHook(() => useInterviewAnswers('test-id'));

        expect(result.current.interview).toBeUndefined();
        expect(result.current.isPending).toBe(false);
        expect(result.current.error).toEqual(mockError);
    });
});
