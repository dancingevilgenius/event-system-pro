import type { ThemeOptions } from '@mui/material/styles';

export type SkinId = 'default' | 'dark';

export type SkinDefinition = {
  id: SkinId;
  label: string;
  theme: ThemeOptions;
};
