import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
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
import GoverningBodyMoreDialog from '../components/GoverningBodyMoreDialog';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import { useMessages } from '../hooks/useMessages';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function MobileGoverningBodyCard({
  row,
  onMore,
}: {
  row: GoverningBodyRow;
  onMore: (row: GoverningBodyRow) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Code
            </Typography>
            <Typography variant="body2">{displayValue(row.code)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Long name
            </Typography>
            <Typography variant="body2">{displayValue(row.longName)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Short name
            </Typography>
            <Typography variant="body2">{displayValue(row.shortName)}</Typography>
          </Box>
        </Box>
        <Divider />
        <Button variant="outlined" size="small" onClick={() => onMore(row)} sx={{ alignSelf: 'flex-start' }}>
          More
        </Button>
      </Stack>
    </Paper>
  );
}

export default function GoverningBodyPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobileDevice();
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
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

        {!loading && !error && isMobile && (
          <Stack spacing={2} sx={{ my: 3 }}>
            {rows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No governing bodies found.
              </Typography>
            ) : (
              rows.map((row) => (
                <MobileGoverningBodyCard key={row.code} row={row} onMore={handleOpenMore} />
              ))
            )}
          </Stack>
        )}

        {!loading && !error && !isMobile && (
          <TableContainer sx={{ overflowX: 'auto', my: 3 }}>
            <Table size="small" aria-label="Governing bodies">
              <TableHead>
                <TableRow>
                  <TableCell>code</TableCell>
                  <TableCell>long_name</TableCell>
                  <TableCell>short_name</TableCell>
                  <TableCell align="right">More</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No governing bodies found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.code} hover>
                      <TableCell>{displayValue(row.code)}</TableCell>
                      <TableCell>{displayValue(row.longName)}</TableCell>
                      <TableCell>{displayValue(row.shortName)}</TableCell>
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
          <Button variant="outlined" onClick={() => navigate('/adminhome')} sx={{ minWidth: 200 }}>
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
