import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
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
  type EventAttendeeListRow,
} from '../api/postgrest';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
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

const ATTENDEE_COLUMNS: GridColDef<AttendeeGridRow>[] = [
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
  {
    field: 'phone',
    headerName: 'Phone',
    flex: 1,
    minWidth: 130,
    filterable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1.2,
    minWidth: 180,
    filterable: true,
  },
];

export default function AdminEventAttendeesPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileDevice();
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

  const eventBasePath = `/admin/event-details/${encodeURIComponent(decodedGroupCode)}/${parsedEventId}`;

  const gridRows = useMemo<AttendeeGridRow[]>(
    () => rows.map((row) => ({ ...row, id: row.attendeeId })),
    [rows],
  );

  const loadAttendees = useCallback(async () => {
    if (!decodedGroupCode || !Number.isFinite(parsedEventId)) {
      setError('Event not specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  }, [decodedGroupCode, parsedEventId]);

  useEffect(() => {
    void loadAttendees();
  }, [loadAttendees]);

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
        </Box>

        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ py: 2 }}>
            {error}
          </Typography>
        )}

        {!error && (
          <DataGrid
            rows={gridRows}
            columns={ATTENDEE_COLUMNS}
            loading={loading}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={dataGridSlotProps}
            initialState={{
              pagination: {
                paginationModel: { pageSize: defaultPageSize },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={ATTENDEE_DATA_GRID_SX}
            localeText={{
              noRowsLabel: 'No attendees found for this event.',
            }}
          />
        )}

        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          <Button variant="outlined" onClick={() => navigate(eventBasePath)} sx={{ minWidth: 200 }}>
            Back to Event
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
