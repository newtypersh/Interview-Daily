import { render, screen, fireEvent } from '@testing-library/react';
import MarkdownEditor from './MarkdownEditor';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom'; // Included for custom matchers like toBeInTheDocument

// Mock MarkdownPreview to avoid testing external libraries and focus on the Editor component
vi.mock('./MarkdownPreview', () => ({
  default: ({ content, ...props }: { content: string; [key: string]: any }) => (
    <div data-testid="markdown-preview" data-content={content} {...props}>
      {content}
    </div>
  ),
}));

describe('MarkdownEditor', () => {
  const mockOnChange = vi.fn();

  it('should render editor and preview sections', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />);

    expect(screen.getByText('편집기')).toBeInTheDocument();
    expect(screen.getByText('미리보기')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
  });

  it('should display the initial value', () => {
    const initialValue = '# Hello World';
    render(<MarkdownEditor value={initialValue} onChange={mockOnChange} />);

    // Check textarea value
    // MUI TextField renders a textarea/input ultimately
    const textarea = screen.getByDisplayValue(initialValue);
    expect(textarea).toBeInTheDocument();

    // Check preview receives the content (via our mock)
    const preview = screen.getByTestId('markdown-preview');
    expect(preview).toHaveAttribute('data-content', initialValue);
  });

  it('should call onChange when user types', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />);

    const textarea = screen.getByPlaceholderText('마크다운 형식으로 작성하세요...');
    
    // Simulate typing
    fireEvent.change(textarea, { target: { value: 'New text' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('New text');
  });

  it('should disable the textarea when disabled prop is true', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} disabled={true} />);

    const textarea = screen.getByPlaceholderText('마크다운 형식으로 작성하세요...');
    expect(textarea).toBeDisabled();
  });
});
