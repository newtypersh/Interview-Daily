import { Add as AddIcon } from '@mui/icons-material';
import DashedButton from '../../../components/DashedButton';
import { type ButtonProps } from '@mui/material';

export default function AddButton({ sx, children, ...props }: ButtonProps) {
  return (
    <DashedButton
      fullWidth
      startIcon={<AddIcon />}
      sx={{ ...sx }}
      {...props}
    >
      {children}
    </DashedButton>
  );
}
