import {
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchEventGroups,
  fetchSortedStaticListEntries,
  updateEventGroupEventType,
  type EventGroupListRow,
  type StaticListEntry,
} from '../api/postgrest';
import AddEventGroupDialog from '../components/AddEventGroupDialog';
import AppTextField from '../components/AppTextField';
import AuditTrailCard from '../components/AuditTrailCard';
import { EVENT_HOME_PATH, eventGroupDetailPath } from '../constants/eventRoutes';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { EVENT_TYPES_LIST_CODE } from '../lib/staticList';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function EventGroupMobileCard({
  row,
  eventTypeOptions,
  saving,
  onEventTypeChange,
  onEdit,
}: {
  row: EventGroupListRow;
  eventTypeOptions: StaticListEntry[];
  saving: boolean;
  onEventTypeChange: (eventGroupCode: string, nextEventTypeCode: string) => void;
  onEdit: () => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <AuditTrailCard
          columns={2}
          fields={[
            { key: 'code', label: 'Event Group Code', value: displayValue(row.eventGroupCode) },
            {
              key: 'name',
              label: 'Full Name',
              value: displayValue(row.fullName),
              columnSpan: 2,
            },
          ]}
        />
        <AppTextField
          select
          label="Event Type"
          size="small"
          fullWidth
          value={row.eventTypeCode ?? ''}
          disabled={saving}
          onChange={(event) => onEventTypeChange(row.eventGroupCode, event.target.value)}
        >
          <MenuItem value="">
            <em>Select event type</em>
          </MenuItem>
          {eventTypeOptions.map((entry) => (
            <MenuItem key={entry.key} value={entry.key}>
              {entry.label}
            </MenuItem>
          ))}
        </AppTextField>
        <Button variant="outlined" size="small" onClick={onEdit}>
          Edit events
        </Button>
      </Stack>
    </Paper>
  );
}

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const { showSuccess, showProblem } = useMessages();
  const { showXsLayout, showMdLayout, showLgLayout, containerMaxWidth } = useLayoutTier();

  const [rows, setRows] = useState<EventGroupListRow[]>([]);
  const [eventTypeOptions, setEventTypeOptions] = useState<StaticListEntry[]>([]);
  const [nameFilter, setNameFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [savingEventTypeCodes, setSavingEventTypeCodes] = useState<Set<string>>(new Set());

  const loadEventGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [eventGroups, eventTypes] = await Promise.all([
        fetchEventGroups(),
        fetchSortedStaticListEntries(EVENT_TYPES_LIST_CODE, 'event types'),
      ]);
      setRows(eventGroups);
      setEventTypeOptions(eventTypes);
    } catch (loadError) {
      setRows([]);
      setEventTypeOptions([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load event groups.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEventGroups();
  }, [loadEventGroups]);

  const normalizedNameFilter = nameFilter.trim().toLowerCase();
  const filteredRows =
    normalizedNameFilter === ''
      ? rows
      : rows.filter((row) => row.fullName.toLowerCase().includes(normalizedNameFilter));

  const handleEventTypeChange = async (eventGroupCode: string, nextEventTypeCode: string) => {
    const currentRow = rows.find((row) => row.eventGroupCode === eventGroupCode);
    const previousTypeCode = currentRow?.eventTypeCode ?? null;
    const normalizedNext = nextEventTypeCode.trim() === '' ? null : nextEventTypeCode.trim();

    if ((previousTypeCode ?? null) === normalizedNext) {
      return;
    }

    setRows((prev) =>
      prev.map((row) =>
        row.eventGroupCode === eventGroupCode
          ? { ...row, eventTypeCode: normalizedNext }
          : row,
      ),
    );
    setSavingEventTypeCodes((prev) => new Set(prev).add(eventGroupCode));

    try {
      const updated = await updateEventGroupEventType(eventGroupCode, normalizedNext);
      setRows((prev) =>
        prev.map((row) => (row.eventGroupCode === eventGroupCode ? updated : row)),
      );
      showSuccess('Event type updated.');
    } catch (saveError) {
      setRows((prev) =>
        prev.map((row) =>
          row.eventGroupCode === eventGroupCode
            ? { ...row, eventTypeCode: previousTypeCode }
            : row,
        ),
      );
      showProblem(
        saveError instanceof Error ? saveError.message : 'Unable to update event type.',
      );
    } finally {
      setSavingEventTypeCodes((prev) => {
        const next = new Set(prev);
        next.delete(eventGroupCode);
        return next;
      });
    }
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Event Groups
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Event groups ({filteredRows.length}
          {normalizedNameFilter !== '' && filteredRows.length !== rows.length
            ? ` of ${rows.length}`
            : ''}
          )
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 2, justifyContent: 'center', alignItems: { xs: 'stretch', md: 'center' } }}
        >
          <AppTextField
            label="Filter"
            value={nameFilter}
            onChange={(event) => setNameFilter(event.target.value)}
            size="small"
            sx={{ width: { xs: '100%', md: 260 } }}
            slotProps={{
              htmlInput: {
                'aria-label': 'Filter event groups by name',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            fullWidth={showXsLayout}
            sx={{ flexShrink: 0 }}
          >
            Add Event Group
          </Button>
        </Stack>

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" align="center" sx={{ py: 4 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && showXsLayout && (
          <Stack spacing={2}>
            {filteredRows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                {rows.length === 0
                  ? 'No event groups found.'
                  : 'No event groups match this filter.'}
              </Typography>
            ) : (
              filteredRows.map((row) => (
                <EventGroupMobileCard
                  key={row.eventGroupCode}
                  row={row}
                  eventTypeOptions={eventTypeOptions}
                  saving={savingEventTypeCodes.has(row.eventGroupCode)}
                  onEventTypeChange={(code, value) => {
                    void handleEventTypeChange(code, value);
                  }}
                  onEdit={() => navigate(eventGroupDetailPath(row.eventGroupCode))}
                />
              ))
            )}
          </Stack>
        )}

        {!loading && !error && showMdLayout && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" aria-label="Event groups table">
              <TableHead>
                <TableRow>
                  {showLgLayout ? (
                    <TableCell sx={{ fontWeight: 700 }}>Event Group Code</TableCell>
                  ) : null}
                  <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Event Type</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Events
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showLgLayout ? 4 : 3} align="center">
                      {rows.length === 0
                        ? 'No event groups found.'
                        : 'No event groups match this filter.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row) => (
                    <TableRow key={row.eventGroupCode} hover>
                      {showLgLayout ? (
                        <TableCell>{displayValue(row.eventGroupCode)}</TableCell>
                      ) : null}
                      <TableCell>{displayValue(row.fullName)}</TableCell>
                      <TableCell sx={{ minWidth: { md: 160, lg: 200 } }}>
                        <AppTextField
                          select
                          size="small"
                          fullWidth
                          value={row.eventTypeCode ?? ''}
                          disabled={savingEventTypeCodes.has(row.eventGroupCode)}
                          onChange={(event) => {
                            void handleEventTypeChange(row.eventGroupCode, event.target.value);
                          }}
                          slotProps={{
                            htmlInput: {
                              'aria-label': `Event type for ${row.fullName || row.eventGroupCode}`,
                            },
                          }}
                        >
                          <MenuItem value="">
                            <em>Select event type</em>
                          </MenuItem>
                          {eventTypeOptions.map((entry) => (
                            <MenuItem key={entry.key} value={entry.key}>
                              {entry.label}
                            </MenuItem>
                          ))}
                        </AppTextField>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(eventGroupDetailPath(row.eventGroupCode))}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(EVENT_HOME_PATH)}
            fullWidth={showXsLayout}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
          >
            Back to Event Home
          </Button>
        </Stack>
      </Paper>

      <AddEventGroupDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={() => {
          showSuccess('Event group created.');
          void loadEventGroups();
        }}
      />
    </Container>
  );
}
