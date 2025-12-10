import { Tab, Tabs, type TabsProps } from '@mui/material';

export default function SettingsTabs(props: TabsProps) {
  return (
    <Tabs
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
      {...props}
    >
      <Tab label="질문 설정" />
      <Tab label="피드백 템플릿 설정" />
    </Tabs>
  );
}
