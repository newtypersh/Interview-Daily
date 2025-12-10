import { IconButton, type IconButtonProps } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteIconButton({ sx, ...props }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      color="error"
      sx={{
        ...sx,
      }}
      {...props}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
}
