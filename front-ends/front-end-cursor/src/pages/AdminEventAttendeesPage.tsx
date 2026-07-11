import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridLogicOperator,
  GridToolbar,
  type GridColDef,
} from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchEventAttendeesForEvent,
  fetchEventById,
  fetchEventGroupByCode,
  setUserWsdcId,
  type EventAttendeeListRow,
} from '../api/postgrest';
import type { WsdcDancerProfile } from '../api/wsdcRegistry';
import { buildStoredWsdcInfo } from '../api/wsdcRegistry';
import AddEventButton from '../components/AddEventButton';
import WsdcFindDancerSection from '../components/WsdcFindDancerSection';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import { useEventAttendeeRealtime } from '../hooks/useEventAttendeeRealtime';
import { useMessages } from '../hooks/useMessages';
import { eventDetailPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';

const DESKTOP_PAGE_SIZE = 25;
const MOBILE_PAGE_SIZE = 10;

/** Undo global 360px form cap inside the filter panel. */
const FILTER_PANEL_WIDTH = 480;
const FILTER_FIELD_MIN_CHARS = '10ch';
const FILTER_PANEL_TOP_MARGIN_PX = 8;

const filterFormFieldSx = {
  maxWidth: 'none !important',
  width: '100%',
  minWidth: FILTER_FIELD_MIN_CHARS,
  m: 0,
} as const;

const filterSelectSx = {
  ...filterFormFieldSx,
  '& .MuiInputBase-root': {
    width: '100%',
    minWidth: '100%',
  },
  '& .MuiSelect-select': {
    width: '100%',
    minWidth: FILTER_FIELD_MIN_CHARS,
  },
  '& .MuiInputBase-input': {
    minWidth: FILTER_FIELD_MIN_CHARS,
  },
} as const;

const ATTENDEE_DATA_GRID_SX = {
  height: 520,
  width: '100%',
  '& .MuiDataGrid-toolbarContainer': {
    flexWrap: 'wrap',
    gap: 1,
  },
  '& .MuiDataGrid-toolbarQuickFilter': {
    flex: '1 1 240px',
    maxWidth: 'none',
    minWidth: 240,
  },
  '& .MuiDataGrid-toolbarQuickFilter .MuiFormControl-root, & .MuiDataGrid-toolbarQuickFilter .MuiTextField-root':
    {
      maxWidth: 'none',
      width: '100%',
    },
  '& .MuiDataGrid-panel': {
    zIndex: 1400,
  },
  '& .MuiDataGrid-panelContent': {
    alignItems: 'stretch',
    width: FILTER_PANEL_WIDTH,
    minWidth: FILTER_PANEL_WIDTH,
    maxWidth: 'calc(100vw - 32px)',
  },
  '& .MuiDataGrid-panelWrapper': {
    width: FILTER_PANEL_WIDTH,
    minWidth: FILTER_PANEL_WIDTH,
    maxWidth: 'calc(100vw - 32px)',
  },
  '& .MuiDataGrid-filterForm': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: 1.5,
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
  },
  '& .MuiDataGrid-filterFormDeleteIcon': {
    flex: '0 0 auto',
    order: 99,
    width: 'auto',
    minWidth: 0,
    maxWidth: 'none',
  },
  '& .MuiDataGrid-filterFormLogicOperatorInput': {
    display: 'none !important',
    width: '0 !important',
    minWidth: '0 !important',
    maxWidth: '0 !important',
    padding: '0 !important',
    margin: '0 !important',
    overflow: 'hidden !important',
    flex: '0 0 0 !important',
  },
  '& .MuiDataGrid-filterFormColumnInput': {
    flex: '1 1 0',
    order: 1,
    width: 'auto !important',
    minWidth: `${FILTER_FIELD_MIN_CHARS} !important`,
    maxWidth: 'none !important',
    '& .MuiFormControl-root, & .MuiTextField-root': filterFormFieldSx,
    '&.MuiFormControl-root': filterSelectSx,
  },
  '& .MuiDataGrid-filterFormOperatorInput': {
    flex: '1 1 0',
    order: 2,
    width: 'auto !important',
    minWidth: `${FILTER_FIELD_MIN_CHARS} !important`,
    maxWidth: 'none !important',
    '& .MuiFormControl-root, & .MuiTextField-root': filterFormFieldSx,
    '&.MuiFormControl-root': filterSelectSx,
  },
  '& .MuiDataGrid-filterFormValueInput': {
    flex: '1.2 1 0',
    order: 3,
    width: 'auto !important',
    minWidth: `${FILTER_FIELD_MIN_CHARS} !important`,
    maxWidth: 'none !important',
    '& .MuiFormControl-root, & .MuiTextField-root': filterFormFieldSx,
    '& .MuiInputBase-root': {
      width: '100%',
      minWidth: '100%',
    },
    '& .MuiInputBase-input': {
      minWidth: FILTER_FIELD_MIN_CHARS,
    },
  },
} as const;

