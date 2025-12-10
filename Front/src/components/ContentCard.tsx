import type { ReactNode } from 'react';
import { Paper, type PaperProps } from '@mui/material';

interface ContentCardProps extends PaperProps {
  children: ReactNode;
}

export default function ContentCard({ children, sx, ...props }: ContentCardProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}
