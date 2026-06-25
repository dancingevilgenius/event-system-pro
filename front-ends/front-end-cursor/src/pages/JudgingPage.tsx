import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CompetitorColorDialog from '../components/CompetitorColorDialog';
import CompetitorColorSwatch from '../components/CompetitorColorSwatch';
import CompetitorColorSwatchBox, {
  COLOR_SWATCH_SIZE,
} from '../components/CompetitorColorSwatchBox';
import JudgingScoreInput from '../components/JudgingScoreInput';
import PaletteOutlinedIcon from '../components/PaletteOutlinedIcon';
import PercentCompleteBar from '../components/PercentCompleteBar';
import { centeredContentStackSx, CONTENT_MAX_WIDTH } from '../constants/layout';
import {
  formatCompetitorPairNames,
  formatFullFirstLast,
  LEGION_MEMBER_NAMES,
  type LegionMember,
} from '../data/legionNames';
import {
  competitorRecordKey,
  emptyColorRecord,
  hasSelectedColors,
  type CompetitorColorRecord,
  type CompetitorRole,
} from '../types/competitorColors';
import {
  digitsToScore,
  emptyEntryScoreState,
  formatScoreDisplay,
  randomScoreDigitsBetween,
  type EntryScoreState,
  type JudgingScoreDigits,
} from '../types/judgingScore';

const ENTRY_COUNT = 20;
const NUMBER_COLUMN_WIDTH = '2.75rem';
const SCORE_DISPLAY_WIDTH = '5ch';
const SUMMARY_SWATCH_GAP = 2;

type JudgingSortOption =
  | 'bib'
  | 'rawScore'
  | 'leaderLastName'
  | 'followerLastName'
  | 'unscoredOnly';

type JudgingDropdownValue = JudgingSortOption | 'assignRandomScores';

const JUDGING_DROPDOWN_OPTIONS: { value: JudgingDropdownValue; label: string }[] = [
  { value: 'bib', label: 'Sort by Bib #' },
  { value: 'rawScore', label: 'Sort by Raw Score' },
  { value: 'leaderLastName', label: "Sort by Leader's Last Name" },
  { value: 'followerLastName', label: "Sort by Follower's Last Name" },
  { value: 'unscoredOnly', label: 'Unscored Only' },
  { value: 'assignRandomScores', label: 'Assign Random Scores' },
];

const SUMMARY_NAME_MODES = [
  { leaderFullFirst: true, followerFullFirst: true },
  { leaderFullFirst: false, followerFullFirst: true },
  { leaderFullFirst: true, followerFullFirst: false },
  { leaderFullFirst: false, followerFullFirst: false },
] as const;

type SummaryNameMode = (typeof SUMMARY_NAME_MODES)[number];

function summarySwatchReserve(hasLeaderColors: boolean, hasFollowerColors: boolean): number {
  let reserve = 0;

  if (hasLeaderColors) {
    reserve += COLOR_SWATCH_SIZE + SUMMARY_SWATCH_GAP;
  }

  if (hasFollowerColors) {
    reserve += COLOR_SWATCH_SIZE + SUMMARY_SWATCH_GAP;
  }

  return reserve;
}

type JudgingEntry = {
  number: number;
  leader: LegionMember;
  follower: LegionMember;
};

function pickRandomMember(exclude?: LegionMember): LegionMember {
  const excludeKey = exclude ? `${exclude.first}|${exclude.last}` : undefined;
  const pool = excludeKey
    ? LEGION_MEMBER_NAMES.filter(
        (member) => `${member.first}|${member.last}` !== excludeKey,
      )
    : LEGION_MEMBER_NAMES;

  return pool[Math.floor(Math.random() * pool.length)];
}

function createJudgingEntries(): JudgingEntry[] {
  const numbers = new Set<number>();

  while (numbers.size < ENTRY_COUNT) {
    numbers.add(Math.floor(Math.random() * 999) + 1);
  }

  return [...numbers]
    .sort((a, b) => a - b)
    .map((number) => {
      const leader = pickRandomMember();
      const follower = pickRandomMember(leader);

      return { number, leader, follower };
    });
}

function entryHasNonZeroScore(
  bibNumber: number,
  scoreByBib: Record<number, EntryScoreState>,
): boolean {
  const score = scoreByBib[bibNumber];

  if (!score?.touched) {
    return false;
  }

  return digitsToScore(score.digits) > 0;
}

