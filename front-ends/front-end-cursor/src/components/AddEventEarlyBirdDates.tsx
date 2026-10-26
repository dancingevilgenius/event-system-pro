import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { ACCORDION_TABLE_ROW_GAP, MD_LAYOUT_MEDIA_QUERY, mobileColumnSx } from '../constants/layout';
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import {
  createInitialEarlyBirdWindows,
  earlyBirdDateOrderError,
  earlyBirdDatesCanBeFinalized,
  isEarlyBirdDateInPast,
  localCalendarDateIso,
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

/** Wide enough for "mm/dd/yyyy" plus outlined padding and the native calendar icon. */
const EARLY_BIRD_DATE_FIELD_WIDTH = 'calc(12ch + 2.75rem)';

const earlyBirdWindowRowSx = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  columnGap: 1,
  rowGap: 1,
  alignItems: 'start',
  width: '100%',
  minWidth: 0,
  [`@media ${MD_LAYOUT_MEDIA_QUERY}`]: {
    gridTemplateColumns: 'auto minmax(0, 1fr) auto auto',
    alignItems: 'center',
  },
} as const;

const earlyBirdDateFieldSx = {
  width: EARLY_BIRD_DATE_FIELD_WIDTH,
  maxWidth: '100%',
  justifySelf: 'start',
} as const;

type EarlyBirdDateField = 'startDate' | 'endDate';

type PastDatePrompt = {
  windowId: string;
  field: EarlyBirdDateField;
  nextDate: string;
};

const EARLY_BIRD_PAST_DATE_PROMPT = 'Override and set date in the past?';

function confirmedPastDateKey(windowId: string, field: EarlyBirdDateField): string {
  return `${windowId}:${field}`;
}

type AddEventEarlyBirdDatesProps = {
  onFieldEdit?: () => void;
  onNoEarlyBirdDatesChange?: (noEarlyBirdDates: boolean) => void;
  onDatesValidChange?: (datesValid: boolean) => void;
};

export default function AddEventEarlyBirdDates({
  onFieldEdit,
  onNoEarlyBirdDatesChange,
  onDatesValidChange,
}: AddEventEarlyBirdDatesProps) {
  const [mode, setMode] = useState<EarlyBirdDatesMode>('none');
  const [windows, setWindows] = useState<EarlyBirdWindow[]>(() => createInitialEarlyBirdWindows());
  const [pastDatePrompt, setPastDatePrompt] = useState<PastDatePrompt | null>(null);
  const confirmedPastDatesRef = useRef<Record<string, string>>({});
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);

  const datesValid = earlyBirdDatesCanBeFinalized(mode, windows);

  useEffect(() => {
    onNoEarlyBirdDatesChange?.(mode === 'none');
  }, [mode, onNoEarlyBirdDatesChange]);

  useEffect(() => {
    onDatesValidChange?.(datesValid);
  }, [datesValid, onDatesValidChange]);

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

  const handleDateChange = (windowId: string, field: EarlyBirdDateField, raw: string) => {
    const nextDate = raw || null;
    const window = windows.find((entry) => entry.id === windowId);
    if (!window?.enabled) {
      updateWindow(windowId, { [field]: nextDate });
      return;
    }

    const today = localCalendarDateIso(new Date());
    if (nextDate && isEarlyBirdDateInPast(nextDate, today)) {
      const key = confirmedPastDateKey(windowId, field);
      if (confirmedPastDatesRef.current[key] === nextDate) {
        updateWindow(windowId, { [field]: nextDate });
        return;
      }

      setPastDatePrompt({ windowId, field, nextDate });
      return;
    }

    updateWindow(windowId, { [field]: nextDate });
  };

  const confirmPastDate = () => {
    if (!pastDatePrompt) {
      return;
    }

    const { windowId, field, nextDate } = pastDatePrompt;
    confirmedPastDatesRef.current[confirmedPastDateKey(windowId, field)] = nextDate;
    setPastDatePrompt(null);
    updateWindow(windowId, { [field]: nextDate });
  };

  const declinePastDate = () => {
    setPastDatePrompt(null);
  };

  const displayedDate = (
    windowId: string,
    field: EarlyBirdDateField,
    stored: string | null,
  ): string => {
    if (
      pastDatePrompt
      && pastDatePrompt.windowId === windowId
      && pastDatePrompt.field === field
    ) {
      return pastDatePrompt.nextDate;
    }

    return stored ?? '';
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
        <Stack spacing={ACCORDION_TABLE_ROW_GAP} sx={{ width: '100%', minWidth: 0 }}>
          {windows.map((window, index) => {
            const rowDisabled = !window.enabled;
            const dateOrderError = earlyBirdDateOrderError(
              window.enabled,
              window.startDate,
              window.endDate,
            );
            return (
              <Box key={window.id} sx={earlyBirdWindowRowSx}>
                <FormControlLabel
                  sx={{
                    ml: 0,
                    mr: 0,
                    alignItems: 'center',
                    justifySelf: 'start',
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
                  sx={{ minWidth: 0 }}
                />
                <AppTextField
                  label="Start Date"
                  type="date"
                  value={displayedDate(window.id, 'startDate', window.startDate)}
                  disabled={rowDisabled}
                  onChange={(event) =>
                    handleDateChange(window.id, 'startDate', event.target.value)
                  }
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  aria-label={`Early bird window ${index + 1} start date`}
                  error={Boolean(dateOrderError)}
                  helperText={dateOrderError ?? undefined}
                  sx={earlyBirdDateFieldSx}
                />
                <AppTextField
                  label="End Date"
                  type="date"
                  value={displayedDate(window.id, 'endDate', window.endDate)}
                  disabled={rowDisabled}
                  onChange={(event) =>
                    handleDateChange(window.id, 'endDate', event.target.value)
                  }
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  aria-label={`Early bird window ${index + 1} end date`}
                  error={Boolean(dateOrderError)}
                  helperText={dateOrderError ?? undefined}
                  sx={earlyBirdDateFieldSx}
                />
              </Box>
            );
          })}
        </Stack>
      ) : null}

      <Dialog
        open={pastDatePrompt !== null}
        onClose={declinePastDate}
        fullWidth
        maxWidth="xs"
        aria-labelledby="early-bird-past-date-title"
      >
        <DialogTitle id="early-bird-past-date-title">{EARLY_BIRD_PAST_DATE_PROMPT}</DialogTitle>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button type="button" onClick={declinePastDate}>
            No
          </Button>
          <Button type="button" variant="contained" onClick={confirmPastDate}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
