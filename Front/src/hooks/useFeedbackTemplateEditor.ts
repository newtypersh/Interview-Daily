import { useState } from 'react';
import { useFeedbackTemplates, type UI_FeedbackTemplate } from './useFeedbackTemplates';

interface UseFeedbackTemplateEditorReturn {
  templates: UI_FeedbackTemplate[];
  isUpdating: boolean;
  getContent: (template: UI_FeedbackTemplate) => string;
  handleContentChange: (type: string, content: string) => void;
  handleSave: (template: UI_FeedbackTemplate) => void;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error';
  handleSnackbarClose: () => void;
}

export const useFeedbackTemplateEditor = (): UseFeedbackTemplateEditorReturn => {
  const { templates, updateTemplate, isUpdating } = useFeedbackTemplates();
  const [edits, setEdits] = useState<Record<string, string>>({});
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

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
          setSnackbarMessage('템플릿이 성공적으로 저장되었습니다.');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        },
        onError: () => {
          setSnackbarMessage('템플릿 저장에 실패했습니다.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        },
      }
    );
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
    handleSnackbarClose,
  };
};
