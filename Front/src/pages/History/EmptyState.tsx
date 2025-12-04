import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = '데이터가 없습니다.' }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
