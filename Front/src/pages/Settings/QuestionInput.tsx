import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { QuestionContentSchema } from '../../schemas/settings';

interface QuestionInputProps {
  id: string | number;
  initialText: string;
  onUpdate: (id: string | number, text: string) => void;
}

export default function QuestionInput({ id, initialText, onUpdate }: QuestionInputProps) {
  const [text, setText] = useState(initialText);

  // Update local state if initialText changes
  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleBlur = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== initialText) {
      const validation = QuestionContentSchema.safeParse({ content: trimmed });
      if (!validation.success) {
        alert(validation.error.issues[0]?.message || 'Invalid input');
        setText(initialText); // reset to original
        return;
      }
      onUpdate(id, trimmed);
    } else if (!trimmed && initialText) {
      // If user cleared the text but it had value, revert (unless we support delete via clearing?)
      // Assuming revert based on snippet logic
      setText(initialText);
    }
  };

  return (
    <TextField
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      placeholder="질문을 입력하세요"
      size="small"
      fullWidth
      multiline
    />
  );
}
