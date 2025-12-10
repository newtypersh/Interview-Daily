import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import MarkdownPreview from '../../../components/MarkdownPreview';
import { type UI_FeedbackTemplate } from '../../../hooks/useFeedbackTemplates';
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
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {template.title}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Editor */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              편집기
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleSaveClick}
              disabled={isUpdating}
            >
              저장
            </Button>
          </Box>
          <TextField
            multiline
            fullWidth
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="마크다운 형식으로 작성하세요..."
            sx={{
              flex: 1,
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                height: '480px',
                alignItems: 'flex-start',
                padding: '16px',
              },
              '& .MuiInputBase-input': {
                height: '100% !important',
                overflow: 'auto !important',
                padding: '0 !important',
              },
            }}
          />
        </Box>

        {/* Preview */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            미리보기
          </Typography>
          <MarkdownPreview
            content={content}
            sx={{ height: 'calc(480px - 2px)' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
