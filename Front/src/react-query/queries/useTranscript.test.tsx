import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTranscript } from './useTranscript';
import * as ReactQuery from '@tanstack/react-query';

// Mock useQuery to inspect options
vi.mock('@tanstack/react-query', async () => {
    //부분 모킹을 위해 importActual 사용
    const actual = await vi.importActual('@tanstack/react-query');
    return {
        ...actual, // 진짜 라이브러리의 모든 기능을 반한
        useQuery: vi.fn(), // useQuery만 vi.fn()으로 덮어씀
    };
});

describe('useTranscript', () => {
    const mockUseQuery = ReactQuery.useQuery as any;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state correctly when data is missing', () => {
        // Mock loading state
        mockUseQuery.mockReturnValue({
            data: undefined, // status가 pending일 때, undefined
            error: null,
        });

        const { result } = renderHook(() => useTranscript({ interviewId: 'i1', answerId: 'a1' }));

        expect(result.current.transcript).toBe('');
        // isTranscribing checks !!answerId && !transcript.
        // If transcript is empty string, it assumes transcribing if answerId is present.
        expect(result.current.isTranscribing).toBe(true);
        expect(result.current.error).toBeNull();
    });

    it('should configure polling interval: 1000ms when transcript is missing', () => {
        mockUseQuery.mockReturnValue({
            data: {
                answers: [{ id: 'a1', transcriptText: '' }]
            },
        });

        renderHook(() => useTranscript({ interviewId: 'i1', answerId: 'a1' }));

        const calls = mockUseQuery.mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        
        // Extract the options passed to useQuery (2nd argument or part of 1st arg object)
        // In v5, it's usually one object argument.
        const options = calls[0][0]; 
        
        expect(options.queryKey).toEqual(['interview', 'i1', 'answers']);
        expect(options.enabled).toBe(true);

        // Test the refetchInterval function logic
        const intervalFn = options.refetchInterval;
        expect(typeof intervalFn).toBe('function');

        // Simulate query state with NO transcript
        const mockQueryStateEmpty = {
            state: {
                data: {
                    answers: [{ id: 'a1', transcriptText: '' }]
                }
            }
        };
        expect(intervalFn(mockQueryStateEmpty)).toBe(1000);
    });

    it('should configure polling interval: false (stop) when transcript is present', () => {
        mockUseQuery.mockReturnValue({
             data: {
                answers: [{ id: 'a1', transcriptText: 'Finite content.' }]
            },
        });

        renderHook(() => useTranscript({ interviewId: 'i1', answerId: 'a1' }));

        const callingOptions = mockUseQuery.mock.calls[0][0];
        const intervalFn = callingOptions.refetchInterval;

        // Simulate query state WITH transcript
        const mockQueryStateDone = {
            state: {
                data: {
                    answers: [{ id: 'a1', transcriptText: 'Finished text' }]
                }
            }
        };
        expect(intervalFn(mockQueryStateDone)).toBe(false);
    });

    it('should return transcript text when available', () => {
        mockUseQuery.mockReturnValue({
            data: {
                answers: [
                    { id: 'a1', transcriptText: 'Complete sentence.' },
                    { id: 'a2', transcriptText: 'Other' }
                ]
            },
            error: null,
        });

        const { result } = renderHook(() => useTranscript({ interviewId: 'i1', answerId: 'a1' }));

        expect(result.current.transcript).toBe('Complete sentence.');
        expect(result.current.isTranscribing).toBe(false);
    });

    it('should be disabled if IDs are missing', () => {
        mockUseQuery.mockReturnValue({});
        
        renderHook(() => useTranscript({ interviewId: null, answerId: null }));
        
        const options = mockUseQuery.mock.calls[0][0];
        expect(options.enabled).toBe(false);
    });
});
