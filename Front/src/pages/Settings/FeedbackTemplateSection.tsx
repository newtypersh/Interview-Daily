import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MarkdownPreview from '../../components/MarkdownPreview';

import { type UI_FeedbackTemplate, useFeedbackTemplates } from '../../hooks/useFeedbackTemplates';
import { FeedbackTemplateContentSchema } from '../../schemas/settings';

export default function FeedbackTemplateSection() {
  const { templates, isLoading, updateTemplate, isUpdating } = useFeedbackTemplates();
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const getContent = (template: UI_FeedbackTemplate) => {
    return editedContent[template.type] ?? template.content;
  };

  const handleContentChange = (type: string, value: string) => {
    setEditedContent((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleSave = (template: UI_FeedbackTemplate) => {
    const content = getContent(template);
    
    // Zod Validation
    const validation = FeedbackTemplateContentSchema.safeParse({ content });
    
    if (!validation.success) {
      // FIX: Use .issues instead of .errors
      showSnackbar(validation.error.issues[0].message, 'error');
      return;
    }

    updateTemplate(
      {
        category: template.type,
        content,
      },
      {
        onSuccess: () => {
          showSnackbar('템플릿이 저장되었습니다.', 'success');
          // Clear local edit state after successful save so it falls back to the (now updated) server data
          setEditedContent((prev) => {
            const newState = { ...prev };
            delete newState[template.type];
            return newState;
          });
        },
        onError: () => {
          showSnackbar('템플릿 저장에 실패했습니다.', 'error');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        {templates.map((template) => (
          <Box key={template.type}>
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
                    onClick={() => handleSave(template)}
                    disabled={isUpdating}
                  >
                    저장
                  </Button>
                </Box>
                <TextField
                  multiline
                  fullWidth
                  value={getContent(template)}
                  onChange={(e) => handleContentChange(template.type, e.target.value)}
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
                  content={getContent(template)}
                  sx={{ height: 'calc(480px - 2px)' }}
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
