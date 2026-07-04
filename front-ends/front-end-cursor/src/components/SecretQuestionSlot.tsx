import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

const slotChromeSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  p: { xs: 1.5, sm: 2 },
  width: '100%',
} as const;

type SecretQuestionSlotProps = {
  children: ReactNode;
  label?: string;
};

export default function SecretQuestionSlot({ children, label }: SecretQuestionSlotProps) {
  return (
    <Box sx={slotChromeSx}>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
          {label}
        </Typography>
      )}
      {children}
    </Box>
  );
}
