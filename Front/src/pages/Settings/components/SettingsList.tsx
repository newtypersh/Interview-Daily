import { Stack, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import AddButton from './AddButton';

type SettingsListProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onAdd: () => void;
  addButtonLabel: string;
  addButtonSx?: SxProps<Theme>;
  gap?: number;
}

export default function SettingsList<T>({
  data,
  renderItem,
  onAdd,
  addButtonLabel,
  addButtonSx,
  gap = 1.5, // Default gap matching QuestionList
}: SettingsListProps<T>) {
  return (
    <>
      <Stack spacing={gap}>
        {data.map((item, index) => renderItem(item, index))}
        <AddButton onClick={onAdd} sx={addButtonSx}>
          {addButtonLabel}
        </AddButton>
      </Stack>
    </>
  );
}
