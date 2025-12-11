import { useState } from 'react';
import { useFeedbackTemplates, type UI_FeedbackTemplate } from './useFeedbackTemplates';
import { useSnackbar } from '../../../hooks/useSnackbar';

interface UseFeedbackTemplateEditorReturn {
  templates: UI_FeedbackTemplate[];
  isUpdating: boolean;
  getContent: (template: UI_FeedbackTemplate) => string;
  handleContentChange: (type: string, content: string) => void;
  handleSave: (template: UI_FeedbackTemplate) => void;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
  handleSnackbarClose: () => void;
}

export const useFeedbackTemplateEditor = (): UseFeedbackTemplateEditorReturn => {
  const { templates, updateTemplate, isUpdating } = useFeedbackTemplates();
  const [edits, setEdits] = useState<Record<string, string>>({});
  
  const { 
    snackbarOpen, 
    snackbarMessage, 
    snackbarSeverity, 
    openSnackbar, 
    closeSnackbar 
  } = useSnackbar();

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
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleSnackbarClose: closeSnackbar,
  };
};
