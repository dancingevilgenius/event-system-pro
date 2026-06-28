import {
  Button,
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
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildMockContestResults } from '../data/mockContestResults';
import { formatCompetitorPairNames } from '../data/legionNames';

export default function AdminContestResultsPage() {
  const navigate = useNavigate();
  const results = useMemo(() => buildMockContestResults(), []);
  const { judgeSheets, placementRows, entryByBib } = results;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Contest Results
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Relative Placement after {judgeSheets.length} judges · {placementRows.length} couples
        </Typography>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" stickyHeader aria-label="Relative placement results">
            <TableHead>
              <TableRow>
                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                  Place
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                  Bib
                </TableCell>
                <TableCell sx={{ fontWeight: 700, minWidth: '12rem' }}>Couple</TableCell>
                {judgeSheets.map((sheet) => (
                  <TableCell
                    key={sheet.label}
                    align="center"
                    sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                  >
                    {sheet.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {placementRows.map((row) => {
                const entry = entryByBib.get(row.bib);

                return (
                  <TableRow key={row.bib} hover>
                    <TableCell align="right" sx={{ fontWeight: row.place <= 3 ? 700 : 400 }}>
                      {row.place}
                    </TableCell>
                    <TableCell align="right">{row.bib}</TableCell>
                    <TableCell>
                      {entry
                        ? formatCompetitorPairNames(entry.leader, entry.follower, {
                            leaderFullFirst: true,
                            followerFullFirst: true,
                          })
                        : '—'}
                    </TableCell>
                    {judgeSheets.map((sheet) => (
                      <TableCell key={sheet.label} align="center" sx={{ whiteSpace: 'nowrap' }}>
                        {sheet.placements[row.bib]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} sx={{ mt: 4, maxWidth: 360, mx: 'auto' }}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/admin/contests')}>
            Back to Contests
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
