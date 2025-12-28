import {
  Box,
  Stack,
  CircularProgress,
} from '@mui/material';
import { CustomSnackbar, useSnackbar } from '../../components/snackbar/CustomSnackbar';

import { useFeedbackTemplates } from './hooks/useFeedbackTemplates';
import type { UI_FeedbackTemplate } from './types';
import FeedbackTemplateItem from './components/FeedbackTemplateItem';

export default function FeedbackTemplateSection() {
  const { templates, isPending, updateTemplate, isUpdating } = useFeedbackTemplates();
  const { open, message, severity, showSnackbar, closeSnackbar } = useSnackbar();

  const handleSave = (template: UI_FeedbackTemplate, content: string) => {
    updateTemplate(
      {
        category: template.type,
        content,
      },
      {
        onSuccess: () => {
          showSnackbar('템플릿이 저장되었습니다.', 'success');
        },
        onError: () => {
          showSnackbar('템플릿 저장에 실패했습니다.', 'error');
        },
      }
    );
  };

  if (isPending) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {templates.map((template) => (
        <FeedbackTemplateItem
          key={template.type}
          template={template}
          onSave={handleSave}
          isUpdating={isUpdating}
          showSnackbar={showSnackbar}
        />
      ))}
      <CustomSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={closeSnackbar}
      />
    </Stack>
  );
}
