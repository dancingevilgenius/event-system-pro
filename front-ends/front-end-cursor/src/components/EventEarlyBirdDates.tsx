import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { type MouseEvent, useState } from 'react';
import { mobileColumnSx } from '../constants/layout';
import {
  createInitialEarlyBirdWindows,
  type EarlyBirdWindow,
} from '../lib/eventEarlyBirdDates';
import AppTextField from './AppTextField';

export type EarlyBirdDatesMode = 'none' | 'create';

const earlyBirdModeToggleSx = {
  ...mobileColumnSx,
  '& .MuiToggleButton-root': {
    flex: 1,
    py: 1,
    px: { xs: 0.5, sm: 1.5 },
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    lineHeight: 1.2,
    whiteSpace: 'normal',
  },
} as const;

const tableContainerSx = mobileColumnSx;

const earlyBirdTableSx = {
  tableLayout: 'fixed',
  '& .MuiTableCell-root': {
    px: 1,
    py: 1.5,
    verticalAlign: 'top',
  },
  '& .MuiTableCell-root:first-of-type': {
    pr: 0.5,
  },
  '& .MuiTableCell-root + .MuiTableCell-root': {
    pl: 0.5,
  },
} as const;

type EventEarlyBirdDatesProps = {
  onFieldEdit?: () => void;
};

export default function EventEarlyBirdDates({ onFieldEdit }: EventEarlyBirdDatesProps) {
  const [mode, setMode] = useState<EarlyBirdDatesMode>('none');
  const [windows, setWindows] = useState<EarlyBirdWindow[]>(() => createInitialEarlyBirdWindows());

  const updateWindow = (
    id: string,
    patch: Partial<Pick<EarlyBirdWindow, 'startDate' | 'endDate'>>,
  ) => {
    setWindows((current) =>
      current.map((window) => (window.id === id ? { ...window, ...patch } : window)),
    );
    onFieldEdit?.();
  };

  const handleModeChange = (
    _event: MouseEvent<HTMLElement>,
    nextMode: EarlyBirdDatesMode | null,
  ) => {
    if (nextMode === null) {
      return;
    }

    setMode(nextMode);
    onFieldEdit?.();
  };

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        fullWidth
        onChange={handleModeChange}
        aria-label="Early bird dates mode"
        sx={earlyBirdModeToggleSx}
      >
        <ToggleButton value="none" aria-label="No early bird dates">
          No Early Bird Dates
        </ToggleButton>
        <ToggleButton value="create" aria-label="Create early bird dates">
          Create Early Bird Dates
        </ToggleButton>
      </ToggleButtonGroup>

      {mode === 'create' ? (
        <TableContainer sx={tableContainerSx}>
          <Table size="small" aria-label="Early bird date windows" sx={earlyBirdTableSx}>
            <TableHead>
              <TableRow>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {windows.map((window, index) => (
                <TableRow key={window.id}>
                  <TableCell>
                    <AppTextField
                      label="Start Date"
                      type="date"
                      value={window.startDate ?? ''}
                      onChange={(event) =>
                        updateWindow(window.id, {
                          startDate: event.target.value || null,
                        })
                      }
                      fullWidth
                      size="small"
                      slotProps={{ inputLabel: { shrink: true } }}
                      aria-label={`Early bird window ${index + 1} start date`}
                    />
                  </TableCell>
                  <TableCell>
                    <AppTextField
                      label="End Date"
                      type="date"
                      value={window.endDate ?? ''}
                      onChange={(event) =>
                        updateWindow(window.id, {
                          endDate: event.target.value || null,
                        })
                      }
                      fullWidth
                      size="small"
                      slotProps={{ inputLabel: { shrink: true } }}
                      aria-label={`Early bird window ${index + 1} end date`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Stack>
  );
}
