import {
  Box,
  Checkbox,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState, type MouseEvent } from 'react';
import PageHeader from './PageHeader';
import PercentCompleteBar from './PercentCompleteBar';
import { useLayoutTier } from '../hooks/useLayoutTier';

export type CheckinColumn = {
  key: string;
  label: string;
  width?: string;
};

export type CheckinSheetRow = {
  id: string;
  values: Record<string, string>;
  checked: boolean;
  checkAriaLabel: string;
};

type RosterView = 'everybody' | 'missing';

type CheckinSheetProps = {
  title: string;
  tableLabel: string;
  columns: CheckinColumn[];
  rows: CheckinSheetRow[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  onToggle: (id: string, checked: boolean) => void;
};

const cellSx = {
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  verticalAlign: 'middle',
  px: { xs: 0.5, md: 2 },
  fontSize: { xs: '0.75rem', md: '0.875rem' },
} as const;

export default function CheckinSheet({
  title,
  tableLabel,
  columns,
  rows,
  loading,
  error,
  emptyMessage,
  onToggle,
}: CheckinSheetProps) {
  const { containerMaxWidth } = useLayoutTier();
  const [rosterView, setRosterView] = useState<RosterView>('everybody');
  const columnCount = columns.length + 1;
  const visibleRows = rosterView === 'missing' ? rows.filter((row) => !row.checked) : rows;
  const checkedCount = rows.filter((row) => row.checked).length;
  const percentCheckedIn = rows.length === 0 ? 0 : (checkedCount / rows.length) * 100;
  const percentCheckedInLabel = `Percent Checked-in: ${Math.round(percentCheckedIn)}%`;
  const tableEmptyMessage =
    rows.length > 0 && visibleRows.length === 0 ? 'Everybody is checked in.' : emptyMessage;

  const handleRosterViewChange = (_event: MouseEvent<HTMLElement>, next: RosterView | null) => {
    if (next) {
      setRosterView(next);
    }
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader
          title={title}
          backTo="/floor-coordinator-demos"
          backLabel="Back to Floor Coordinator Demos"
        />
        {!loading && !error && (
          <Box sx={{ mb: 2 }}>
            <PercentCompleteBar
              percent={percentCheckedIn}
              label={percentCheckedInLabel}
              completeColor="success"
            />
          </Box>
        )}
        {!loading && !error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={rosterView}
              onChange={handleRosterViewChange}
              aria-label="Roster filter"
            >
              <ToggleButton value="everybody">Show Everybody</ToggleButton>
              <ToggleButton value="missing">Show Missing</ToggleButton>
            </ToggleButtonGroup>
          </Box>
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

        {!loading && !error && (
          <TableContainer>
            <Table size="small" aria-label={tableLabel} sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      scope="col"
                      sx={{ ...cellSx, fontWeight: 700, width: column.width, verticalAlign: 'bottom' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell
                    scope="col"
                    align="center"
                    sx={{ ...cellSx, fontWeight: 700, width: { xs: '4.75rem', md: '7.5rem' }, verticalAlign: 'bottom' }}
                  >
                    Checked-In
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columnCount} align="center">
                      {tableEmptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleRows.map((row) => (
                    <TableRow key={row.id} hover>
                      {columns.map((column) => (
                        <TableCell key={column.key} sx={cellSx}>
                          {row.values[column.key] || '—'}
                        </TableCell>
                      ))}
                      <TableCell align="center" sx={{ ...cellSx, px: { xs: 0, md: 1 } }}>
                        <Checkbox
                          checked={row.checked}
                          onChange={(event) => onToggle(row.id, event.target.checked)}
                          slotProps={{ input: { 'aria-label': row.checkAriaLabel } }}
                          sx={{ p: { xs: 0.5, md: 1 } }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
