import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import QuestionSetSection from './QuestionSetSection';
import FeedbackTemplateSection from './FeedbackTemplateSection';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
              },
            }}
          >
            <Tab label="질문 설정" />
            <Tab label="피드백 템플릿 설정" />
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 6 } }}>
            {activeTab === 0 ? <QuestionSetSection /> : <FeedbackTemplateSection />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
