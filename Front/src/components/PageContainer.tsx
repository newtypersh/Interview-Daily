import type { ReactNode } from 'react';
import { Box, Container, type ContainerProps } from '@mui/material';

interface PageContainerProps extends ContainerProps {
  children: ReactNode;
}

export default function PageContainer({ children, maxWidth = 'lg', ...props }: PageContainerProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 8 }}>
      <Container maxWidth={maxWidth} {...props}>
        {children}
      </Container>
    </Box>
  );
}
