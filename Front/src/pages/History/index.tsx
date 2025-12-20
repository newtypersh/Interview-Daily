import { Box, Container, Typography, CircularProgress, Stack, Button } from '@mui/material';
import { useInterviewHistory } from '../../react-query/queries/useInterviewHistory';
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
    error,
  } = useInterviewHistory();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography color="error">기록을 불러오는 중 오류가 발생했습니다.</Typography>
        {import.meta.env.DEV && (
            <Typography variant="caption" color="text.secondary">
              {error?.message}
            </Typography>
        )}
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

        {hasNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="outlined" 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage}
              size="large"
            >
              {isFetchingNextPage ? <CircularProgress size={24} color="inherit" /> : '더보기'}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
