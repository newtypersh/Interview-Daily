import { Tabs, type TabsProps } from '@mui/material';

export default function CustomTabs({ sx, ...props }: TabsProps) {
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
        ...sx,
      }}
      {...props}
    />
  );
}
