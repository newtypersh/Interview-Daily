import { useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import { useFeedbackTemplates, type UI_FeedbackTemplate } from '../../hooks/useFeedbackTemplates';
import { INTERVIEW_CATEGORIES } from '../../constants/interview';

export default function FeedbackTemplateSection() {
  const { templates, updateTemplate, isUpdating } = useFeedbackTemplates();
  
  // Local state for editing content before saving
  // We need to initialize this when templates are loaded, or handle it via a controlled input that updates the local cache
  // However, the original code updated the 'templates' state directly.
  // Since 'templates' from the hook is read-only (from useQuery), we need local state for editing.
  // But wait, the original code used setTemplates to update the local state.
  // Here, we should probably maintain a local copy of the content being edited.
  
  // Let's use a simple approach: The hook returns the data. We can't easily mutate it locally without re-fetching or complex cache updates.
  // But for a text editor, we need instant feedback.
  // So, we will use a local state map for edits: { [type]: content }
  
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

  return (
    <>
      <Stack spacing={4}>
        {templates.map((template) => (
          <Box
            key={template.type}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3, bgcolor: 'white' }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {template.title}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {/* Editor */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    편집
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
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
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  미리보기
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    height: 'calc(480px - 2px)',
                    overflowY: 'auto',
                    bgcolor: '#fcfcfc',
                    boxSizing: 'border-box',
                    '& h1, & h2, & h3': { fontWeight: 600, mt: 2, mb: 1 },
                    '& h1': { fontSize: '1.5rem' },
                    '& h2': { fontSize: '1.25rem' },
                    '& h3': { fontSize: '1.1rem' },
                    '& p': { mb: 1 },
                    '& ul, & ol': { pl: 3, mb: 1 },
                    '& li': { mb: 0.5 },
                  }}
                >
                  <ReactMarkdown>{getContent(template)}</ReactMarkdown>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
