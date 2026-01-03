import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFeedbackTemplateEditor } from './useFeedbackTemplateEditor';
import { useFeedbackTemplatesByCategory } from '../../../react-query/queries/useFeedbackTemplates';
import { useUpdateFeedbackTemplate } from '../../../react-query/mutation/useFeedbackTemplateMutations';
import { useSnackbar } from '../../../hooks/useSnackbar';

// Mock Dependencies
vi.mock('../../../react-query/queries/useFeedbackTemplates', () => ({
  useFeedbackTemplatesByCategory: vi.fn(),
}));
vi.mock('../../../react-query/mutation/useFeedbackTemplateMutations', () => ({
  useUpdateFeedbackTemplate: vi.fn(),
}));
vi.mock('../../../hooks/useSnackbar', () => ({
  useSnackbar: vi.fn(),
}));
vi.mock('../../../constants/interview', () => ({
  CATEGORY_TITLES: {
    JOB: '직무 면접',
    PERSONAL: '인성 면접',
    MOTIVATION: '지원 동기',
  },
}));

describe('useFeedbackTemplateEditor', () => {
  const mockOpenSnackbar = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default Mocks
    (useSnackbar as any).mockReturnValue({
      openSnackbar: mockOpenSnackbar,
    });

    (useFeedbackTemplatesByCategory as any).mockImplementation((category: string) => ({
      templates: [
        { category: 'JOB', templateText: 'Default Job Template' },
        { category: 'PERSONAL', templateText: 'Default Personal Template' },
      ].filter((t) => !category || t.category === category),
      isLoading: false,
    }));

    (useUpdateFeedbackTemplate as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('should initialize templates from query data', () => {
    const { result } = renderHook(() => useFeedbackTemplateEditor('JOB'));

    expect(result.current.templates).toHaveLength(1);
    expect(result.current.templates[0]).toEqual({
      type: 'JOB',
      title: '직무 면접',
      content: 'Default Job Template',
    });
  });

  it('should handle local content changes (before save)', () => {
    const { result } = renderHook(() => useFeedbackTemplateEditor('JOB'));
    const template = result.current.templates[0];

    act(() => {
      result.current.handleContentChange(template.type, 'Modified Content');
    });

    // getContent should return modified content
    expect(result.current.getContent(template)).toBe('Modified Content');
    
    // But original data shouldn't change
    expect(result.current.templates[0].content).toBe('Default Job Template');
  });

  it('should call mutation on save', () => {
    const { result } = renderHook(() => useFeedbackTemplateEditor('JOB'));
    const template = result.current.templates[0];

    act(() => {
        result.current.handleContentChange(template.type, 'New Content to Save');
    });

    act(() => {
        result.current.handleSave(template);
    });

    expect(mockMutate).toHaveBeenCalledWith(
        { category: 'JOB', content: 'New Content to Save' },
        expect.anything() // null과 undefined를 제외한 값이 들어오면 통과
    );
  });

  it('should show success snackbar when mutation succeeds', () => {
    let mutationOptions: any = {};
    (useUpdateFeedbackTemplate as any).mockReturnValue({
        mutate: (_: any, options: any) => { mutationOptions = options; },
        isPending: false,
    });

    const { result } = renderHook(() => useFeedbackTemplateEditor('JOB'));
    const template = result.current.templates[0];
    
    act(() => {
        result.current.handleSave(template);
    });

    // Trigger success manually
    act(() => {
        mutationOptions.onSuccess();
    });

    expect(mockOpenSnackbar).toHaveBeenCalledWith('템플릿이 성공적으로 저장되었습니다.', 'success');
  });
});
