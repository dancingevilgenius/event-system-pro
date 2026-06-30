import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStaticLists, type StaticListListRow } from '../api/postgrest';
import { centeredContentStackSx } from '../constants/layout';

export default function StaticListsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<StaticListListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStaticLists = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const lists = await fetchStaticLists();
      setRows(lists);
    } catch (loadError) {
      setRows([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load static lists.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStaticLists();
  }, [loadStaticLists]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Static Lists
        </Typography>

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" sx={{ py: 4 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {rows.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No static lists found.
              </Typography>
            ) : (
              rows.map((row) => (
                <Button
                  key={row.listCode}
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() =>
                    navigate(`/static-list-details/${encodeURIComponent(row.listCode)}`)
                  }
                >
                  {row.listCode}
                </Button>
              ))
            )}
          </Stack>
        )}

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
