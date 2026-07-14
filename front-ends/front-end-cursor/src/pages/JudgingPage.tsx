import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
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
import DuplicateScoreDialog from '../components/DuplicateScoreDialog';
import CompetitorColorSwatch from '../components/CompetitorColorSwatch';
import CompetitorColorSwatchBox, {
  COLOR_SWATCH_SIZE,
} from '../components/CompetitorColorSwatchBox';
import JudgingScoreInput from '../components/JudgingScoreInput';
import PaletteOutlinedIcon from '../components/PaletteOutlinedIcon';
import PercentCompleteBar from '../components/PercentCompleteBar';
import { centeredContentStackSx, CONTENT_MAX_WIDTH } from '../constants/layout';
import {
  createMockContestEntries,
  type MockContestEntry,
} from '../data/mockContestEntries';
import {
  formatCompetitorPairNames,
  formatFullFirstLast,
  formatInitialLast,
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
  buildJudgeSubmission,
  saveJudgeSubmission,
} from '../services/tabulation';
import { useMessages } from '../hooks/useMessages';
import {
  digitsToScore,
  emptyEntryScoreState,
  findFirstDuplicateBib,
  formatScoreDisplay,
  randomScoreDigitsBetween,
  resolveDuplicatePreferCurrentHigher,
  resolveDuplicatePreferOtherHigher,
  type EntryScoreState,
  type JudgingScoreDigits,
} from '../types/judgingScore';

const JUDGING_PAGE_SIZE = 10;
const NUMBER_COLUMN_WIDTH = '2.75rem';
const SCORE_DISPLAY_WIDTH = '5ch';
const SUMMARY_SWATCH_GAP = 2;
const SUMMARY_NAME_SEPARATOR = ' · ';

type JudgingListLayout = 'scrollable' | 'pagination';

type JudgingSortOption =
  | 'bib'
  | 'rawScore'
  | 'leaderLastName'
  | 'followerLastName'
  | 'unscoredOnly';

type JudgingDropdownValue = JudgingSortOption | 'assignRandomScores' | JudgingListLayout;

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

function formatSummaryLeaderName(
  leader: LegionMember,
  mode: SummaryNameMode,
): string {
  return mode.leaderFullFirst
    ? formatFullFirstLast(leader.first, leader.last)
    : formatInitialLast(leader.first, leader.last);
}

function formatSummaryFollowerName(
  follower: LegionMember,
  mode: SummaryNameMode,
): string {
  return mode.followerFullFirst
    ? formatFullFirstLast(follower.first, follower.last)
    : formatInitialLast(follower.first, follower.last);
}

function summarySeparatorReserve(
  showLeaderSwatch: boolean,
  showFollowerSwatch: boolean,
  dotWidth: number,
): number {
  const iconCount = Number(showLeaderSwatch) + Number(showFollowerSwatch);

  if (iconCount === 0) {
    return dotWidth;
  }

  return (
    iconCount * COLOR_SWATCH_SIZE +
    (iconCount + 1) * SUMMARY_SWATCH_GAP
  );
}

function summaryNameTypographySx() {
  return {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
  } as const;
}

