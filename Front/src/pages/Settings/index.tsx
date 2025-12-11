import { useState } from 'react';
import { Box } from '@mui/material';
import QuestionSetSection from './QuestionSetSection';
import FeedbackTemplateSection from './FeedbackTemplateSection';
import PageContainer from '../../components/PageContainer';
import ContentCard from '../../components/ContentCard';
import SettingsTabs from './components/SettingsTabs';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageContainer>
      <ContentCard>
        <SettingsTabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        />

        <Box sx={{ p: { xs: 3, md: 6 } }}>
            {activeTab === 0 ? <QuestionSetSection /> : <FeedbackTemplateSection />}
        </Box>
      </ContentCard>
    </PageContainer>
  );
}
