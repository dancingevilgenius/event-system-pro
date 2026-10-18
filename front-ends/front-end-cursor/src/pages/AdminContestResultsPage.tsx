import {
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
  useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchSavedEventItemPlacement, fetchSavedRelativePlacement } from '../api/postgrest';
import AuditTrailCard from '../components/AuditTrailCard';
import PageHeader from '../components/PageHeader';
import { buildMockContestResults } from '../data/mockContestResults';
import type { MockContestEntry } from '../data/mockContestEntries';
import { formatCompetitorPairNames } from '../data/legionNames';
import { contestResultsLabel, type SavedRelativePlacement } from '../lib/relativePlacementResults';
import { formatPlacementMark, type RelativePlacementRow } from '../utils/relativePlacement';

const MD_LAYOUT_QUERY = '(min-width:768px)';
const LG_LAYOUT_QUERY = '(min-width:1024px)';
const XL_LAYOUT_QUERY = '(min-width:1280px)';

const placementMarkCellSx = {
  whiteSpace: 'nowrap',
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
} as const;

const headJudgeDividerSx = {
  borderLeftWidth: 2,
  borderLeftStyle: 'solid',
  borderLeftColor: 'divider',
} as const;

type ResultJudgeSheet = {
  label: string;
  headJudge?: boolean;
};

function formatCoupleName(entry: MockContestEntry | undefined): string {
  if (!entry) {
    return '—';
  }

  const leader = `${entry.leader.first} ${entry.leader.last}`.trim();
  const follower = `${entry.follower.first} ${entry.follower.last}`.trim();
  if (leader === '' && follower === '') {
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
  judgeSheets: ResultJudgeSheet[];
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
        ...judgeSheets.flatMap((sheet, index) => {
          const placement = row.judgePlacements[index];
          const scoreField = {
            key: sheet.label,
            label: sheet.label,
            value: placement == null ? '—' : formatPlacementMark(placement),
          };
          if (sheet.headJudge !== true) {
            return [scoreField];
          }
          return [
            {
              key: `${sheet.label}-divider`,
              label: ' ',
              value: <Divider />,
              columnSpan: 3 as const,
            },
            scoreField,
          ];
        }),
      ]}
    />
  );
}

export default function AdminContestResultsPage() {
  const { contestId: contestIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const itemMode = contestIdParam === 'item';
  const savedMode = contestIdParam !== undefined;
  const contestId = Number(contestIdParam);
  const contestIdValid = Number.isInteger(contestId) && contestId > 0;
  const eventId = Number(searchParams.get('eventId'));
  const contestItemId = searchParams.get('contestItemId')?.trim() ?? '';
  const itemValid = Number.isInteger(eventId) && eventId > 0 && contestItemId !== '';
  const showMdLayout = useMediaQuery(MD_LAYOUT_QUERY);
  const showLgLayout = useMediaQuery(LG_LAYOUT_QUERY);
  const showXlLayout = useMediaQuery(XL_LAYOUT_QUERY);
  const showXsLayout = !showMdLayout;
  const [saved, setSaved] = useState<SavedRelativePlacement | null>(null);
  const [loading, setLoading] = useState(savedMode);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!savedMode) {
      return;
    }
    if (itemMode ? !itemValid : !contestIdValid) {
      setLoading(false);
      setLoadError('This contest could not be opened.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    const load = itemMode
      ? fetchSavedEventItemPlacement(eventId, contestItemId)
      : fetchSavedRelativePlacement(contestId);
    void load
      .then((result) => {
        if (!cancelled) {
          setSaved(result);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Unable to load contest results.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [savedMode, itemMode, itemValid, contestIdValid, contestId, eventId, contestItemId]);

  const mockResults = useMemo(() => (savedMode ? null : buildMockContestResults()), [savedMode]);
  const savedView = useMemo(() => {
    if (!saved) {
      return null;
    }

    return {
      label: contestResultsLabel(saved),
      judgeSheets: saved.judges.map((judge) => ({
        label: judge.initials,
        headJudge: judge.headJudge,
      })),
      placementRows: saved.rows.map((row) => ({
        bib: row.bib,
        place: row.place,
        judgePlacements: row.judgePlacements,
      })),
      entryByBib: new Map(
        saved.rows.map((row) => [
          row.bib,
          {
            number: row.bib,
            leader: { first: row.leaderFirst, last: row.leaderLast, sex: 'male' as const },
            follower: { first: row.followerFirst, last: row.followerLast, sex: 'female' as const },
          },
        ]),
      ),
    };
  }, [saved]);
  const results = savedMode ? savedView : mockResults;
  const judgeSheets: ResultJudgeSheet[] = (results?.judgeSheets ?? []).map((sheet) => ({
    label: sheet.label,
    headJudge: 'headJudge' in sheet ? sheet.headJudge === true : false,
  }));
  const placementRows = results?.placementRows ?? [];
  const entryByBib = results?.entryByBib ?? new Map<number, MockContestEntry>();

  const containerMaxWidth = showXlLayout ? 'xl' : showLgLayout ? 'lg' : showMdLayout ? 'md' : 'sm';
  const coupleColumnMinWidth = showLgLayout ? '12rem' : '8rem';

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader
          title={savedMode ? (savedView?.label ?? 'Results') : 'Relative Placement'}
          backTo={savedMode ? '/results' : '/admin/contests'}
          backLabel={savedMode ? 'Back to Results' : 'Back to Contests'}
          titleSx={
            savedMode
              ? { fontSize: { xs: '1.15rem', md: '1.5rem', lg: '1.75rem', xl: '2rem' }, lineHeight: 1.2 }
              : undefined
          }
        />
        {savedMode && loading ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{ my: 3, alignItems: 'center', justifyContent: 'center' }}
          >
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading results…
            </Typography>
          </Stack>
        ) : null}
        {savedMode && !loading && loadError ? (
          <Typography variant="body2" color="error" sx={{ my: 3, textAlign: 'center' }}>
            {loadError}
          </Typography>
        ) : null}
        {savedMode && !loading && !loadError && !savedView ? (
          <Typography variant="body1" sx={{ my: 3, textAlign: 'center' }}>
            Relative placement has not been saved for this contest.
          </Typography>
        ) : null}
        {!savedMode || savedView ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'center' }}
        >
          {judgeSheets.length} judges · {placementRows.length} couples
        </Typography>
        ) : null}

        {results ? (showXsLayout ? (
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
                      sx={{
                        fontWeight: 700,
                        ...placementMarkCellSx,
                        ...(sheet.headJudge ? headJudgeDividerSx : {}),
                      }}
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
                          <TableCell
                            key={sheet.label}
                            align="center"
                            sx={{
                              ...placementMarkCellSx,
                              ...(sheet.headJudge ? headJudgeDividerSx : {}),
                            }}
                          >
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
        ) ) : null}

      </Paper>
    </Container>
  );
}
