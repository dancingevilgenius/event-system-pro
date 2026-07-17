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
import { fetchAuditLogPage, type AuditLogRow } from '../api/postgrest';
import AuditLogDetailDialog from '../components/AuditLogDetailDialog';
import AuditLogFilterDialog, {
  EMPTY_AUDIT_LOG_FILTERS,
  type AuditLogFilters,
} from '../components/AuditLogFilterDialog';
import AuditTrailCard from '../components/AuditTrailCard';
import PurgeAuditLogDialog from '../components/PurgeAuditLogDialog';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import { formatAuditLogActor } from '../lib/auditLogDisplay';
import { isEventsystemFunDeployment } from '../lib/deployment';
import { formatReadableDateTime } from '../utils/auditTimestamps';

const DESKTOP_PAGE_SIZE = 25;
const MOBILE_PAGE_SIZE = 10;

function auditLogFiltersActive(filters: AuditLogFilters): boolean {
  return Object.values(filters).some((value) => value.trim() !== '');
}

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function formatOccurredAt(value: string): string {
  return formatReadableDateTime(value);
}

function MobileAuditLogCard({
  row,
  onView,
}: {
  row: AuditLogRow;
  onView: (row: AuditLogRow) => void;
}) {
  return (
    <AuditTrailCard
      columns={3}
      actionsAlign="right"
      actionsInGrid
      fields={[
        { key: 'when', label: 'When', value: formatOccurredAt(row.occurredAt) },
        { key: 'action', label: 'Action', value: displayValue(row.action) },
        { key: 'actor', label: 'Actor', value: formatAuditLogActor(row) },
        { key: 'table', label: 'Table', value: displayValue(row.tableName) },
        { key: 'record', label: 'Record', value: displayValue(row.recordKey) },
      ]}
      actions={
        <Button variant="outlined" size="small" onClick={() => onView(row)}>
          View
        </Button>
      }
    />
  );
}

export default function AdminAuditLogPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileDevice();
  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<AuditLogRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailRow, setDetailRow] = useState<AuditLogRow | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState<AuditLogFilters>(EMPTY_AUDIT_LOG_FILTERS);
  const [purgeDialogOpen, setPurgeDialogOpen] = useState(false);
  const [purgeSuccessMessage, setPurgeSuccessMessage] = useState<string | null>(null);
  const showPurgeAuditLog = isEventsystemFunDeployment();
  const filtersActive = auditLogFiltersActive(filters);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    setPage(0);
  }, [pageSize, filters]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const loadAuditLog = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAuditLogPage(safePage * pageSize, pageSize, filters);
      setRows(result.rows);
      setTotalCount(result.total);
    } catch (loadError) {
      setRows([]);
      setTotalCount(0);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load audit log.');
    } finally {
      setLoading(false);
    }
  }, [filters, pageSize, safePage]);

  useEffect(() => {
    void loadAuditLog();
  }, [loadAuditLog]);

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
          Audit Log
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          {totalCount} events
        </Typography>

        <Stack
          sx={{
            mb: 2,
            width: '100%',
            alignItems: isMobile ? 'center' : 'flex-start',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => setFilterDialogOpen(true)}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            Filter{filtersActive ? ' • Active' : ''}
          </Button>
        </Stack>

        {purgeSuccessMessage && (
          <Typography variant="body2" color="success.main" align="center" sx={{ mb: 2 }}>
            {purgeSuccessMessage}
          </Typography>
        )}

        {showPurgeAuditLog && (
          <Stack sx={{ alignItems: 'center', mb: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setPurgeSuccessMessage(null);
                setPurgeDialogOpen(true);
              }}
              disabled={loading}
            >
              Delete all audit trail records
            </Button>
          </Stack>
        )}

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

        {!loading && !error && isMobile && (
          <Stack spacing={2} sx={{ my: 3 }}>
            {rows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No audit events found.
              </Typography>
            ) : (
              rows.map((row) => <MobileAuditLogCard key={row.auditId} row={row} onView={setDetailRow} />)
            )}
          </Stack>
        )}

        {!loading && !error && !isMobile && (
          <TableContainer sx={{ overflowX: 'auto', my: 3 }}>
            <Table size="small" aria-label="Audit log">
              <TableHead>
                <TableRow>
                  <TableCell>When</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Actor</TableCell>
                  <TableCell>Table</TableCell>
                  <TableCell>Record</TableCell>
                  <TableCell align="right">More</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No audit events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.auditId} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {formatOccurredAt(row.occurredAt)}
                      </TableCell>
                      <TableCell>{displayValue(row.action)}</TableCell>
                      <TableCell>{formatAuditLogActor(row)}</TableCell>
                      <TableCell>{displayValue(row.tableName)}</TableCell>
                      <TableCell sx={{ maxWidth: 240, wordBreak: 'break-word' }}>
                        {displayValue(row.recordKey)}
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" onClick={() => setDetailRow(row)}>
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

        {!loading && !error && totalCount > 0 && (
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'center', mb: 3 }}
          >
            <Button variant="outlined" disabled={safePage === 0} onClick={handlePreviousPage}>
              Previous
            </Button>
            <Typography variant="body2" color="text.secondary">
              Page {safePage + 1} of {totalPages}
            </Typography>
            <Button variant="outlined" disabled={safePage >= totalPages - 1} onClick={handleNextPage}>
              Next
            </Button>
          </Stack>
        )}

        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/adminhome')} sx={{ minWidth: 200 }}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>

      <AuditLogFilterDialog
        open={filterDialogOpen}
        initialFilters={filters}
        onClose={() => setFilterDialogOpen(false)}
        onApply={(nextFilters) => {
          setFilters(nextFilters);
          setPage(0);
        }}
      />

      <AuditLogDetailDialog
        open={detailRow !== null}
        row={detailRow}
        onClose={() => setDetailRow(null)}
      />

      <PurgeAuditLogDialog
        open={purgeDialogOpen}
        totalCount={totalCount}
        onClose={() => setPurgeDialogOpen(false)}
        onPurged={(message) => {
          setPage(0);
          setPurgeSuccessMessage(message);
          void loadAuditLog();
        }}
      />
    </Container>
  );
}
