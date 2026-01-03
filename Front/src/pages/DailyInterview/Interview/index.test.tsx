import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyInterview from './index';

// Mock all internal hooks
vi.mock('../../../react-query/mutation/DailyInterview/useInterviewQuestions', () => ({
  useInterviewQuestions: vi.fn(),
}));
vi.mock('./hooks/useInterviewSession', () => ({
  useInterviewSession: vi.fn(),
}));
vi.mock('./hooks/useRecordingManager', () => ({
  useRecordingManager: vi.fn(),
}));
vi.mock('./hooks/useSubmissionManager', () => ({
  useSubmissionManager: vi.fn(),
}));
vi.mock('./hooks/useInterviewFinisher', () => ({
  useInterviewFinisher: vi.fn(),
}));

// Mock Layout
vi.mock('./components/DailyInterviewLayout', () => ({
  default: (props: any) => (
    <div data-testid="layout-mock">
      Layout Rendered. Question: {props.session.currentQuestion?.id}
    </div>
  ),
}));

// Imports for mocking return values
import { useInterviewQuestions } from '../../../react-query/mutation/DailyInterview/useInterviewQuestions';
import { useInterviewSession } from './hooks/useInterviewSession';
import { useRecordingManager } from './hooks/useRecordingManager';
import { useSubmissionManager } from './hooks/useSubmissionManager';
import { useInterviewFinisher } from './hooks/useInterviewFinisher';

describe('DailyInterview Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default Mocks
    (useInterviewQuestions as any).mockReturnValue({
      questions: [{ id: 'q1' }],
      status: { interviewId: 'interview-1' },
    });
    (useInterviewSession as any).mockReturnValue({
      currentIndex: 0,
      currentQuestion: { id: 'q1' }, // layout renders this if present
    });
    (useRecordingManager as any).mockReturnValue({ isActive: false });
    (useSubmissionManager as any).mockReturnValue({});
    (useInterviewFinisher as any).mockReturnValue({ complete: vi.fn() });
  });

  it('should render null (or loading) if currentQuestion is missing', () => {
    // Override session to return no current question
    (useInterviewSession as any).mockReturnValue({
      currentIndex: 0,
      currentQuestion: undefined,
    });

    const { container } = render(<DailyInterview />);
    
    // Should default to null return in component
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('layout-mock')).not.toBeInTheDocument();
  });

  it('should render DailyInterviewLayout when data is ready', () => {
    render(<DailyInterview />);

    expect(screen.getByTestId('layout-mock')).toBeInTheDocument();
    expect(screen.getByText('Layout Rendered. Question: q1')).toBeInTheDocument();
  });

  it('should initialize hooks with correct data flow', () => {
    render(<DailyInterview />);

    // Check if useInterviewSession was called with questions from useInterviewQuestions
    expect(useInterviewSession).toHaveBeenCalledWith({
      questions: [{ id: 'q1' }]
    });

    // Check if useSubmissionManager received interviewId
    expect(useSubmissionManager).toHaveBeenCalledWith(
        expect.objectContaining({ interviewId: 'interview-1', currentIndex: 0 })
    );
  });
});
