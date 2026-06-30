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
import { fetchDemoEventGroupsWithAttendees, type EventGroupListRow } from '../api/postgrest';
import { EVENT_HOME_PATH, eventGroupDetailPath } from '../constants/eventRoutes';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<EventGroupListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEventGroups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const eventGroups = await fetchDemoEventGroupsWithAttendees();
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
          Demo event groups with attendees ({rows.length})
        </Typography>

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
            <Table size="small" aria-label="Demo event groups table">
              <TableHead>
                <TableRow>
                  <TableCell>Event Group Code</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No demo event groups with attendees found. Try Generate Attendees on Admin home.
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
                          onClick={() =>
                            navigate(eventGroupDetailPath(row.eventGroupCode))
                          }
                        >
                          View
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
    </Container>
  );
}
