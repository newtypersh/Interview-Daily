import { useState } from 'react';
import { TextField } from '@mui/material';

interface QuestionInputProps {
  id: string;
  initialText: string;
  onUpdate: (id: string, text: string) => void;
}

export default function QuestionInput({ id, initialText, onUpdate }: QuestionInputProps) {
  const [text, setText] = useState(initialText);

  const handleBlur = () => {
    if (text.trim() && text !== initialText) {
      onUpdate(id, text);
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