const ATTENDEE_DATA_GRID_SLOT_PROPS = {
  toolbar: {
    showQuickFilter: true,
  },
  filterPanel: {
    logicOperators: [] as GridLogicOperator[],
    sx: {
      width: FILTER_PANEL_WIDTH,
      minWidth: FILTER_PANEL_WIDTH,
      maxWidth: 'calc(100vw - 32px)',
      '& .MuiDataGrid-panelContent': {
        alignItems: 'stretch',
        width: '100%',
        minWidth: FILTER_PANEL_WIDTH,
        px: 2,
        py: 1.5,
        boxSizing: 'border-box',
      },
      '& .MuiDataGrid-filterForm': {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
        gap: 1.5,
      },
      '& .MuiDataGrid-filterFormLogicOperatorInput': {
        display: 'none !important',
        width: '0 !important',
        minWidth: '0 !important',
        maxWidth: '0 !important',
        padding: '0 !important',
        margin: '0 !important',
        overflow: 'hidden !important',
        flex: '0 0 0 !important',
      },
      '& .MuiDataGrid-filterFormColumnInput, & .MuiDataGrid-filterFormOperatorInput, & .MuiDataGrid-filterFormValueInput':
        {
          flex: '1 1 0',
          width: 'auto !important',
          minWidth: `${FILTER_FIELD_MIN_CHARS} !important`,
          maxWidth: 'none !important',
        },
      '& .MuiDataGrid-filterFormValueInput': {
        flex: '1.2 1 0',
      },
    },
    filterFormProps: {
      columnInputProps: {
        fullWidth: true,
        size: 'small' as const,
        sx: filterSelectSx,
      },
      operatorInputProps: {
        fullWidth: true,
        size: 'small' as const,
        sx: filterSelectSx,
      },
      valueInputProps: {
        InputComponentProps: {
          fullWidth: true,
          size: 'small',
          sx: {
            ...filterFormFieldSx,
            '& .MuiInputBase-input': {
              minWidth: FILTER_FIELD_MIN_CHARS,
            },
          },
        },
      },
    },
  },
} as const;

type AttendeeGridRow = EventAttendeeListRow & { id: number };
type MobileContactColumn = 'phone' | 'email';

const ATTENDEE_NAME_COLUMNS: GridColDef<AttendeeGridRow>[] = [
  {
    field: 'firstName',
    headerName: 'First Name',
    flex: 1,
    minWidth: 120,
    filterable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    flex: 1,
    minWidth: 120,
    filterable: true,
  },
];

const ATTENDEE_CONTACT_COLUMNS: Record<MobileContactColumn, GridColDef<AttendeeGridRow>> = {
  phone: {
    field: 'phone',
    headerName: 'Phone',
    flex: 1,
    minWidth: 130,
    filterable: true,
  },
  email: {
    field: 'email',
    headerName: 'Email',
    flex: 1.2,
    minWidth: 180,
    filterable: true,
  },
};

const ATTENDEE_WSDC_COLUMN: GridColDef<AttendeeGridRow> = {
  field: 'wsdcId',
  headerName: 'WSDC #',
  flex: 0.7,
  minWidth: 100,
  filterable: true,
  valueFormatter: (value: string) => value || '—',
};

