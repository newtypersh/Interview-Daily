import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import History from './index';
import { useInterviewHistory } from '../../react-query/queries/useInterviewHistory';

// Mock the hook
vi.mock('../../react-query/queries/useInterviewHistory');

// Mock HistoryItem to isolate Page logic
vi.mock('./HistoryItem', () => ({
    default: ({ interview }: { interview: any }) => (
        <div data-testid="history-item">Item {interview.id}</div>
    ),
}));

// Mock EmptyState
vi.mock('./EmptyState', () => ({
    default: ({ message }: { message: string }) => (
        <div data-testid="empty-state">{message}</div>
    ),
}));

// Type helper for the mock
const mockUseInterviewHistory = useInterviewHistory as unknown as ReturnType<typeof vi.fn>;

describe('History Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render loading state', () => {
        mockUseInterviewHistory.mockReturnValue({
            isPending: true,
            data: undefined,
            isError: false,
        });

        render(<History />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render error state', () => {
        mockUseInterviewHistory.mockReturnValue({
            isPending: false,
            isError: true,
            error: new Error('Network error'),
            data: undefined,
        });

        render(<History />);

        expect(screen.getByText('기록을 불러오는 중 오류가 발생했습니다.')).toBeInTheDocument();
    });

    it('should render empty state', () => {
        mockUseInterviewHistory.mockReturnValue({
            isPending: false,
            isError: false,
            data: {
                pages: [
                    { data: [] }
                ]
            },
            hasNextPage: false,
        });

        render(<History />);

        expect(screen.getByTestId('empty-state')).toHaveTextContent('아직 면접 기록이 없습니다.');
        expect(screen.queryByText('더보기')).not.toBeInTheDocument();
    });

    it('should render interview items', () => {
        const mockData = [
            { id: 1 },
            { id: 2 },
        ];

        mockUseInterviewHistory.mockReturnValue({
            isPending: false,
            isError: false,
            data: {
                pages: [
                    { data: mockData }
                ]
            },
            hasNextPage: false,
        });

        render(<History />);

        const items = screen.getAllByTestId('history-item');
        expect(items).toHaveLength(2);
        expect(items[0]).toHaveTextContent('Item 1');
        expect(items[1]).toHaveTextContent('Item 2');
    });

    it('should render load more button and handle click', () => {
        const fetchNextPageMock = vi.fn();
        
        mockUseInterviewHistory.mockReturnValue({
            isPending: false,
            isError: false,
            data: {
                pages: [
                    { data: [{ id: 1 }] }
                ]
            },
            hasNextPage: true,
            isFetchingNextPage: false,
            fetchNextPage: fetchNextPageMock,
        });

        render(<History />);

        const loadMoreBtn = screen.getByRole('button', { name: '더보기' });
        expect(loadMoreBtn).toBeInTheDocument();

        fireEvent.click(loadMoreBtn);
        expect(fetchNextPageMock).toHaveBeenCalledTimes(1);
    });

    it('should show loading state in load more button', () => {
        mockUseInterviewHistory.mockReturnValue({
            isPending: false,
            isError: false,
            data: {
                pages: [
                    { data: [{ id: 1 }] }
                ]
            },
            hasNextPage: true,
            isFetchingNextPage: true, // '더보기' 대신 로딩 상태를 렌더링
            fetchNextPage: vi.fn(),
        });

        render(<History />);

        const loadMoreBtn = screen.getByRole('button'); // Text might be hidden or changed, checking button existence
        expect(loadMoreBtn).toBeDisabled();
        expect(screen.getByRole('progressbar')).toBeInTheDocument(); // CircularProgress inside the button
    });
});
