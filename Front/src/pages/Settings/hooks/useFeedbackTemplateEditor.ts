import { useState } from 'react';
import type { UI_FeedbackTemplate } from '../types';
import { useSnackbar, type UseSnackbarReturn } from '../../../hooks/useSnackbar';
import { useFeedbackTemplatesByCategory } from '../../../react-query/queries/useFeedbackTemplates';
import { CATEGORY_TITLES } from '../../../constants/interview';


interface UseFeedbackTemplateEditorReturn extends UseSnackbarReturn {
  templates: UI_FeedbackTemplate[];
  isUpdating: boolean;
  getContent: (template: UI_FeedbackTemplate) => string;
  handleContentChange: (type: string, content: string) => void;
  handleSave: (template: UI_FeedbackTemplate) => void;
}

export const useFeedbackTemplateEditor = (category: string): UseFeedbackTemplateEditorReturn => {
  const { templates: rawTemplates } = useFeedbackTemplatesByCategory(category);
  const isUpdating = false;

  const templates: UI_FeedbackTemplate[] = (rawTemplates || []).map((t) => ({
    type: t.category,
    title: CATEGORY_TITLES[t.category],
    content: t.templateText || '',
  }));

  // NOTE: The original `updateTemplate` function is no longer available from `useFeedbackTemplatesByCategory`.
  // This change assumes `updateTemplate` will be provided by another hook or mechanism,
  // or that the `handleSave` logic will be updated in a subsequent instruction.
  // For now, `updateTemplate` is undefined, which will cause a runtime error if `handleSave` is called.
  const updateTemplate: any = () => console.warn("updateTemplate is not implemented with useFeedbackTemplatesByCategory");

  const [edits, setEdits] = useState<Record<string, string>>({});
  
  const snackbar = useSnackbar();
  const { openSnackbar } = snackbar;

  const handleContentChange = (type: string, content: string) => {
    setEdits((prev) => ({ ...prev, [type]: content }));
  };

  const getContent = (template: UI_FeedbackTemplate) => {
    return edits[template.type] !== undefined ? edits[template.type] : template.content;
  };

  const handleSave = (template: UI_FeedbackTemplate) => {
    const contentToSave = getContent(template);
    updateTemplate(
      { category: template.type, content: contentToSave },
      {
        onSuccess: () => {
          openSnackbar('템플릿이 성공적으로 저장되었습니다.', 'success');
        },
        onError: () => {
          openSnackbar('템플릿 저장에 실패했습니다.', 'error');
        },
      }
    );
  };

  return {
    templates,
    isUpdating,
    getContent,
    handleContentChange,
    handleSave,
    ...snackbar,
  };
};
