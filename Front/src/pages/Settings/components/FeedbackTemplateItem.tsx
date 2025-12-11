import { useState } from 'react';
import { Button } from '@mui/material';
import ContentBox from '../../../components/ContentBox';
import MarkdownEditor from '../../../components/MarkdownEditor';
import { type UI_FeedbackTemplate } from '../hooks/useFeedbackTemplates';
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

  // Sync state if template content updates from server (optional, but good practice)
  // Actually, if we are editing, we might not want to overwrite user's work. 
  // But for now let's assume local state takes precedence only during edit.
  // A simple way is to initialize state props.
  // The Parent logic was: `editedContent[type] ?? template.content`.
  // So if we type, we are "dirty".
  // Let's replicate this behavior simply:
  // We maintain local content. 

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
