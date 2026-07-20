import {
  Box,
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
  useMediaQuery,
} from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuditTrailCard from '../components/AuditTrailCard';
import { buildMockContestResults } from '../data/mockContestResults';
import type { MockContestEntry } from '../data/mockContestEntries';
import { formatCompetitorPairNames } from '../data/legionNames';
import { formatPlacementMark, type RelativePlacementRow } from '../utils/relativePlacement';

const MD_LAYOUT_QUERY = '(min-width:768px)';
const LG_LAYOUT_QUERY = '(min-width:1024px)';
const XL_LAYOUT_QUERY = '(min-width:1280px)';

const placementMarkCellSx = {
  whiteSpace: 'nowrap',
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
} as const;

function formatCoupleName(entry: MockContestEntry | undefined): string {
  if (!entry) {
    return '—';
  }

  return formatCompetitorPairNames(entry.leader, entry.follower, {
    leaderFullFirst: true,
    followerFullFirst: true,
  });
}

function ContestResultMobileCard({
  row,
  entry,
  judgeSheets,
}: {
  row: RelativePlacementRow;
  entry: MockContestEntry | undefined;
  judgeSheets: { label: string }[];
}) {
  return (
    <AuditTrailCard
      columns={3}
      fields={[
        {
          key: 'place',
          label: 'Place',
          value: formatPlacementMark(row.place),
          valueSx: { fontWeight: row.place <= 3 ? 700 : 400 },
        },
        { key: 'bib', label: 'Bib', value: row.bib },
        {
          key: 'couple',
          label: 'Couple',
          value: formatCoupleName(entry),
          columnSpan: 3,
        },
        ...judgeSheets.map((sheet, index) => {
          const placement = row.judgePlacements[index];

          return {
            key: sheet.label,
            label: sheet.label,
            value: placement == null ? '—' : formatPlacementMark(placement),
          };
        }),
      ]}
    />
  );
}

export default function AdminContestResultsPage() {
  const navigate = useNavigate();
  const showMdLayout = useMediaQuery(MD_LAYOUT_QUERY);
  const showLgLayout = useMediaQuery(LG_LAYOUT_QUERY);
  const showXlLayout = useMediaQuery(XL_LAYOUT_QUERY);
  const showXsLayout = !showMdLayout;

  const results = useMemo(() => buildMockContestResults(), []);
  const { judgeSheets, placementRows, entryByBib } = results;

  const containerMaxWidth = showXlLayout ? 'xl' : showLgLayout ? 'lg' : showMdLayout ? 'md' : 'sm';
  const coupleColumnMinWidth = showLgLayout ? '12rem' : '8rem';

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Relative Placement
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          {judgeSheets.length} judges · {placementRows.length} couples
        </Typography>

        {showXsLayout ? (
          <Stack spacing={2}>
            {placementRows.map((row) => (
              <ContestResultMobileCard
                key={row.bib}
                row={row}
                entry={entryByBib.get(row.bib)}
                judgeSheets={judgeSheets}
              />
            ))}
          </Stack>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table
              size="small"
              stickyHeader={showLgLayout}
              aria-label="Relative placement results"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700, ...placementMarkCellSx }}>
                    Place
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                    Bib
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: coupleColumnMinWidth }}>
                    Couple
                  </TableCell>
                  {judgeSheets.map((sheet) => (
                    <TableCell
                      key={sheet.label}
                      align="center"
                      sx={{ fontWeight: 700, ...placementMarkCellSx }}
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
                      <TableCell
                        align="center"
                        sx={{
                          ...placementMarkCellSx,
                          fontWeight: row.place <= 3 ? 700 : 400,
                        }}
                      >
                        {formatPlacementMark(row.place)}
                      </TableCell>
                      <TableCell align="right">{row.bib}</TableCell>
                      <TableCell>{formatCoupleName(entry)}</TableCell>
                      {judgeSheets.map((sheet, index) => {
                        const placement = row.judgePlacements[index];

                        return (
                          <TableCell key={sheet.label} align="center" sx={placementMarkCellSx}>
                            {placement == null ? '—' : formatPlacementMark(placement)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 4, maxWidth: { xs: '100%', md: 360 }, mx: 'auto' }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/admin/contests')}
          >
            Back to Contests
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
