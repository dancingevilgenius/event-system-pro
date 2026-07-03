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
  updateGoverningBody,
  type GoverningBodyRow,
  type GoverningBodyUpdate,
} from '../api/postgrest';
import GoverningBodyEditDialog from '../components/GoverningBodyEditDialog';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import { useMessages } from '../hooks/useMessages';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function MobileGoverningBodyCard({
  row,
  onEdit,
}: {
  row: GoverningBodyRow;
  onEdit: (row: GoverningBodyRow) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1}>
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
        <Divider />
        <Button variant="outlined" size="small" onClick={() => onEdit(row)} sx={{ alignSelf: 'flex-start' }}>
          Edit
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
  const [editRow, setEditRow] = useState<GoverningBodyRow | null>(null);
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

  const handleOpenEdit = (row: GoverningBodyRow) => {
    setEditRow(row);
  };

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setEditRow(null);
  };

  const handleSaveEdit = async (code: string, values: GoverningBodyUpdate) => {
    setSaving(true);

    try {
      const updated = await updateGoverningBody(code, values);
      setRows((current) =>
        current.map((row) => (row.code === updated.code ? updated : row)),
      );
      setEditRow(null);
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
                <MobileGoverningBodyCard key={row.code} row={row} onEdit={handleOpenEdit} />
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
                        <Button variant="outlined" size="small" onClick={() => handleOpenEdit(row)}>
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
          <Button variant="outlined" onClick={() => navigate('/adminhome')} sx={{ minWidth: 200 }}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>

      <GoverningBodyEditDialog
        open={editRow !== null}
        row={editRow}
        saving={saving}
        onClose={handleCloseEdit}
        onSave={(code, values) => void handleSaveEdit(code, values)}
      />
    </Container>
  );
}
