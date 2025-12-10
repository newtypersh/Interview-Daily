import { Button, type ButtonProps } from '@mui/material';

export default function DashedButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      variant="outlined"
      sx={{
        borderStyle: 'dashed',
        borderWidth: 2,
        color: 'text.secondary',
        borderColor: 'divider',
        '&:hover': {
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: 'text.secondary',
          bgcolor: 'transparent',
        },
        ...sx,
      }}
      {...props}
    />
  );
}
