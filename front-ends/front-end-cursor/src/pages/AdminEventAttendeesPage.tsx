import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
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
import AuditTrailCard from '../components/AuditTrailCard';
import WsdcFindDancerSection from '../components/WsdcFindDancerSection';
import { useEventAttendeeRealtime } from '../hooks/useEventAttendeeRealtime';
import { useMessages } from '../hooks/useMessages';
import { eventDetailPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';

const DESKTOP_PAGE_SIZE = 25;
const TABLET_PAGE_SIZE = 15;
const MOBILE_PAGE_SIZE = 10;

const FILTER_PANEL_WIDTH = 480;
const FILTER_FIELD_MIN_CHARS = '10ch';
const FILTER_PANEL_TOP_MARGIN_PX = 8;

const MD_LAYOUT_QUERY = '(min-width:768px)';
const LG_LAYOUT_QUERY = '(min-width:1024px)';
const XL_LAYOUT_QUERY = '(min-width:1280px)';

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

function buildFilterPanelSx(compactFilter: boolean) {
  const panelWidth = compactFilter ? 'calc(100vw - 32px)' : FILTER_PANEL_WIDTH;
  const panelMinWidth = compactFilter ? 0 : FILTER_PANEL_WIDTH;

  return {
    width: panelWidth,
    minWidth: panelMinWidth,
    maxWidth: 'calc(100vw - 32px)',
    '& .MuiDataGrid-panelContent': {
      alignItems: 'stretch',
      width: '100%',
      minWidth: panelMinWidth,
      px: 2,
      py: 1.5,
      boxSizing: 'border-box',
    },
    '& .MuiDataGrid-filterForm': {
      flexDirection: compactFilter ? 'column' : 'row',
      flexWrap: compactFilter ? 'wrap' : 'nowrap',
      alignItems: compactFilter ? 'stretch' : 'center',
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
        flex: compactFilter ? '1 1 auto' : '1 1 0',
        width: compactFilter ? '100% !important' : 'auto !important',
        minWidth: compactFilter ? '0 !important' : `${FILTER_FIELD_MIN_CHARS} !important`,
        maxWidth: 'none !important',
      },
    '& .MuiDataGrid-filterFormValueInput': {
      flex: compactFilter ? '1 1 auto' : '1.2 1 0',
    },
  };
}

function buildAttendeeDataGridSx(options: {
  compactFilter: boolean;
  compactToolbar: boolean;
  gridHeight: number;
}) {
  const filterPanelSx = buildFilterPanelSx(options.compactFilter);

  return {
    height: options.gridHeight,
    width: '100%',
    '& .MuiDataGrid-toolbarContainer': {
      flexWrap: 'wrap',
      gap: 1,
    },
    '& .MuiDataGrid-toolbarQuickFilter': {
      flex: '1 1 auto',
      maxWidth: '100%',
      minWidth: options.compactToolbar ? 0 : 240,
    },
    '& .MuiDataGrid-toolbarQuickFilter .MuiFormControl-root, & .MuiDataGrid-toolbarQuickFilter .MuiTextField-root':
      {
        maxWidth: 'none',
        width: '100%',
      },
    '& .MuiDataGrid-panel': {
      zIndex: 1400,
    },
    '& .MuiDataGrid-panelContent': filterPanelSx['& .MuiDataGrid-panelContent'],
    '& .MuiDataGrid-panelWrapper': {
      width: filterPanelSx.width,
      minWidth: filterPanelSx.minWidth,
      maxWidth: filterPanelSx.maxWidth,
    },
    '& .MuiDataGrid-filterForm': filterPanelSx['& .MuiDataGrid-filterForm'],
    '& .MuiDataGrid-filterFormDeleteIcon': {
      flex: '0 0 auto',
      order: 99,
      width: 'auto',
      minWidth: 0,
      maxWidth: 'none',
      alignSelf: options.compactFilter ? 'flex-start' : 'center',
    },
    '& .MuiDataGrid-filterFormLogicOperatorInput':
      filterPanelSx['& .MuiDataGrid-filterFormLogicOperatorInput'],
    '& .MuiDataGrid-filterFormColumnInput': {
      ...filterPanelSx['& .MuiDataGrid-filterFormColumnInput, & .MuiDataGrid-filterFormOperatorInput, & .MuiDataGrid-filterFormValueInput'],
      order: 1,
      '& .MuiFormControl-root, & .MuiTextField-root': filterFormFieldSx,
      '&.MuiFormControl-root': filterSelectSx,
    },
    '& .MuiDataGrid-filterFormOperatorInput': {
      ...filterPanelSx['& .MuiDataGrid-filterFormColumnInput, & .MuiDataGrid-filterFormOperatorInput, & .MuiDataGrid-filterFormValueInput'],
      order: 2,
      '& .MuiFormControl-root, & .MuiTextField-root': filterFormFieldSx,
      '&.MuiFormControl-root': filterSelectSx,
    },
    '& .MuiDataGrid-filterFormValueInput': {
      ...filterPanelSx['& .MuiDataGrid-filterFormValueInput'],
      order: 3,
      '& .MuiFormControl-root, & .MuiTextField-root': filterFormFieldSx,
      '& .MuiInputBase-root': {
        width: '100%',
        minWidth: '100%',
      },
      '& .MuiInputBase-input': {
        minWidth: FILTER_FIELD_MIN_CHARS,
      },
    },
  };
}

function buildAttendeeDataGridSlotProps(compactFilter: boolean) {
  return {
    toolbar: {
      showQuickFilter: true,
    },
    filterPanel: {
      logicOperators: [] as GridLogicOperator[],
      sx: buildFilterPanelSx(compactFilter),
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
  };
}

type AttendeeGridRow = EventAttendeeListRow & { id: number };

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function attendeeMatchesQuickFilter(row: AttendeeGridRow, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [row.firstName, row.lastName, row.phone, row.email, row.wsdcId].some((value) =>
    value.toLowerCase().includes(normalized),
  );
}

function AttendeeMobileCard({
  row,
  onSelect,
}: {
  row: AttendeeGridRow;
  onSelect: (row: AttendeeGridRow) => void;
}) {
  return (
    <Box
      onClick={() => onSelect(row)}
      sx={{ cursor: 'pointer', width: '100%' }}
    >
      <AuditTrailCard
        columns={2}
        fields={[
          { key: 'first', label: 'First Name', value: displayValue(row.firstName) },
          { key: 'last', label: 'Last Name', value: displayValue(row.lastName) },
          { key: 'phone', label: 'Phone', value: displayValue(row.phone) },
          { key: 'email', label: 'Email', value: displayValue(row.email) },
          { key: 'wsdc', label: 'WSDC #', value: displayValue(row.wsdcId), columnSpan: 2 },
        ]}
      />
    </Box>
  );
}

function buildAttendeeColumns(compactTable: boolean): GridColDef<AttendeeGridRow>[] {
  const nameMinWidth = compactTable ? 96 : 120;
  const contactMinWidth = compactTable ? 110 : 130;
  const emailMinWidth = compactTable ? 140 : 180;

  return [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: nameMinWidth,
      filterable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: nameMinWidth,
      filterable: true,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: contactMinWidth,
      filterable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.2,
      minWidth: emailMinWidth,
      filterable: true,
    },
    {
      field: 'wsdcId',
      headerName: 'WSDC #',
      flex: 0.7,
      minWidth: compactTable ? 88 : 100,
      filterable: true,
      valueFormatter: (value: string) => value || '—',
    },
  ];
}

export default function AdminEventAttendeesPage() {
  const navigate = useNavigate();
  const showMdLayout = useMediaQuery(MD_LAYOUT_QUERY);
  const showLgLayout = useMediaQuery(LG_LAYOUT_QUERY);
  const showXlLayout = useMediaQuery(XL_LAYOUT_QUERY);
  const showXsLayout = !showMdLayout;
  const showCompactTable = showMdLayout && !showLgLayout;
  const { showProblem, showSuccess } = useMessages();

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
  const [lookupRow, setLookupRow] = useState<AttendeeGridRow | null>(null);
  const [savingWsdc, setSavingWsdc] = useState(false);
  const [mobilePage, setMobilePage] = useState(0);
  const [mobileQuickFilter, setMobileQuickFilter] = useState('');

  const eventBasePath = eventDetailPath(decodedGroupCode, parsedEventId);
  const containerMaxWidth = showXlLayout ? 'xl' : showLgLayout ? 'lg' : showMdLayout ? 'md' : 'sm';
  const dialogMaxWidth = showLgLayout ? 'md' : showMdLayout ? 'sm' : 'xs';

  const pageSize = showXsLayout ? MOBILE_PAGE_SIZE : showLgLayout ? DESKTOP_PAGE_SIZE : TABLET_PAGE_SIZE;
  const gridHeight = showXlLayout ? 600 : showLgLayout ? 520 : 460;

  const gridColumns = useMemo(
    () => buildAttendeeColumns(showCompactTable),
    [showCompactTable],
  );

  const columnVisibilityModel = useMemo(
    () => ({
      email: showLgLayout,
    }),
    [showLgLayout],
  );

  const gridRows = useMemo<AttendeeGridRow[]>(
    () => rows.map((row) => ({ ...row, id: row.attendeeId })),
    [rows],
  );

  const filteredMobileRows = useMemo(
    () => gridRows.filter((row) => attendeeMatchesQuickFilter(row, mobileQuickFilter)),
    [gridRows, mobileQuickFilter],
  );

  const mobileTotalPages = Math.max(1, Math.ceil(filteredMobileRows.length / MOBILE_PAGE_SIZE));
  const safeMobilePage = Math.min(mobilePage, mobileTotalPages - 1);
  const pagedMobileRows = useMemo(
    () =>
      filteredMobileRows.slice(
        safeMobilePage * MOBILE_PAGE_SIZE,
        safeMobilePage * MOBILE_PAGE_SIZE + MOBILE_PAGE_SIZE,
      ),
    [filteredMobileRows, safeMobilePage],
  );

  useEffect(() => {
    setMobilePage(0);
  }, [mobileQuickFilter, rows.length]);

  useEffect(() => {
    setMobilePage((current) => Math.min(current, mobileTotalPages - 1));
  }, [mobileTotalPages]);

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
    const baseSlotProps = buildAttendeeDataGridSlotProps(showCompactTable);

    if (!filterPanelAnchorEl) {
      return baseSlotProps;
    }

    const filterPanelSx = buildFilterPanelSx(showCompactTable);

    return {
      ...baseSlotProps,
      panel: {
        target: filterPanelAnchorEl,
        sx: {
          '& .MuiDataGrid-panelContent, & .MuiDataGrid-panelWrapper': filterPanelSx,
        },
      },
      basePopper: {
        placement: 'bottom' as const,
        flip: false,
      },
    };
  }, [filterPanelAnchorEl, showCompactTable]);

  const dataGridSx = useMemo(
    () =>
      buildAttendeeDataGridSx({
        compactFilter: showCompactTable,
        compactToolbar: showCompactTable,
        gridHeight,
      }),
    [gridHeight, showCompactTable],
  );

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
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper
        elevation={3}
        sx={{ position: 'relative', p: { xs: 2, md: 3, lg: 4 }, overflow: 'visible' }}
      >
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
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Attendees
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {headerLabel || 'Event attendees'} ({rows.length})
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
            {showXsLayout
              ? 'Tap a card to look up and save a WSDC #.'
              : 'Click a row to look up and save a WSDC #.'}
          </Typography>
        </Box>

        {error && (
          <Typography variant="body2" color="error" align="center" sx={{ py: 2 }}>
            {error}
          </Typography>
        )}

        {!error && showXsLayout && (
          <Stack spacing={2} sx={{ mb: 2 }}>
            <TextField
              size="small"
              label="Search attendees"
              value={mobileQuickFilter}
              onChange={(event) => setMobileQuickFilter(event.target.value)}
              fullWidth
            />

            {loading ? (
              <Stack sx={{ py: 6, alignItems: 'center' }}>
                <CircularProgress size={32} />
              </Stack>
            ) : filteredMobileRows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                No attendees found for this event.
              </Typography>
            ) : (
              pagedMobileRows.map((row) => (
                <AttendeeMobileCard key={row.attendeeId} row={row} onSelect={setLookupRow} />
              ))
            )}

            {!loading && filteredMobileRows.length > 0 && (
              <Stack
                direction="column"
                spacing={1}
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setMobilePage((current) => Math.max(0, current - 1))}
                  disabled={safeMobilePage === 0}
                  sx={{ minWidth: 96 }}
                >
                  Previous
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Page {safeMobilePage + 1} of {mobileTotalPages}
                  <Typography component="span" variant="caption" sx={{ display: 'block' }}>
                    {MOBILE_PAGE_SIZE} per page
                  </Typography>
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    setMobilePage((current) => Math.min(mobileTotalPages - 1, current + 1))
                  }
                  disabled={safeMobilePage >= mobileTotalPages - 1}
                  sx={{ minWidth: 96 }}
                >
                  Next
                </Button>
              </Stack>
            )}
          </Stack>
        )}

        {!error && showMdLayout && (
          <DataGrid
            rows={gridRows}
            columns={gridColumns}
            columnVisibilityModel={columnVisibilityModel}
            loading={loading}
            disableRowSelectionOnClick
            onRowClick={(params) => setLookupRow(params.row)}
            slots={{ toolbar: GridToolbar }}
            slotProps={dataGridSlotProps}
            initialState={{
              pagination: {
                paginationModel: { pageSize },
              },
            }}
            pageSizeOptions={[10, 15, 25, 50, 100]}
            sx={{
              ...dataGridSx,
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
            localeText={{
              noRowsLabel: 'No attendees found for this event.',
            }}
          />
        )}

        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          {decodedGroupCode && <AddEventButton eventGroupCode={decodedGroupCode} fullWidth={false} />}
          <Button
            variant="outlined"
            onClick={() => navigate(eventBasePath)}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
            fullWidth={showXsLayout}
          >
            Back to Event
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={Boolean(lookupRow)}
        onClose={() => setLookupRow(null)}
        fullWidth
        maxWidth={dialogMaxWidth}
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
