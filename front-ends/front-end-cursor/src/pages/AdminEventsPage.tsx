import {
  Button,
  CircularProgress,
  Container,
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
import { fetchEventGroups, type EventGroupListRow } from '../api/postgrest';
import AddEventGroupDialog from '../components/AddEventGroupDialog';
import EditEventGroupDirectorsDialog from '../components/EditEventGroupDirectorsDialog';
import { EVENT_HOME_PATH, eventGroupDetailPath } from '../constants/eventRoutes';
import { useMessages } from '../hooks/useMessages';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const { showSuccess } = useMessages();
  const [rows, setRows] = useState<EventGroupListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [directorsDialogRow, setDirectorsDialogRow] = useState<EventGroupListRow | null>(null);

  const loadEventGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const eventGroups = await fetchEventGroups();
      setRows(eventGroups);
    } catch (loadError) {
      setRows([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load event groups.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEventGroups();
  }, [loadEventGroups]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Event Groups
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Event groups ({rows.length})
        </Typography>

        <Stack direction="row" sx={{ mb: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
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

        {!loading && !error && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" aria-label="Event groups table">
              <TableHead>
                <TableRow>
                  <TableCell>Event Group Code</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell align="center">Directors</TableCell>
                  <TableCell align="center">Events</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No event groups found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.eventGroupCode} hover>
                      <TableCell>{displayValue(row.eventGroupCode)}</TableCell>
                      <TableCell>{displayValue(row.fullName)}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setDirectorsDialogRow(row)}
                        >
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(eventGroupDetailPath(row.eventGroupCode))
                          }
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
          <Button variant="outlined" onClick={() => navigate(EVENT_HOME_PATH)} sx={{ minWidth: 200 }}>
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

      <EditEventGroupDirectorsDialog
        open={directorsDialogRow !== null}
        eventGroupCode={directorsDialogRow?.eventGroupCode ?? ''}
        eventGroupName={directorsDialogRow?.fullName ?? ''}
        initialDirectors={directorsDialogRow?.directors ?? []}
        onClose={() => setDirectorsDialogRow(null)}
        onSaved={() => {
          showSuccess('Directors updated.');
          void loadEventGroups();
        }}
      />
    </Container>
  );
}
