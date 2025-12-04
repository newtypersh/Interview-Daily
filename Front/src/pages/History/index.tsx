import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box, Container, Typography, CircularProgress, Stack } from '@mui/material';
import { useInterviewHistory } from '../../hooks/useInterviewHistory';
import HistoryItem from './HistoryItem';
import EmptyState from './EmptyState';

export default function History() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInterviewHistory();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">기록을 불러오는 중 오류가 발생했습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          면접 기록
        </Typography>

        <Stack spacing={2}>
          {data?.pages.map((page) =>
            page.data.map((interview) => (
              <HistoryItem key={interview.id} interview={interview} />
            ))
          )}
        </Stack>
        
        {data?.pages[0]?.data.length === 0 && (
             <EmptyState message="아직 면접 기록이 없습니다." />
        )}

        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <div ref={ref} style={{ height: 20 }} />
      </Container>
    </Box>
  );
}
