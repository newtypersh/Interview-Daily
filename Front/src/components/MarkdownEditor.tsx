import { Box, Typography, TextField } from '@mui/material';
import { type ReactNode } from 'react';
import MarkdownPreview from './MarkdownPreview';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  actions?: ReactNode;
  height?: string | number;
  placeholder?: string;
  disabled?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  actions,
  height = '480px',
  placeholder = '마크다운 형식으로 작성하세요...',
  disabled = false,
}: MarkdownEditorProps) {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Editor Side */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            편집기
          </Typography>
          {actions}
        </Box>
        <TextField
          multiline
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              height: height,
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

      {/* Preview Side */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          미리보기
        </Typography>
        <MarkdownPreview
          content={value}
          sx={{ 
            height: typeof height === 'string' && height.endsWith('px') 
              ? `calc(${height} - 2px)` 
              : height 
          }}
        />
      </Box>
    </Box>
  );
}
