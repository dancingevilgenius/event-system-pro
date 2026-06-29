import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar, type GridColDef } from '@mui/x-data-grid';
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
    field: 'state',
    headerName: 'State',
    flex: 1,
    minWidth: 80,
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Attendees
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          {headerLabel || 'Event attendees'} ({rows.length})
        </Typography>

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
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: defaultPageSize },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={{ height: 520, width: '100%' }}
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
