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
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsersPage, type UserListRow } from '../api/postgrest';
import { EMPTY_USER_FILTERS } from '../components/UserFilterSortDialog';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

const DESKTOP_PAGE_SIZE = 25;
const MOBILE_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

export default function AdminSearchUsersPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileDevice();
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<UserListRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [pageSize, debouncedSearch]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchUsersPage(
        safePage * pageSize,
        pageSize,
        EMPTY_USER_FILTERS,
        { column: 'lastName', direction: 'asc' },
        { nameSearch: debouncedSearch },
      );
      setRows(result.users);
      setTotalCount(result.total);
    } catch (loadError) {
      setRows([]);
      setTotalCount(0);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, pageSize, safePage]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handlePreviousPage = () => {
    setPage((current) => Math.max(0, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Search Users
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          All users ({totalCount})
        </Typography>

        <TextField
          fullWidth
          label="Search by first or last name"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Type to search…"
          autoComplete="off"
          sx={{ mb: 2 }}
        />

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={handlePreviousPage}
            disabled={loading || safePage === 0}
            sx={{ minWidth: 96 }}
          >
            Previous
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Page {safePage + 1} of {totalPages}
            <Typography component="span" variant="caption" sx={{ display: 'block' }}>
              {pageSize} per page
            </Typography>
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleNextPage}
            disabled={loading || safePage >= totalPages - 1}
            sx={{ minWidth: 96 }}
          >
            Next
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
            <Table size="small" aria-label="Users table">
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Primary Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.userId} hover>
                      <TableCell>{displayValue(row.firstName)}</TableCell>
                      <TableCell>{displayValue(row.lastName)}</TableCell>
                      <TableCell>{displayValue(row.city)}</TableCell>
                      <TableCell>{displayValue(row.state)}</TableCell>
                      <TableCell>{displayValue(row.primaryRole)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/adminhome')} sx={{ minWidth: 200 }}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