function calculatePercentComplete(
  entries: JudgingEntry[],
  scoreByBib: Record<number, EntryScoreState>,
): number {
  if (entries.length === 0) {
    return 0;
  }

  const scoredCount = entries.filter((entry) =>
    entryHasNonZeroScore(entry.number, scoreByBib),
  ).length;

  return (scoredCount / entries.length) * 100;
}

function entryShowsAsUnscored(
  bibNumber: number,
  scoreByBib: Record<number, EntryScoreState>,
): boolean {
  const score = scoreByBib[bibNumber];

  if (!score?.touched) {
    return true;
  }

  return digitsToScore(score.digits) <= 0;
}

function sortJudgingEntries(
  entries: JudgingEntry[],
  sortOption: JudgingSortOption,
  scoreByBib: Record<number, EntryScoreState>,
): JudgingEntry[] {
  const sorted = [...entries];

  const compareBib = (a: JudgingEntry, b: JudgingEntry) => a.number - b.number;

  const rawScoreValue = (bibNumber: number): number => {
    const score = scoreByBib[bibNumber];

    if (!score?.touched) {
      return -Infinity;
    }

    return digitsToScore(score.digits);
  };

  switch (sortOption) {
    case 'bib':
      sorted.sort(compareBib);
      break;
    case 'rawScore':
      sorted.sort((a, b) => {
        const diff = rawScoreValue(b.number) - rawScoreValue(a.number);

        return diff !== 0 ? diff : compareBib(a, b);
      });
      break;
    case 'leaderLastName':
      sorted.sort((a, b) => {
        const diff = a.leader.last.localeCompare(b.leader.last);

        return diff !== 0 ? diff : compareBib(a, b);
      });
      break;
    case 'followerLastName':
      sorted.sort((a, b) => {
        const diff = a.follower.last.localeCompare(b.follower.last);

        return diff !== 0 ? diff : compareBib(a, b);
      });
      break;
    case 'unscoredOnly':
      sorted.sort(compareBib);
      return sorted.filter((entry) => entryShowsAsUnscored(entry.number, scoreByBib));
  }

  return sorted;
}

type CompetitorNamesTextProps = {
  leader: LegionMember;
  follower: LegionMember;
  leaderColors: CompetitorColorRecord;
  followerColors: CompetitorColorRecord;
};

function CompetitorNamesText({
  leader,
  follower,
  leaderColors,
  followerColors,
}: CompetitorNamesTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [nameMode, setNameMode] = useState<SummaryNameMode>(SUMMARY_NAME_MODES[0]);

  const showLeaderSwatch = hasSelectedColors(leaderColors);
  const showFollowerSwatch = hasSelectedColors(followerColors);
  const swatchReserve = summarySwatchReserve(showLeaderSwatch, showFollowerSwatch);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) {
      return;
    }

    const checkFit = () => {
      const availableWidth = container.clientWidth;

      for (const mode of SUMMARY_NAME_MODES) {
        measure.textContent = formatCompetitorPairNames(leader, follower, mode);

        if (measure.scrollWidth + swatchReserve <= availableWidth) {
          setNameMode(mode);
          return;
        }
      }

      setNameMode(SUMMARY_NAME_MODES[SUMMARY_NAME_MODES.length - 1]);
    };

    checkFit();

    const observer = new ResizeObserver(checkFit);
    observer.observe(container);

    return () => observer.disconnect();
  }, [leader, follower, swatchReserve]);

  return (
    <Box
      component="span"
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {showLeaderSwatch ? (
        <CompetitorColorSwatchBox
          colors={leaderColors}
          size={COLOR_SWATCH_SIZE}
        />
      ) : null}

      <Typography
        component="span"
        variant="body1"
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ml: showLeaderSwatch ? `${SUMMARY_SWATCH_GAP}px` : 0,
          mr: showFollowerSwatch ? `${SUMMARY_SWATCH_GAP}px` : 0,
        }}
      >
        {formatCompetitorPairNames(leader, follower, nameMode)}
      </Typography>

      {showFollowerSwatch ? (
        <CompetitorColorSwatchBox
          colors={followerColors}
          size={COLOR_SWATCH_SIZE}
        />
      ) : null}

      <Box
        component="span"
        ref={measureRef}
        aria-hidden
        sx={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          fontSize: (theme) => theme.typography.body1.fontSize,
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: (theme) => theme.typography.body1.fontWeight,
        }}
      />
    </Box>
  );
}

type PaletteTarget = {
  bibNumber: number;
  role: CompetitorRole;
  member: LegionMember;
};

