import { Box, type BoxProps } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps extends BoxProps {
  content: string;
}

export default function MarkdownPreview({ content, sx, ...props }: MarkdownPreviewProps) {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        p: 2,
        height: '100%',
        overflowY: 'auto',
        bgcolor: '#fcfcfc',
        boxSizing: 'border-box',
        '& h1, & h2, & h3': { fontWeight: 600, mt: 2, mb: 1 },
        '& h1': { fontSize: '1.5rem' },
        '& h2': { fontSize: '1.25rem' },
        '& h3': { fontSize: '1.1rem' },
        '& p': { mb: 1 },
        '& ul, & ol': { pl: 3, mb: 1 },
        '& li': { mb: 0.5 },
        ...sx, // Allow overriding styles if needed
      }}
      {...props}
    >
      <div className="markdown-preview">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </Box>
  );
}
