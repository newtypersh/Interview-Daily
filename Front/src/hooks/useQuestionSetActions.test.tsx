import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuestionSetActions } from './useQuestionSetActions';
import { useQuestionsQuery } from '../react-query/queries/useQuestionsQuery';
import { useDeleteQuestionSet, useUpdateQuestionSet } from '../react-query/mutation/useQuestionSetMutations';
import { useCreateQuestion, useUpdateQuestion, useDeleteQuestion } from '../react-query/mutation/useQuestionMutations';

// Mock Dependencies
vi.mock('../react-query/queries/useQuestionsQuery', () => ({
  useQuestionsQuery: vi.fn(),
}));

vi.mock('../react-query/mutation/useQuestionSetMutations', () => ({
  useDeleteQuestionSet: vi.fn(),
  useUpdateQuestionSet: vi.fn(),
}));

vi.mock('../react-query/mutation/useQuestionMutations', () => ({
  useCreateQuestion: vi.fn(),
  useUpdateQuestion: vi.fn(),
  useDeleteQuestion: vi.fn(),
}));

describe('useQuestionSetActions', () => {
  const mockQuestionSetId = 'qs-123';
  
  // Mocks for mutation functions
  const mockCreateQuestion = vi.fn();
  const mockUpdateQuestion = vi.fn();
  const mockDeleteQuestion = vi.fn();
  const mockDeleteSet = vi.fn();
  const mockUpdateSet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    (useQuestionsQuery as any).mockReturnValue({
      data: [{ id: 'q-1', content: 'Test Question' }],
      isPending: false,
    });

    (useCreateQuestion as any).mockReturnValue({ mutate: mockCreateQuestion, isPending: false });
    (useUpdateQuestion as any).mockReturnValue({ mutate: mockUpdateQuestion, isPending: false });
    (useDeleteQuestion as any).mockReturnValue({ mutate: mockDeleteQuestion, isPending: false });
    (useDeleteQuestionSet as any).mockReturnValue({ mutate: mockDeleteSet, isPending: false });
    (useUpdateQuestionSet as any).mockReturnValue({ mutate: mockUpdateSet, isPending: false });
  });

  it('should return questions data from query', () => {
    const { result } = renderHook(() => useQuestionSetActions(mockQuestionSetId));

    expect(result.current.questions).toEqual([{ id: 'q-1', content: 'Test Question' }]);
    expect(result.current.isPendingQuestions).toBe(false);
    expect(useQuestionsQuery).toHaveBeenCalledWith(mockQuestionSetId, false);
  });

  it('should initialize mutations with correct questionSetId', () => {
    renderHook(() => useQuestionSetActions(mockQuestionSetId));

    expect(useCreateQuestion).toHaveBeenCalledWith(mockQuestionSetId);
    expect(useUpdateQuestion).toHaveBeenCalledWith(mockQuestionSetId);
    expect(useDeleteQuestion).toHaveBeenCalledWith(mockQuestionSetId);
  });

  it('should call deleteSet with questionSetId when executed', () => {
    const { result } = renderHook(() => useQuestionSetActions(mockQuestionSetId));

    act(() => {
      result.current.deleteSet();
    });

    expect(mockDeleteSet).toHaveBeenCalledWith(mockQuestionSetId);
  });

  it('should call updateSet with correct payload when executed', () => {
    const { result } = renderHook(() => useQuestionSetActions(mockQuestionSetId));
    const newName = 'Updated Question Set Name';

    act(() => {
        result.current.updateSet(newName);
    });

    expect(mockUpdateSet).toHaveBeenCalledWith({ id: mockQuestionSetId, name: newName });
  });

  it('should expose raw mutation functions for questions', () => {
    const { result } = renderHook(() => useQuestionSetActions(mockQuestionSetId));

    // Verify references match the mocked mutation functions
    expect(result.current.createQuestion).toBe(mockCreateQuestion);
    expect(result.current.updateQuestion).toBe(mockUpdateQuestion);
    expect(result.current.deleteQuestion).toBe(mockDeleteQuestion);
  });
});