type JudgingEntry = MockContestEntry;

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
  const showAnySwatch = showLeaderSwatch || showFollowerSwatch;

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) {
      return;
    }

    measure.textContent = SUMMARY_NAME_SEPARATOR;
    const dotWidth = measure.scrollWidth;

    const checkFit = () => {
      const availableWidth = container.clientWidth;
      const separatorReserve = summarySeparatorReserve(
        showLeaderSwatch,
        showFollowerSwatch,
        dotWidth,
      );

      for (const mode of SUMMARY_NAME_MODES) {
        measure.textContent = formatCompetitorPairNames(leader, follower, mode);

        if (measure.scrollWidth - dotWidth + separatorReserve <= availableWidth) {
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
  }, [leader, follower, showLeaderSwatch, showFollowerSwatch]);

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
      <Typography
        component="span"
        variant="body1"
        sx={summaryNameTypographySx()}
      >
        {formatSummaryLeaderName(leader, nameMode)}
      </Typography>

      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${SUMMARY_SWATCH_GAP}px`,
          flexShrink: 0,
          mx: `${SUMMARY_SWATCH_GAP}px`,
        }}
      >
        {showAnySwatch ? (
          <>
            {showLeaderSwatch ? (
              <CompetitorColorSwatchBox
                colors={leaderColors}
                size={COLOR_SWATCH_SIZE}
              />
            ) : null}
            {showFollowerSwatch ? (
              <CompetitorColorSwatchBox
                colors={followerColors}
                size={COLOR_SWATCH_SIZE}
              />
            ) : null}
          </>
        ) : (
          <Typography component="span" variant="body1">
            {SUMMARY_NAME_SEPARATOR}
          </Typography>
        )}
      </Box>

      <Typography
        component="span"
        variant="body1"
        sx={summaryNameTypographySx()}
      >
        {formatSummaryFollowerName(follower, nameMode)}
      </Typography>

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

type DuplicateScoreDialogState = {
  currentBib: number;
  otherBib: number;
};

type JudgingEntryAccordionProps = {
  entry: JudgingEntry;
  expanded: boolean;
  onAccordionChange: (bibNumber: number, expanded: boolean) => void;
  competitorColors: Record<string, CompetitorColorRecord>;
  getEntryScore: (bibNumber: number) => EntryScoreState;
  onScoreDigitChange: (bibNumber: number, index: number, value: number) => void;
  onPaletteClick: (target: PaletteTarget) => void;
};

function JudgingEntryAccordion({
  entry,
  expanded,
  onAccordionChange,
  competitorColors,
  getEntryScore,
  onScoreDigitChange,
  onPaletteClick,
}: JudgingEntryAccordionProps) {
  const entryScore = getEntryScore(entry.number);
  const leaderColors =
    competitorColors[competitorRecordKey(entry.number, 'leader')] ?? emptyColorRecord();
  const followerColors =
    competitorColors[competitorRecordKey(entry.number, 'follower')] ?? emptyColorRecord();

  return (
    <Accordion
      id={`judging-entry-${entry.number}`}
      expanded={expanded}
      onChange={(_event, nextExpanded) => {
        onAccordionChange(entry.number, nextExpanded);
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
              leaderColors={leaderColors}
              followerColors={followerColors}
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
            {entryScore.touched ? formatScoreDisplay(entryScore.digits) : ''}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{ px: 1, py: 1, overflow: 'hidden' }}
        onClick={(event) => event.stopPropagation()}
      >
        <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
          <JudgingScoreInput
            digits={entryScore.digits}
            onDigitChange={(index, value) => onScoreDigitChange(entry.number, index, value)}
          />
          <CompetitorNameDetail
            member={entry.leader}
            bibNumber={entry.number}
            role="leader"
            colorRecord={leaderColors}
            onPaletteClick={onPaletteClick}
          />
          <CompetitorNameDetail
            member={entry.follower}
            bibNumber={entry.number}
            role="follower"
            colorRecord={followerColors}
            onPaletteClick={onPaletteClick}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

export default function JudgingPage() {
  const navigate = useNavigate();
  const { showSuccess } = useMessages();
  const entries = useMemo(() => createMockContestEntries(), []);
  const [paletteTarget, setPaletteTarget] = useState<PaletteTarget | null>(null);
  const [competitorColors, setCompetitorColors] = useState<
    Record<string, CompetitorColorRecord>
  >({});
  const [scoreByBib, setScoreByBib] = useState<Record<number, EntryScoreState>>({});
  const [expandedBib, setExpandedBib] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<JudgingSortOption>('bib');
  const [listLayout, setListLayout] = useState<JudgingListLayout>('scrollable');
  const [currentPage, setCurrentPage] = useState(0);
  const [frozenDisplayEntries, setFrozenDisplayEntries] = useState<JudgingEntry[] | null>(
    null,
  );
  const [duplicateScoreDialog, setDuplicateScoreDialog] =
    useState<DuplicateScoreDialogState | null>(null);

  const entryByBib = useMemo(
    () => new Map(entries.map((entry) => [entry.number, entry])),
    [entries],
  );

  const liveSortedEntries = useMemo(
    () => sortJudgingEntries(entries, sortOption, scoreByBib),
    [entries, sortOption, scoreByBib],
  );

  const displayEntries =
    expandedBib !== null && frozenDisplayEntries !== null
      ? frozenDisplayEntries
      : liveSortedEntries;

  const totalPages = Math.max(1, Math.ceil(displayEntries.length / JUDGING_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  const visibleEntries =
    listLayout === 'pagination'
      ? displayEntries.slice(
          safeCurrentPage * JUDGING_PAGE_SIZE,
          safeCurrentPage * JUDGING_PAGE_SIZE + JUDGING_PAGE_SIZE,
        )
      : displayEntries;

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    if (listLayout !== 'scrollable' || expandedBib === null) {
      return;
    }

    document
      .getElementById(`judging-entry-${expandedBib}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [expandedBib, listLayout, safeCurrentPage]);

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

    if (value === 'scrollable' || value === 'pagination') {
      if (expandedBib !== null) {
        maybeShowDuplicateScoreDialog(expandedBib, scoreByBib);
      }

      setListLayout(value);
      setExpandedBib(null);
      setFrozenDisplayEntries(null);
      setCurrentPage(0);
      return;
    }

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
      setCurrentPage(0);
      return;
    }

    if (expandedBib !== null) {
      maybeShowDuplicateScoreDialog(expandedBib, scoreByBib);
    }

    setSortOption(value);
    setExpandedBib(null);
    setFrozenDisplayEntries(null);
    setCurrentPage(0);
  };

  const handlePreviousPage = () => {
    if (expandedBib !== null) {
      maybeShowDuplicateScoreDialog(expandedBib, scoreByBib);
      setExpandedBib(null);
      setFrozenDisplayEntries(null);
    }

    setCurrentPage((page) => Math.max(0, page - 1));
  };

  const handleNextPage = () => {
    if (expandedBib !== null) {
      maybeShowDuplicateScoreDialog(expandedBib, scoreByBib);
      setExpandedBib(null);
      setFrozenDisplayEntries(null);
    }

    setCurrentPage((page) => Math.min(totalPages - 1, page + 1));
  };

  const maybeShowDuplicateScoreDialog = (
    bibNumber: number,
    scores: Record<number, EntryScoreState>,
  ) => {
    const otherBib = findFirstDuplicateBib(bibNumber, scores);

    if (otherBib === null) {
      return;
    }

    setDuplicateScoreDialog({ currentBib: bibNumber, otherBib });
  };

  const handleAccordionChange = (bibNumber: number, expanded: boolean) => {
    const nextSorted = applySortAndFilter();

    if (expanded) {
      if (expandedBib !== null && expandedBib !== bibNumber) {
        maybeShowDuplicateScoreDialog(expandedBib, scoreByBib);
      }

      if (listLayout === 'pagination') {
        const entryIndex = nextSorted.findIndex((entry) => entry.number === bibNumber);

        if (entryIndex >= 0) {
          setCurrentPage(Math.floor(entryIndex / JUDGING_PAGE_SIZE));
        }
      }

      setFrozenDisplayEntries(nextSorted);
      setExpandedBib(bibNumber);
      return;
    }

    maybeShowDuplicateScoreDialog(bibNumber, scoreByBib);
    setExpandedBib(null);
    setFrozenDisplayEntries(null);
  };

  const applyDuplicateResolution = (
    resolver: (
      scores: Record<number, EntryScoreState>,
      currentBib: number,
      otherBib: number,
    ) => Record<number, EntryScoreState>,
  ) => {
    if (!duplicateScoreDialog) {
      return;
    }

    const { currentBib, otherBib } = duplicateScoreDialog;
    const nextScoreByBib = resolver(scoreByBib, currentBib, otherBib);

    setScoreByBib(nextScoreByBib);

    if (sortOption === 'rawScore') {
      const resorted = sortJudgingEntries(entries, sortOption, nextScoreByBib);

      if (expandedBib !== null) {
        setFrozenDisplayEntries(resorted);
      } else {
        setFrozenDisplayEntries(null);
      }
    }

    setDuplicateScoreDialog(null);
  };

  const handleDuplicateChooseCurrentHigher = () => {
    applyDuplicateResolution(resolveDuplicatePreferCurrentHigher);
  };

  const handleDuplicateChooseOtherHigher = () => {
    applyDuplicateResolution(resolveDuplicatePreferOtherHigher);
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
    const submission = buildJudgeSubmission(
      scoreByBib,
      entries.map((entry) => entry.number),
    );

    saveJudgeSubmission(submission);
    showSuccess(
      `Scores submitted with ${submission.placements.length} placements derived (1st = highest score).`,
    );
    navigate('/staff');
  };

  const duplicateDialogCurrentEntry = duplicateScoreDialog
    ? entryByBib.get(duplicateScoreDialog.currentBib)
    : undefined;
  const duplicateDialogOtherEntry = duplicateScoreDialog
    ? entryByBib.get(duplicateScoreDialog.otherBib)
    : undefined;

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 2,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack spacing={1} sx={{ ...centeredContentStackSx, flexShrink: 0 }}>
          <PercentCompleteBar percent={percentComplete} onSubmit={handleSubmit} />

          <Select
            size="small"
            value={sortOption}
            onChange={handleSortChange}
            aria-label="Judging options"
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
            <Divider />
            <MenuItem value="scrollable" selected={listLayout === 'scrollable'}>
              Scrollable List
            </MenuItem>
            <MenuItem value="pagination" selected={listLayout === 'pagination'}>
              Pagination
            </MenuItem>
          </Select>

          {listLayout === 'pagination' && displayEntries.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                ...centeredContentStackSx,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handlePreviousPage}
                disabled={safeCurrentPage === 0}
                sx={{ minWidth: 96 }}
              >
                Previous
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Page {safeCurrentPage + 1} of {totalPages}
                <Box component="span" sx={{ display: 'block', fontSize: '0.75rem' }}>
                  {displayEntries.length} couples
                </Box>
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleNextPage}
                disabled={safeCurrentPage >= totalPages - 1}
                sx={{ minWidth: 96 }}
              >
                Next
              </Button>
            </Stack>
          )}
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowY: listLayout === 'scrollable' ? 'auto' : 'visible',
          }}
        >
          <Stack spacing={1} sx={{ ...centeredContentStackSx }}>
            {visibleEntries.map((entry) => (
              <JudgingEntryAccordion
                key={entry.number}
                entry={entry}
                expanded={expandedBib === entry.number}
                onAccordionChange={handleAccordionChange}
                competitorColors={competitorColors}
                getEntryScore={getEntryScore}
                onScoreDigitChange={handleScoreDigitChange}
                onPaletteClick={setPaletteTarget}
              />
            ))}
          </Stack>
        </Box>

        <Stack sx={{ alignItems: 'center', flexShrink: 0 }}>
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

      <DuplicateScoreDialog
        open={duplicateScoreDialog !== null}
        currentLeaderFirst={duplicateDialogCurrentEntry?.leader.first ?? ''}
        currentFollowerFirst={duplicateDialogCurrentEntry?.follower.first ?? ''}
        otherLeaderFirst={duplicateDialogOtherEntry?.leader.first ?? ''}
        otherFollowerFirst={duplicateDialogOtherEntry?.follower.first ?? ''}
        onClose={() => setDuplicateScoreDialog(null)}
        onChooseCurrentHigher={handleDuplicateChooseCurrentHigher}
        onChooseOtherHigher={handleDuplicateChooseOtherHigher}
      />
    </Container>
  );
}
