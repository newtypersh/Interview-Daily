import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeedbackContainer from './index';

// Mocks
const mockMutate = vi.fn();
const mockUseInterviewAnswers = vi.fn();
const mockUseFeedbackTemplatesByCategory = vi.fn();

// Mock Modules
vi.mock('../../../react-query/queries/useInterviewAnswers', () => ({
  useInterviewAnswers: (id: string) => mockUseInterviewAnswers(id),
}));

vi.mock('../../../react-query/queries/useFeedbackTemplates', () => ({
  useFeedbackTemplatesByCategory: () => mockUseFeedbackTemplatesByCategory(),
}));

vi.mock('../../../react-query/mutation/useSubmitFeedback', () => ({
  useSubmitFeedback: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

// Mock FeedbackLayout to avoid heavy MUI dependencies (EMFILE issue) & simplify testing
vi.mock('./components/FeedbackLayout', async () => {
  const { Controller } = await import('react-hook-form');
  
  return {
    default: ({ control, onSubmit, feedbackItems, templateContent, category, isSubmitting, onPlayAudio, playingAudio }: import('./components/FeedbackLayout').FeedbackLayoutProps) => (
      <div data-testid="mock-layout">
        <h1>Feedback Mock Layout</h1>
        
        {/* Props Verification Section */}
        <div data-testid="props-debug">
            <span data-testid="prop-template">{templateContent}</span>
            <span data-testid="prop-category">{category}</span>
            <span data-testid="prop-isSubmitting">{String(isSubmitting)}</span>
            <span data-testid="prop-playingAudio">{String(playingAudio)}</span>
            <button data-testid="btn-play-audio" onClick={() => onPlayAudio('test-audio-id')}>Play Audio</button>
        </div>

        {/* Render feedback items to verify props passing */}
        <ul data-testid="feedback-list">
          {feedbackItems?.map((item) => (
            <li key={item.id}>{item.content}</li>
          ))}
        </ul>
        
        {/* Bind to the first question's rating for testing */}
        <Controller
            name="feedbacks.q1.rating"
            control={control}
            render={({ field, fieldState }) => (
                <div data-testid="field-wrapper">
                    <label>
                        Rating Input
                        {/* Use number input for rating */}
                        <input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            value={field.value || 0}
                        />
                    </label>
                    {fieldState.error && <span data-testid="error-msg">{fieldState.error.message}</span>}
                </div>
            )}
        />
        <button onClick={onSubmit}>제출하기</button>
      </div>
    )
  };
});

// Mock Data
const mockInterviewData = {
  interview: {
    category: 'CS',
    answers: [
      {
        id: 'a1',
        questionId: 'q1',
        sequence: 1,
        questionContent: 'Question 1',
        interviewId: 'test-id',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        audioUrl: null,
      },
    ],
  },
  isPending: false,
  error: null,
};

describe('FeedbackPage Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // Default Setup
    mockUseInterviewAnswers.mockReturnValue(mockInterviewData);
    mockUseFeedbackTemplatesByCategory.mockReturnValue({ templates: [], isPending: false });
  });

  const renderPage = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/feedback/test-id']}>
          <Routes>
            <Route path="/feedback/:interviewId" element={<FeedbackContainer />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('should render page and pass correct props to layout', async () => {
    // Setup Mock for prop verification
    const mockTemplates = [{ id: 't1', templateText: 'Good Job Template' }];
    mockUseFeedbackTemplatesByCategory.mockReturnValue({ templates: mockTemplates, isPending: false });

    renderPage();

    // 1. Verify Data Prop (Existing)
    expect(screen.getByTestId('feedback-list')).toHaveTextContent('Question 1');

    // 2. Verify Other Props
    expect(screen.getByTestId('prop-template')).toHaveTextContent('Good Job Template');
    expect(screen.getByTestId('prop-category')).toHaveTextContent('CS');
    expect(screen.getByTestId('prop-isSubmitting')).toHaveTextContent('false');
    
    // 3. Verify Audio Handler Wiring
    // Clicking play button in layout should trigger the state change in the hook, 
    // which then updates the 'playingAudio' prop passed back to layout.
    // NOTE: changing state requires re-render.
    
    const playBtn = screen.getByTestId('btn-play-audio');
    fireEvent.click(playBtn);
    
    // We expect the 'playingAudio' prop to change to 'test-audio-id' (logic inside useFeedbackForm)
    // Audio toggling involves setTimeout logic in useFeedbackForm, so we might need waitFor or timer usage if we really want to test the full loop.
    // However, for integration 'wiring' test, checking if the prop update reflects is sufficient.
    
    // Since we are mocking timers in unit test, here we are in "Real" timer environment or default Vitest env.
    // The useFeedbackForm uses normal state updates.
    await waitFor(() => {
         expect(screen.getByTestId('prop-playingAudio')).toHaveTextContent('test-audio-id');
    });
  });

  it('should show validation error when submitting without rating', async () => {
    renderPage();

    // Click submit
    const submitBtn = screen.getByText('제출하기');
    fireEvent.click(submitBtn);

    // Expect validation error
    await waitFor(() => {
      expect(screen.getByTestId('error-msg')).toHaveTextContent('평가를 완료해주세요.');
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should submit successfully when form is valid', async () => {
    renderPage();

    // 1. Set Rating to 5
    const input = screen.getByLabelText('Rating Input');
    fireEvent.change(input, { target: { value: '5' } });

    // 2. Click Submit
    const submitBtn = screen.getByText('제출하기');
    fireEvent.click(submitBtn);

    // 3. Verify Mutate Call
    await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    const payload = mockMutate.mock.calls[0][0];
    expect(payload.feedbacks[0].rating).toBe(5);
  });
});