export default function AdminEventAttendeesPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileDevice();
  const { showProblem, showSuccess } = useMessages();
  const defaultPageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const { eventGroupCode = '', eventId = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
  }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const parsedEventId = Number.parseInt(eventId, 10);

  const [rows, setRows] = useState<EventAttendeeListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerLabel, setHeaderLabel] = useState('');
  const [filterPanelAnchorEl, setFilterPanelAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileContactColumn, setMobileContactColumn] = useState<MobileContactColumn>('phone');
  const [lookupRow, setLookupRow] = useState<AttendeeGridRow | null>(null);
  const [savingWsdc, setSavingWsdc] = useState(false);

  const eventBasePath = eventDetailPath(decodedGroupCode, parsedEventId);

  const gridColumns = useMemo(() => {
    if (!isMobile) {
      return [
        ...ATTENDEE_NAME_COLUMNS,
        ATTENDEE_CONTACT_COLUMNS.phone,
        ATTENDEE_CONTACT_COLUMNS.email,
        ATTENDEE_WSDC_COLUMN,
      ];
    }

    return [
      ...ATTENDEE_NAME_COLUMNS,
      ATTENDEE_CONTACT_COLUMNS[mobileContactColumn],
      ATTENDEE_WSDC_COLUMN,
    ];
  }, [isMobile, mobileContactColumn]);

  const gridRows = useMemo<AttendeeGridRow[]>(
    () => rows.map((row) => ({ ...row, id: row.attendeeId })),
    [rows],
  );

  const loadAttendees = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;

    if (!decodedGroupCode || !Number.isFinite(parsedEventId)) {
      setError('Event not specified.');
      setLoading(false);
      return;
    }

    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const [group, event, attendees] = await Promise.all([
        fetchEventGroupByCode(decodedGroupCode),
        fetchEventById(parsedEventId),
        fetchEventAttendeesForEvent(parsedEventId),
      ]);

      if (!group || !event || event.eventGroupCode !== decodedGroupCode) {
        setRows([]);
        setError('Event not found for this group.');
        return;
      }

      setHeaderLabel(`${group.fullName} · ${formatEventMonthYear(event.startDate)}`);
      setRows(attendees);
    } catch (loadError) {
      setRows([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load attendees.');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [decodedGroupCode, parsedEventId]);

  useEffect(() => {
    void loadAttendees();
  }, [loadAttendees]);

  useEventAttendeeRealtime(
    Number.isFinite(parsedEventId) ? parsedEventId : null,
    () => {
      void loadAttendees({ silent: true });
    },
  );

  const dataGridSlotProps = useMemo(() => {
    if (!filterPanelAnchorEl) {
      return ATTENDEE_DATA_GRID_SLOT_PROPS;
    }

    return {
      ...ATTENDEE_DATA_GRID_SLOT_PROPS,
      panel: {
        target: filterPanelAnchorEl,
        sx: {
          '& .MuiDataGrid-panelContent, & .MuiDataGrid-panelWrapper': {
            width: FILTER_PANEL_WIDTH,
            minWidth: FILTER_PANEL_WIDTH,
            maxWidth: 'calc(100vw - 32px)',
          },
        },
      },
      // Top anchor + bottom placement: disable flip or Popper moves the panel off-screen above the viewport.
      // Do not pass `modifiers` — that replaces BasePopper's isPlaced hook and hides panel content.
      basePopper: {
        placement: 'bottom' as const,
        flip: false,
      },
    };
  }, [filterPanelAnchorEl]);

  const handleConfirmWsdc = async (wsdcId: string, profile: WsdcDancerProfile) => {
    if (!lookupRow?.userId) {
      showProblem('This attendee has no linked user account.');
      return;
    }

    setSavingWsdc(true);
    try {
      const result = await setUserWsdcId({
        userId: lookupRow.userId,
        wsdcId,
        wsdcInfo: buildStoredWsdcInfo(wsdcId, profile),
      });
      if (!result.ok) {
        showProblem(result.message);
        return;
      }

      setRows((current) =>
        current.map((row) =>
          row.attendeeId === lookupRow.attendeeId ? { ...row, wsdcId } : row,
        ),
      );
      setLookupRow((current) => (current ? { ...current, wsdcId } : current));
      showSuccess(result.message);
    } catch (saveError) {
      showProblem(saveError instanceof Error ? saveError.message : 'Unable to save WSDC ID.');
    } finally {
      setSavingWsdc(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{ position: 'relative', p: { xs: 2, sm: 4 }, overflow: 'visible' }}
      >
        {/* Anchor near paper top: filter panel top aligns with Attendees title. */}
        <Box
          ref={setFilterPanelAnchorEl}
          aria-hidden
          sx={{
            position: 'absolute',
            top: FILTER_PANEL_TOP_MARGIN_PX,
            left: '50%',
            width: '1px',
            height: '1px',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            textAlign: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Attendees
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {headerLabel || 'Event attendees'} ({rows.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
            Click a row to look up and save a WSDC #.
          </Typography>
        </Box>

        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ py: 2 }}>
            {error}
          </Typography>
        )}

        {!error && isMobile && (
          <Stack direction="row" sx={{ mb: 2, justifyContent: 'center' }}>
            <ToggleButtonGroup
              exclusive
              value={mobileContactColumn}
              onChange={(_, value: MobileContactColumn | null) => {
                if (value) {
                  setMobileContactColumn(value);
                }
              }}
              size="small"
              aria-label="Show phone or email column"
            >
              <ToggleButton value="phone" aria-label="Show phone column">
                Phone
              </ToggleButton>
              <ToggleButton value="email" aria-label="Show email column">
                Email
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        )}

        {!error && (
          <DataGrid
            rows={gridRows}
            columns={gridColumns}
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => setLookupRow(params.row)}
            slots={{ toolbar: GridToolbar }}
            slotProps={dataGridSlotProps}
            initialState={{
              pagination: {
                paginationModel: { pageSize: defaultPageSize },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={{
              ...ATTENDEE_DATA_GRID_SX,
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
            localeText={{
              noRowsLabel: 'No attendees found for this event.',
            }}
          />
        )}

        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          {decodedGroupCode && <AddEventButton eventGroupCode={decodedGroupCode} fullWidth={false} />}
          <Button variant="outlined" onClick={() => navigate(eventBasePath)} sx={{ minWidth: 200 }}>
            Back to Event
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={Boolean(lookupRow)}
        onClose={() => setLookupRow(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          WSDC lookup
          {lookupRow ? ` — ${lookupRow.firstName} ${lookupRow.lastName}`.trim() : ''}
        </DialogTitle>
        <DialogContent dividers>
          {lookupRow && (
            <WsdcFindDancerSection
              key={`${lookupRow.attendeeId}-${lookupRow.wsdcId}`}
              title=""
              description={undefined}
              initialQuery={[lookupRow.firstName, lookupRow.lastName].filter(Boolean).join(' ')}
              initialWsdcId={lookupRow.wsdcId || null}
              enableDirectLink={false}
              confirmLabel="Save WSDC # to user"
              confirming={savingWsdc}
              onConfirmWsdcId={handleConfirmWsdc}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLookupRow(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
