import { useState } from 'react';
import { Button } from '@mui/material';
import ContentBox from '../../../components/ContentBox';
import MarkdownEditor from '../../../components/MarkdownEditor';
import { type UI_FeedbackTemplate } from '../types';
import { FeedbackTemplateContentSchema } from '../../../schemas/settings';

interface FeedbackTemplateItemProps {
  template: UI_FeedbackTemplate;
  onSave: (template: UI_FeedbackTemplate, content: string) => void;
  isUpdating: boolean;
  showSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export default function FeedbackTemplateItem({
  template,
  onSave,
  isUpdating,
  showSnackbar,
}: FeedbackTemplateItemProps) {
  const [content, setContent] = useState(template.content);

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSaveClick = () => {
    // Validation
    const validation = FeedbackTemplateContentSchema.safeParse({ content });
    
    if (!validation.success) {
      showSnackbar(validation.error.issues[0].message, 'error');
      return;
    }

    onSave(template, content);
  };

  return (
    <ContentBox title={template.title}>
      <MarkdownEditor
        value={content}
        onChange={handleContentChange}
        disabled={isUpdating}
        actions={
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveClick}
            disabled={isUpdating}
          >
            저장
          </Button>
        }
      />
    </ContentBox>
  );
}
