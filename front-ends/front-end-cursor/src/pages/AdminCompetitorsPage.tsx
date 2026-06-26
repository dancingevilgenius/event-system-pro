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
import { fetchUsersPage, type UserFilters, type UserListRow, type UserSort } from '../api/postgrest';
import UserFilterSortDialog, {
  DEFAULT_USER_SORT,
  EMPTY_USER_FILTERS,
} from '../components/UserFilterSortDialog';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

const DESKTOP_PAGE_SIZE = 25;
const MOBILE_PAGE_SIZE = 10;

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function hasActiveFilters(filters: UserFilters): boolean {
  return (
    filters.firstName.trim() !== '' ||
    filters.lastName.trim() !== '' ||
    filters.city.trim() !== '' ||
    filters.state !== '' ||
    filters.primaryRole !== null
  );
}

export default function AdminCompetitorsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileDevice();
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<UserListRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(EMPTY_USER_FILTERS);
  const [sort, setSort] = useState<UserSort>(DEFAULT_USER_SORT);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const filtersActive = hasActiveFilters(filters);
  const sortActive =
    sort.column !== DEFAULT_USER_SORT.column || sort.direction !== DEFAULT_USER_SORT.direction;

  useEffect(() => {
    setPage(0);
  }, [pageSize, filters, sort]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchUsersPage(safePage * pageSize, pageSize, filters, sort);
      setRows(result.users);
      setTotalCount(result.total);
    } catch (loadError) {
      setRows([]);
      setTotalCount(0);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, [filters, pageSize, safePage, sort]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handlePreviousPage = () => {
    setPage((current) => Math.max(0, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => Math.min(totalPages - 1, current + 1));
  };

  const handleApplyFilterSort = (nextFilters: UserFilters, nextSort: UserSort) => {
    setFilters(nextFilters);
    setSort(nextSort);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Competitors
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          All users ({totalCount})
        </Typography>

        <Stack
          alignItems={isMobile ? 'center' : 'flex-start'}
          sx={{ mb: 2, width: '100%' }}
        >
          <Button
            variant="outlined"
            onClick={() => setFilterDialogOpen(true)}
            sx={{ minWidth: 200 }}
          >
            Filter and Sort
            {(filtersActive || sortActive) && ' • Active'}
          </Button>
        </Stack>

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
          <Stack alignItems="center" sx={{ py: 6 }}>
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

      <UserFilterSortDialog
        open={filterDialogOpen}
        initialFilters={filters}
        initialSort={sort}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleApplyFilterSort}
      />
    </Container>
  );
}
