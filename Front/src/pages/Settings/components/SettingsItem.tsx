import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Collapse,
  type Theme,
  type SxProps,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIconButton from '../../../components/DeleteIconButton';
import type { ZodSchema } from 'zod';

interface SettingsItemProps {
  index: number;
  value: string;
  onUpdate: (value: string) => void;
  onDelete: () => void;
  validationSchema?: ZodSchema;
  children?: React.ReactNode;
  expanded?: boolean;
  onExpandToggle?: () => void;
  sx?: SxProps<Theme>;
  // Style props
  alignItems?: 'center' | 'flex-start';
  gap?: number;
  inputVariant?: 'standard' | 'outlined' | 'filled';
  indexFormat?: (index: number) => string;
  inputPlaceholder?: string;
}

export default function SettingsItem({
  index,
  value,
  onUpdate,
  onDelete,
  validationSchema,
  children,
  expanded = false,
  onExpandToggle,
  sx,
  alignItems = 'flex-start',
  gap = 1,
  inputVariant = 'outlined',
  indexFormat = (i) => `${i + 1}.`,
  inputPlaceholder,
}: SettingsItemProps) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== value) {
      if (validationSchema) {
        // Validation logic if needed
      }
      onUpdate(trimmed);
    } else if (!trimmed && value) {
       setText(value);
    }
  };

  const handleValidateAndSave = () => {
     handleBlur();
  }
 
  return (
    <Box sx={sx}>
      <Box
        sx={{
          display: 'flex',
          alignItems,
          gap,
          p: 1.5,
          bgcolor: expanded ? 'grey.50' : 'transparent',
          borderRadius: 1,
          transition: 'background-color 0.2s',
        }}
      >
        <Typography
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            minWidth: 24,
            pt: alignItems === 'flex-start' ? 1 : 0,
            fontSize: alignItems === 'flex-start' ? '0.875rem' : 'var(--text-base)',
          }}
        >
          {indexFormat(index)}
        </Typography>

        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleValidateAndSave}
          variant={inputVariant}
          fullWidth
          multiline
          placeholder={inputPlaceholder}
          size={inputVariant === 'outlined' ? 'small' : 'medium'}
          InputProps={{ 
            ...(inputVariant === 'standard' && !expanded && !children && { disableUnderline: true })
          }}
          inputProps={{ sx: { fontWeight: 600 } }}
        />

        {onExpandToggle && (
          <IconButton
            onClick={onExpandToggle}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}

        <DeleteIconButton 
          onClick={onDelete} 
          sx={{ mt: alignItems === 'flex-start' ? 0.5 : (onExpandToggle ? 0 : 0.5) }} 
        />
      </Box>
      
      {children && (
        <Collapse in={expanded} unmountOnExit>
          {children}
        </Collapse>
      )}
    </Box>
  );
}
