import {
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type MouseEvent, useMemo, useState } from 'react';
import { mobileColumnSx } from '../constants/layout';
import {
  useApplyEventFormImport,
  useEventFormExportSnapshots,
} from '../context/EventFormExportContext';
import type { AddEventSectionStatus } from './AddEventSectionStatusToggle';
import type { EventDatesFormState, ScheduleTimeBlockDay } from '../lib/eventDates';
import { formatEventFormExport, type ImportantContactExport } from '../lib/eventFormExport';
import AppTextField from './AppTextField';

type TransferMode = 'export' | 'import';

const toggleGroupSx = {
  ...mobileColumnSx,
  '& .MuiToggleButton-root': {
    flex: 1,
    py: 1,
  },
} as const;

const jsonFieldSx = {
  '& .MuiInputBase-input': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '0.8rem',
    lineHeight: 1.45,
  },
} as const;

type AddEventExportImportProps = {
  eventName: string;
  eventGroupCode: string;
  dates: EventDatesFormState;
  sectionStatuses: Record<string, AddEventSectionStatus>;
  sectionOrder: string[];
  scheduleDays: ScheduleTimeBlockDay[];
  importantContact: ImportantContactExport;
};

export default function AddEventExportImport({
  eventName,
  eventGroupCode,
  dates,
  sectionStatuses,
  sectionOrder,
  scheduleDays,
  importantContact,
}: AddEventExportImportProps) {
  const snapshots = useEventFormExportSnapshots();
  const applyImport = useApplyEventFormImport();
  const [mode, setMode] = useState<TransferMode>('export');
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importLoaded, setImportLoaded] = useState(false);

  const exportJson = useMemo(
    () =>
      formatEventFormExport({
        eventName,
        eventGroupCode,
        dates,
        sectionStatuses,
        sectionOrder,
        scheduleDays,
        importantContact,
        snapshots,
      }),
    [
      dates,
      eventGroupCode,
      eventName,
      importantContact,
      scheduleDays,
      sectionOrder,
      sectionStatuses,
      snapshots,
    ],
  );

  const handleModeChange = (_event: MouseEvent<HTMLElement>, nextMode: TransferMode | null) => {
    if (nextMode !== null) {
      setMode(nextMode);
    }
  };

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        fullWidth
        onChange={handleModeChange}
        aria-label="Export or import"
        sx={toggleGroupSx}
      >
        <ToggleButton value="export" aria-label="Export">
          Export
        </ToggleButton>
        <ToggleButton value="import" aria-label="Import">
          Import
        </ToggleButton>
      </ToggleButtonGroup>

      {mode === 'export' ? (
            <AppTextField
              label="Event JSON"
              value={exportJson}
              multiline
              minRows={12}
              maxRows={24}
              fullWidth
              slotProps={{
                input: { readOnly: true },
                htmlInput: { spellCheck: false, 'aria-label': 'Exported event JSON' },
              }}
              sx={jsonFieldSx}
            />
      ) : (
        <AppTextField
              label="Event JSON"
              value={importJson}
              onChange={(event) => setImportJson(event.target.value)}
              placeholder="Paste event JSON from another export"
              multiline
              minRows={12}
              maxRows={24}
              fullWidth
              slotProps={{
                htmlInput: { spellCheck: false, 'aria-label': 'Import event JSON' },
              }}
              sx={jsonFieldSx}
            />
      )}
      {mode === 'import' ? (
        <Stack spacing={1}>
              <Button
                variant="contained"
                onClick={() => {
                  const error = applyImport(importJson);
                  setImportError(error);
                  setImportLoaded(error === null);
                }}
              >
                Load JSON into this event
              </Button>
              {importError ? (
                <Typography variant="body2" color="error">
                  {importError}
                </Typography>
              ) : null}
              {importLoaded ? (
                <Typography variant="body2" color="text.secondary">
                  Imported into this event. Generated ids were created again for this copy.
                </Typography>
              ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
