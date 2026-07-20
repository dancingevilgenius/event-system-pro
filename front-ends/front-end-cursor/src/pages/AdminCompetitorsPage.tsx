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
  useMediaQuery,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsersPage, type UserFilters, type UserListRow, type UserSort } from '../api/postgrest';
import AuditTrailCard from '../components/AuditTrailCard';
import UserFilterSortDialog, {
  DEFAULT_USER_SORT,
  EMPTY_USER_FILTERS,
} from '../components/UserFilterSortDialog';

const DESKTOP_PAGE_SIZE = 25;
const TABLET_PAGE_SIZE = 15;
const MOBILE_PAGE_SIZE = 10;

const MD_LAYOUT_QUERY = '(min-width:768px)';
const LG_LAYOUT_QUERY = '(min-width:1024px)';
const XL_LAYOUT_QUERY = '(min-width:1280px)';

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

function CompetitorMobileCard({ row }: { row: UserListRow }) {
  return (
    <AuditTrailCard
      columns={2}
      fields={[
        { key: 'first', label: 'First Name', value: displayValue(row.firstName) },
        { key: 'last', label: 'Last Name', value: displayValue(row.lastName) },
        { key: 'city', label: 'City', value: displayValue(row.city) },
        { key: 'state', label: 'State', value: displayValue(row.state) },
        {
          key: 'role',
          label: 'Primary Role',
          value: displayValue(row.primaryRole),
          columnSpan: 2,
        },
      ]}
    />
  );
}

export default function AdminCompetitorsPage() {
  const navigate = useNavigate();
  const showMdLayout = useMediaQuery(MD_LAYOUT_QUERY);
  const showLgLayout = useMediaQuery(LG_LAYOUT_QUERY);
  const showXlLayout = useMediaQuery(XL_LAYOUT_QUERY);
  const showXsLayout = !showMdLayout;

  const pageSize = showXsLayout ? MOBILE_PAGE_SIZE : showLgLayout ? DESKTOP_PAGE_SIZE : TABLET_PAGE_SIZE;

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<UserListRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(EMPTY_USER_FILTERS);
  const [sort, setSort] = useState<UserSort>(DEFAULT_USER_SORT);

  const containerMaxWidth = showXlLayout ? 'xl' : showLgLayout ? 'lg' : showMdLayout ? 'md' : 'sm';

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
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Competitors
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          All users ({totalCount})
        </Typography>

        <Stack
          sx={{
            mb: 2,
            width: '100%',
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setFilterDialogOpen(true)}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
            fullWidth={showXsLayout}
          >
            Filter and Sort
            {(filtersActive || sortActive) && ' • Active'}
          </Button>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
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

        {!loading && !error && showXsLayout && (
          <Stack spacing={2} sx={{ mb: 2 }}>
            {rows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                No users found.
              </Typography>
            ) : (
              rows.map((row) => <CompetitorMobileCard key={row.userId} row={row} />)
            )}
          </Stack>
        )}

        {!loading && !error && showMdLayout && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" aria-label="Users table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Last Name</TableCell>
                  {showLgLayout ? (
                    <>
                      <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>State</TableCell>
                    </>
                  ) : null}
                  <TableCell sx={{ fontWeight: 700 }}>Primary Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showLgLayout ? 5 : 3} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.userId} hover>
                      <TableCell>{displayValue(row.firstName)}</TableCell>
                      <TableCell>{displayValue(row.lastName)}</TableCell>
                      {showLgLayout ? (
                        <>
                          <TableCell>{displayValue(row.city)}</TableCell>
                          <TableCell>{displayValue(row.state)}</TableCell>
                        </>
                      ) : null}
                      <TableCell>{displayValue(row.primaryRole)}</TableCell>
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
            onClick={() => navigate('/adminhome')}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
            fullWidth={showXsLayout}
          >
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
