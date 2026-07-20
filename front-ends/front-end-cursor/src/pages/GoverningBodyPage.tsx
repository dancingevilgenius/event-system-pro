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
import {
  fetchGoverningBodies,
  updateGoverningBodyMoreJson,
  type GoverningBodyRow,
} from '../api/postgrest';
import AuditTrailCard from '../components/AuditTrailCard';
import GoverningBodyMoreDialog from '../components/GoverningBodyMoreDialog';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function GoverningBodyMobileCard({
  row,
  onMore,
}: {
  row: GoverningBodyRow;
  onMore: (row: GoverningBodyRow) => void;
}) {
  return (
    <AuditTrailCard
      columns={2}
      actionsAlign="right"
      actionsInGrid
      fields={[
        { key: 'code', label: 'Code', value: displayValue(row.code) },
        { key: 'long', label: 'Long name', value: displayValue(row.longName), columnSpan: 2 },
        { key: 'short', label: 'Short name', value: displayValue(row.shortName), columnSpan: 2 },
      ]}
      actions={
        <Button variant="outlined" size="small" onClick={() => onMore(row)}>
          More
        </Button>
      }
    />
  );
}

export default function GoverningBodyPage() {
  const navigate = useNavigate();
  const { showXsLayout, showMdLayout, showLgLayout, containerMaxWidth } = useLayoutTier();
  const { showSuccess, showProblem } = useMessages();

  const [rows, setRows] = useState<GoverningBodyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moreRow, setMoreRow] = useState<GoverningBodyRow | null>(null);
  const [saving, setSaving] = useState(false);

  const loadGoverningBodies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const bodies = await fetchGoverningBodies();
      setRows(bodies);
    } catch (loadError) {
      setRows([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load governing bodies.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGoverningBodies();
  }, [loadGoverningBodies]);

  const handleOpenMore = (row: GoverningBodyRow) => {
    setMoreRow(row);
  };

  const handleCloseMore = () => {
    if (saving) {
      return;
    }

    setMoreRow(null);
  };

  const handleSaveMore = async (code: string, moreJson: Record<string, string>) => {
    setSaving(true);

    try {
      const updated = await updateGoverningBodyMoreJson(code, moreJson);
      setRows((current) =>
        current.map((row) => (row.code === updated.code ? updated : row)),
      );
      setMoreRow(null);
      showSuccess('Governing body updated.');
    } catch (saveError) {
      showProblem(saveError instanceof Error ? saveError.message : 'Unable to save governing body.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Governing Bodies
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

        {!loading && !error && showXsLayout && (
          <Stack spacing={2} sx={{ my: 3 }}>
            {rows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No governing bodies found.
              </Typography>
            ) : (
              rows.map((row) => (
                <GoverningBodyMobileCard key={row.code} row={row} onMore={handleOpenMore} />
              ))
            )}
          </Stack>
        )}

        {!loading && !error && showMdLayout && (
          <TableContainer sx={{ overflowX: 'auto', my: 3 }}>
            <Table size="small" aria-label="Governing bodies">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>long_name</TableCell>
                  {showLgLayout ? (
                    <TableCell sx={{ fontWeight: 700 }}>short_name</TableCell>
                  ) : null}
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    More
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showLgLayout ? 4 : 3} align="center">
                      No governing bodies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.code} hover>
                      <TableCell>{displayValue(row.code)}</TableCell>
                      <TableCell>{displayValue(row.longName)}</TableCell>
                      {showLgLayout ? (
                        <TableCell>{displayValue(row.shortName)}</TableCell>
                      ) : null}
                      <TableCell align="right">
                        <Button variant="outlined" size="small" onClick={() => handleOpenMore(row)}>
                          More
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
            onClick={() => navigate('/adminhome')}
            fullWidth={showXsLayout}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
          >
            Back to Admin
          </Button>
        </Stack>
      </Paper>

      <GoverningBodyMoreDialog
        open={moreRow !== null}
        row={moreRow}
        saving={saving}
        onClose={handleCloseMore}
        onSave={(code, moreJson) => void handleSaveMore(code, moreJson)}
      />
    </Container>
  );
}
