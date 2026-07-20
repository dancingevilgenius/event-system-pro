import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStaticLists, type StaticListListRow } from '../api/postgrest';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

export default function StaticListsPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
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
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
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

        {!loading && !error && rows.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
            No static lists found.
          </Typography>
        )}

        {!loading && !error && rows.length > 0 && showXsLayout && (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {rows.map((row) => (
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
            ))}
          </Stack>
        )}

        {!loading && !error && rows.length > 0 && !showXsLayout && (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {rows.map((row) => (
              <Grid key={row.listCode} size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() =>
                    navigate(`/static-list-details/${encodeURIComponent(row.listCode)}`)
                  }
                >
                  {row.listCode}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        <Stack spacing={2} sx={showXsLayout ? centeredContentStackSx : undefined}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
