import {
  Checkbox,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { mobileColumnSx } from '../constants/layout';
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import {
  createInitialEarlyBirdWindows,
  savedEarlyBirdName,
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

const headerCellSx = { fontWeight: 700 } as const;

const earlyBirdTableSx = {
  width: '100%',
  tableLayout: { md: 'fixed' },
  display: { xs: 'block', md: 'table' },
  '& thead': {
    display: { xs: 'none', md: 'table-header-group' },
  },
  '& tbody': {
    display: { xs: 'block', md: 'table-row-group' },
  },
  '& tr': {
    display: { xs: 'block', md: 'table-row' },
    mb: { xs: 2, md: 0 },
    pb: { xs: 1.5, md: 0 },
    borderBottom: { xs: 1, md: 0 },
    borderColor: 'divider',
  },
  '& .MuiTableCell-root': {
    px: 1,
    py: { xs: 0.75, md: 1.5 },
    verticalAlign: 'top',
    display: { xs: 'block', md: 'table-cell' },
    width: { xs: '100%' },
    borderBottom: { xs: 'none', md: '1px solid' },
    borderColor: 'divider',
  },
  '& .MuiTableCell-root:first-of-type': {
    pr: { md: 0.5 },
    width: { md: 152 },
  },
  '& .MuiTableCell-root + .MuiTableCell-root': {
    pl: { md: 0.5 },
  },
} as const;

type AddEventEarlyBirdDatesProps = {
  onFieldEdit?: () => void;
  onNoEarlyBirdDatesChange?: (noEarlyBirdDates: boolean) => void;
};

export default function AddEventEarlyBirdDates({
  onFieldEdit,
  onNoEarlyBirdDatesChange,
}: AddEventEarlyBirdDatesProps) {
  const [mode, setMode] = useState<EarlyBirdDatesMode>('none');
  const [windows, setWindows] = useState<EarlyBirdWindow[]>(() => createInitialEarlyBirdWindows());
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);

  useEffect(() => {
    onNoEarlyBirdDatesChange?.(mode === 'none');
  }, [mode, onNoEarlyBirdDatesChange]);

  useEffect(() => {
    reportExport('earlyBird', { mode, windows });
  }, [mode, reportExport, windows]);

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    setMode(appliedImport.earlyBird.mode);
    setWindows(appliedImport.earlyBird.windows);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

  const updateWindow = (
    id: string,
    patch: Partial<Pick<EarlyBirdWindow, 'name' | 'enabled' | 'startDate' | 'endDate'>>,
  ) => {
    setWindows((current) =>
      current.map((window) => (window.id === id ? { ...window, ...patch } : window)),
    );
    onFieldEdit?.();
  };

  const commitWindowName = (id: string, index: number) => {
    setWindows((current) => {
      let changed = false;
      const next = current.map((window) => {
        if (window.id !== id) {
          return window;
        }
        const name = savedEarlyBirdName(window.name, index);
        if (name === window.name) {
          return window;
        }
        changed = true;
        return { ...window, name };
      });
      return changed ? next : current;
    });
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
            <colgroup>
              <col style={{ width: '9.5rem' }} />
              <col style={{ width: '34%' }} />
              <col />
              <col />
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellSx}>Enable</TableCell>
                <TableCell sx={headerCellSx}>Name</TableCell>
                <TableCell sx={headerCellSx}>Start Date</TableCell>
                <TableCell sx={headerCellSx}>End Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {windows.map((window, index) => {
                const rowDisabled = !window.enabled;
                return (
                  <TableRow key={window.id}>
                    <TableCell>
                      <FormControlLabel
                        sx={{
                          ml: 0,
                          mr: 0,
                          mt: { md: 0.5 },
                          alignItems: 'center',
                        }}
                        control={
                          <Checkbox
                            checked={window.enabled}
                            onChange={(event) =>
                              updateWindow(window.id, { enabled: event.target.checked })
                            }
                            slotProps={{
                              input: {
                                'aria-label': `Enable early bird price for early bird window ${index + 1}`,
                              },
                            }}
                            sx={{ p: 0.5 }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            Enable
                          </Typography>
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <AppTextField
                        label="Name"
                        value={window.name}
                        disabled={rowDisabled}
                        onChange={(event) =>
                          updateWindow(window.id, { name: event.target.value })
                        }
                        onBlur={() => commitWindowName(window.id, index)}
                        fullWidth
                        size="small"
                        aria-label={`Early bird window ${index + 1} name`}
                      />
                    </TableCell>
                    <TableCell>
                      <AppTextField
                        label="Start Date"
                        type="date"
                        value={window.startDate ?? ''}
                        disabled={rowDisabled}
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
                        disabled={rowDisabled}
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Stack>
  );
}
