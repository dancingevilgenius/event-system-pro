import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import {
  createEmptyEventPass,
  sanitizePassCostInput,
  type EventPassFormState,
} from '../lib/eventPasses';
import AppTextField from './AppTextField';
import DeleteIcon from './DeleteIcon';

const passFieldsColumnSx = {
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  boxSizing: 'border-box',
} as const;

const fieldGroupSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  p: { xs: 1.5, sm: 2 },
  width: '100%',
} as const;

type EventPassesProps = {
  onFieldEdit?: () => void;
};

export default function EventPasses({ onFieldEdit }: EventPassesProps) {
  const [passes, setPasses] = useState<EventPassFormState[]>([createEmptyEventPass()]);

  const updatePass = (id: string, patch: Partial<Pick<EventPassFormState, 'name' | 'cost'>>) => {
    setPasses((current) =>
      current.map((pass) => (pass.id === id ? { ...pass, ...patch } : pass)),
    );
    onFieldEdit?.();
  };

  const handleAddPass = () => {
    setPasses((current) => [...current, createEmptyEventPass()]);
    onFieldEdit?.();
  };

  const handleRemovePass = (id: string) => {
    setPasses((current) => {
      if (current.length <= 1) {
        return current;
      }

      return current.filter((pass) => pass.id !== id);
    });
    onFieldEdit?.();
  };

  return (
    <Box sx={passFieldsColumnSx}>
      <Stack spacing={2}>
        {passes.map((pass, index) => (
          <Box key={pass.id} sx={fieldGroupSx}>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
            >
              <Typography variant="subtitle2">
                Pass {index + 1}
              </Typography>
              {passes.length > 1 ? (
                <IconButton
                  size="small"
                  aria-label={`Remove pass ${index + 1}`}
                  onClick={() => handleRemovePass(pass.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Stack>
            <Stack spacing={2}>
              <AppTextField
                label="Name"
                value={pass.name}
                onChange={(event) => updatePass(pass.id, { name: event.target.value })}
                fullWidth
              />
              <AppTextField
                label="Cost"
                value={pass.cost}
                onChange={(event) =>
                  updatePass(pass.id, { cost: sanitizePassCostInput(event.target.value) })
                }
                fullWidth
                slotProps={{
                  htmlInput: {
                    inputMode: 'decimal',
                  },
                }}
              />
            </Stack>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleAddPass}>
            Add another
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
