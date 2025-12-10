import { useState } from 'react';
import {
  Box,
  Tab,
} from '@mui/material';
import QuestionSetSection from './QuestionSetSection';
import FeedbackTemplateSection from './FeedbackTemplateSection';
import PageContainer from '../../components/PageContainer';
import ContentCard from '../../components/ContentCard';
import CustomTabs from '../../components/CustomTabs';

export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageContainer>
      <ContentCard>
        <CustomTabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label="질문 설정" />
          <Tab label="피드백 템플릿 설정" />
        </CustomTabs>

        <Box sx={{ p: { xs: 3, md: 6 } }}>
          {activeTab === 0 ? <QuestionSetSection /> : <FeedbackTemplateSection />}
        </Box>
      </ContentCard>
    </PageContainer>
  );
}
