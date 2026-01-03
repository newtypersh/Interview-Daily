import { useState, useMemo, useCallback } from 'react';
import type { UI_FeedbackTemplate } from '../types';
import { useSnackbar, type UseSnackbarReturn } from '../../../hooks/useSnackbar';
import { useFeedbackTemplatesByCategory } from '../../../react-query/queries/useFeedbackTemplates';
import { useUpdateFeedbackTemplate } from '../../../react-query/mutation/useFeedbackTemplateMutations';
import { CATEGORY_TITLES } from '../../../constants/interview';


interface UseFeedbackTemplateEditorReturn extends UseSnackbarReturn {
  templates: UI_FeedbackTemplate[];
  isUpdating: boolean;
  getContent: (template: UI_FeedbackTemplate) => string;
  handleContentChange: (type: string, content: string) => void;
  handleSave: (template: UI_FeedbackTemplate) => void;
}

export const useFeedbackTemplateEditor = (category: string): UseFeedbackTemplateEditorReturn => {
  // 1. Data Access & Mutation
  const { templates: rawTemplates } = useFeedbackTemplatesByCategory(category);
  const { mutate: updateTemplate, isPending: isUpdating } = useUpdateFeedbackTemplate();
  const snackbar = useSnackbar();

  // 2. Derived State (Memoized)
  const templates = useMemo(() => {
    return (rawTemplates || []).map((t) => ({
      type: t.category,
      title: CATEGORY_TITLES[t.category],
      content: t.templateText || '',
    }));
  }, [rawTemplates]);

  // 3. Local UI State
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  // 4. Handlers
  const handleContentChange = useCallback((type: string, content: string) => {
    setDrafts((prev) => ({ ...prev, [type]: content }));
  }, []);

  const getContent = useCallback((template: UI_FeedbackTemplate) => {
    return drafts[template.type] ?? template.content;
  }, [drafts]);

  const handleSave = useCallback((template: UI_FeedbackTemplate) => {
    const content = getContent(template);
    
    updateTemplate(
      { category: template.type, content },
      {
        onSuccess: () => snackbar.openSnackbar('템플릿이 성공적으로 저장되었습니다.', 'success'),
        onError: () => snackbar.openSnackbar('템플릿 저장에 실패했습니다.', 'error'),
      }
    );
  }, [getContent, updateTemplate, snackbar]);

  return {
    templates,
    isUpdating,
    getContent,
    handleContentChange,
    handleSave,
    ...snackbar,
  };
};
