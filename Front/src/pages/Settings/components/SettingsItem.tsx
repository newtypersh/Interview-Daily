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

type SettingsItemOptions = {
  alignItems?: 'center' | 'flex-start';
  gap?: number;
  inputVariant?: 'standard' | 'outlined' | 'filled';
  indexFormat?: (index: number) => string;
  placeholder?: string;
  validationSchema?: ZodSchema;
  sx?: SxProps<Theme>;
}

type SettingsItemProps = {
  index: number;
  value: string;
  onUpdate: (value: string) => void;
  onDelete: () => void;
  children?: React.ReactNode;
  expanded?: boolean;
  onExpandToggle?: () => void;
  options?: SettingsItemOptions;
}

export default function SettingsItem({
  index,
  value,
  onUpdate,
  onDelete,
  children,
  expanded = false,
  onExpandToggle,
  options = {},
}: SettingsItemProps) {
  const {
    alignItems = 'flex-start',
    gap = 1,
    inputVariant = 'outlined',
    indexFormat = (i) => `${i + 1}.`,
    placeholder: inputPlaceholder,
    validationSchema,
    sx,
  } = options;
  const [text, setText] = useState(value);
  /* New State for Validation */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(value);
    setError(null); 
  }, [value]);

  const handleValidate = (val: string): { success: boolean; msg?: string } => {
      if (!validationSchema) return { success: true };
      
      const res = validationSchema.safeParse(val);
      if (res.success) return { success: true };
      
      const firstError = res.error.issues[0]?.message;
      return { success: false, msg: firstError };
  };

  const onBlurHandler = () => {
    const trimmed = text.trim();
    
    if (validationSchema) {
        const { success, msg } = handleValidate(trimmed);
        if (!success) {
            setError(msg || 'Invalid input');
            return;
        }
    }
    
    if (trimmed && trimmed !== value) {
      onUpdate(trimmed);
      setError(null);
    } else if (!trimmed && value) {
       setText(value);
    }
  };

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
          onChange={(e) => {
             setText(e.target.value);
             if (error) setError(null);
          }}
          onBlur={onBlurHandler}
          variant={inputVariant}
          fullWidth
          multiline
          placeholder={inputPlaceholder}
          error={!!error}
          helperText={error}
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
