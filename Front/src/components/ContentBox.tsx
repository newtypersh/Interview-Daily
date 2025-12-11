import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { type ReactNode } from 'react';

interface ContentBoxProps {
  title: ReactNode;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export default function ContentBox({ title, children, sx }: ContentBoxProps) {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 3,
        bgcolor: 'white',
        ...sx,
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