type CompetitorNameDetailProps = {
  member: LegionMember;
  bibNumber: number;
  role: CompetitorRole;
  colorRecord: CompetitorColorRecord;
  onPaletteClick: (target: PaletteTarget) => void;
};

function CompetitorNameDetail({
  member,
  bibNumber,
  role,
  colorRecord,
  onPaletteClick,
}: CompetitorNameDetailProps) {
  const fullName = formatFullFirstLast(member.first, member.last);

  const handleOpenPalette = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onPaletteClick({ bibNumber, role, member });
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ alignItems: 'center', minWidth: 0, width: '100%' }}
    >
      {hasSelectedColors(colorRecord) ? (
        <CompetitorColorSwatch
          colors={colorRecord}
          ariaLabel={`Edit top and bottom colors for ${fullName}`}
          onClick={handleOpenPalette}
        />
      ) : (
        <IconButton
          size="small"
          aria-label={`Open color palette for ${fullName}`}
          onClick={handleOpenPalette}
          sx={{ p: 0.5, width: 30, height: 30, flexShrink: 0 }}
        >
          <PaletteOutlinedIcon sx={{ fontSize: 18 }} color="action" />
        </IconButton>
      )}
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {fullName}
      </Typography>
    </Stack>
  );
}

export default function JudgingPage() {
  const navigate = useNavigate();
  const entries = useMemo(() => createJudgingEntries(), []);
  const [paletteTarget, setPaletteTarget] = useState<PaletteTarget | null>(null);
  const [competitorColors, setCompetitorColors] = useState<
    Record<string, CompetitorColorRecord>
  >({});
  const [scoreByBib, setScoreByBib] = useState<Record<number, EntryScoreState>>({});
  const [expandedBib, setExpandedBib] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<JudgingSortOption>('bib');
  const [frozenDisplayEntries, setFrozenDisplayEntries] = useState<JudgingEntry[] | null>(
    null,
  );

  const liveSortedEntries = useMemo(
    () => sortJudgingEntries(entries, sortOption, scoreByBib),
    [entries, sortOption, scoreByBib],
  );

  const displayEntries =
    expandedBib !== null && frozenDisplayEntries !== null
      ? frozenDisplayEntries
      : liveSortedEntries;

  const applySortAndFilter = (
    nextSortOption: JudgingSortOption = sortOption,
    nextScoreByBib: Record<number, EntryScoreState> = scoreByBib,
  ) => sortJudgingEntries(entries, nextSortOption, nextScoreByBib);

  const percentComplete = useMemo(
    () => calculatePercentComplete(entries, scoreByBib),
    [entries, scoreByBib],
  );

  const previousPercentCompleteRef = useRef(percentComplete);

  useEffect(() => {
    const previousPercent = previousPercentCompleteRef.current;
    previousPercentCompleteRef.current = percentComplete;

    if (percentComplete >= 100 && previousPercent < 100) {
      setSortOption('rawScore');
    }
  }, [percentComplete]);

  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value as JudgingDropdownValue;

    if (value === 'assignRandomScores') {
      const nextScoreByBib = { ...scoreByBib };

      for (const entry of entries) {
        nextScoreByBib[entry.number] = {
          digits: randomScoreDigitsBetween(30.0, 99.9),
          touched: true,
        };
      }

      setScoreByBib(nextScoreByBib);
      setSortOption('rawScore');
      setExpandedBib(null);
      setFrozenDisplayEntries(null);
      return;
    }

    setSortOption(value);
    setExpandedBib(null);
    setFrozenDisplayEntries(null);
  };

  const handleAccordionChange = (bibNumber: number, expanded: boolean) => {
    const nextSorted = applySortAndFilter();

    if (expanded) {
      setFrozenDisplayEntries(nextSorted);
      setExpandedBib(bibNumber);
      return;
    }

    setExpandedBib(null);
    setFrozenDisplayEntries(null);
  };

  const getEntryScore = (bibNumber: number): EntryScoreState =>
    scoreByBib[bibNumber] ?? emptyEntryScoreState();

  const handleSaveColors = (
    bibNumber: number,
    role: CompetitorRole,
    colors: CompetitorColorRecord,
  ) => {
    setCompetitorColors((current) => ({
      ...current,
      [competitorRecordKey(bibNumber, role)]: colors,
    }));
  };

  const handleScoreDigitChange = (
    bibNumber: number,
    index: number,
    value: number,
  ) => {
    setScoreByBib((current) => {
      const entry = current[bibNumber] ?? emptyEntryScoreState();
      const digits = [...entry.digits] as JudgingScoreDigits;
      digits[index] = value;

      return {
        ...current,
        [bibNumber]: { digits, touched: true },
      };
    });
  };

  const handleSubmit = () => {
    navigate('/staff');
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={1} sx={{ ...centeredContentStackSx, mb: 3 }}>
          <PercentCompleteBar percent={percentComplete} onSubmit={handleSubmit} />

          <Select
            size="small"
            value={sortOption}
            onChange={handleSortChange}
            aria-label="Sort judging entries"
            fullWidth
            sx={{
              '& .MuiSelect-select': {
                py: 0.75,
              },
            }}
          >
            {JUDGING_DROPDOWN_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack spacing={1} sx={{ ...centeredContentStackSx }}>
          {displayEntries.map((entry) => (
            <Accordion
              key={entry.number}
              expanded={expandedBib === entry.number}
              onChange={(_event, expanded) => {
                handleAccordionChange(entry.number, expanded);
              }}
              disableGutters
              elevation={0}
              variant="outlined"
              sx={{ width: '100%', overflow: 'hidden' }}
            >
              <AccordionSummary
                sx={{
                  px: 1,
                  minHeight: 40,
                  '& .MuiAccordionSummary-content': {
                    my: 0.5,
                    minWidth: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    minWidth: 0,
                    gap: 0.5,
                  }}
                >
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{
                      flex: `0 0 ${NUMBER_COLUMN_WIDTH}`,
                      width: NUMBER_COLUMN_WIDTH,
                      fontVariantNumeric: 'tabular-nums',
                      fontWeight: 600,
                      textAlign: 'left',
                    }}
                  >
                    {entry.number}
                  </Typography>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <CompetitorNamesText
                      leader={entry.leader}
                      follower={entry.follower}
                      leaderColors={
                        competitorColors[competitorRecordKey(entry.number, 'leader')] ??
                        emptyColorRecord()
                      }
                      followerColors={
                        competitorColors[competitorRecordKey(entry.number, 'follower')] ??
                        emptyColorRecord()
                      }
                    />
                  </Box>

                  <Typography
                    component="span"
                    variant="body1"
                    sx={{
                      flex: `0 0 ${SCORE_DISPLAY_WIDTH}`,
                      width: SCORE_DISPLAY_WIDTH,
                      flexShrink: 0,
                      fontVariantNumeric: 'tabular-nums',
                      textAlign: 'right',
                    }}
                  >
                    {getEntryScore(entry.number).touched
                      ? formatScoreDisplay(getEntryScore(entry.number).digits)
                      : ''}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{ px: 1, py: 1, overflow: 'hidden' }}
                onClick={(event) => event.stopPropagation()}
              >
                <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
                  <JudgingScoreInput
                    digits={getEntryScore(entry.number).digits}
                    onDigitChange={(index, value) =>
                      handleScoreDigitChange(entry.number, index, value)
                    }
                  />
                  <CompetitorNameDetail
                    member={entry.leader}
                    bibNumber={entry.number}
                    role="leader"
                    colorRecord={
                      competitorColors[competitorRecordKey(entry.number, 'leader')] ??
                      emptyColorRecord()
                    }
                    onPaletteClick={setPaletteTarget}
                  />
                  <CompetitorNameDetail
                    member={entry.follower}
                    bibNumber={entry.number}
                    role="follower"
                    colorRecord={
                      competitorColors[competitorRecordKey(entry.number, 'follower')] ??
                      emptyColorRecord()
                    }
                    onPaletteClick={setPaletteTarget}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>

        <Stack sx={{ alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/staff')}
            sx={{ maxWidth: CONTENT_MAX_WIDTH, width: '100%' }}
          >
            Back to Staff
          </Button>
        </Stack>
      </Paper>

      <CompetitorColorDialog
        competitor={paletteTarget?.member ?? null}
        open={paletteTarget !== null}
        initialColors={
          paletteTarget
            ? (competitorColors[
                competitorRecordKey(paletteTarget.bibNumber, paletteTarget.role)
              ] ?? emptyColorRecord())
            : emptyColorRecord()
        }
        onClose={() => setPaletteTarget(null)}
        onSave={(colors) => {
          if (paletteTarget) {
            handleSaveColors(paletteTarget.bibNumber, paletteTarget.role, colors);
          }
        }}
      />
    </Container>
  );
}
