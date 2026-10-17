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
  useMediaQuery,
  type SelectChangeEvent,
} from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchJudgingContestPairs,
  fetchJudgingContestRoster,
  fetchJudgingSubmissionProgress,
  saveJudgingFinalsSubmission,
  type JudgingFinalsSubmissionStatus,
} from '../api/postgrest';
import CompetitorColorDialog from '../components/CompetitorColorDialog';
import DuplicateScoreDialog from '../components/DuplicateScoreDialog';
import CompetitorColorSwatch from '../components/CompetitorColorSwatch';
import CompetitorColorSwatchBox, {
  COLOR_SWATCH_SIZE,
} from '../components/CompetitorColorSwatchBox';
import JudgingScoreInput, {
  type JudgingScoreInputMode,
} from '../components/JudgingScoreInput';
import PageBackButton from '../components/PageBackButton';
import PaletteOutlinedIcon from '../components/PaletteOutlinedIcon';
import PercentCompleteBar from '../components/PercentCompleteBar';
import {
  CONTENT_MAX_WIDTH,
  LANDSCAPE_MEDIA_QUERY,
  TABLET_LANDSCAPE_CONTENT_WIDTH,
  mobileColumnSx,
} from '../constants/layout';
import {
  CONTEST_TITLE_FONT_SIZE,
  LARGE_SCREEN_CONTEST_TITLE_FONT_SIZE,
  useIpad97OrLargerScreen,
  type ContestTitleFontSize,
} from '../hooks/useContestTitleFontSize';
import { useLayoutTier } from '../hooks/useLayoutTier';
import type { JudgingHomeContest } from '../lib/judgingHome';
import {
  buildJudgingFinalsEntries,
  canLeaveJudgingFinals,
  judgingFinalsTitle,
  readJudgingFinalsContest,
  type JudgingFinalsContestRef,
  type JudgingFinalsEntry,
} from '../lib/judgingFinalsEntries';
import {
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
  scoreToDigits,
  type EntryScoreState,
  type JudgingScoreDigits,
} from '../types/judgingScore';

const JUDGING_PAGE_SIZE = 10;
const NUMBER_COLUMN_WIDTH = '2.75rem';
const LARGE_SCREEN_NUMBER_COLUMN_WIDTH = '3.25rem';
const SCORE_DISPLAY_WIDTH = '5ch';
const SUMMARY_SWATCH_GAP = 2;
const SUMMARY_SWATCH_SLOT_COUNT = 2;
const SUMMARY_SWATCH_COLUMN_WIDTH =
  SUMMARY_SWATCH_SLOT_COUNT * COLOR_SWATCH_SIZE + SUMMARY_SWATCH_GAP;
/** Extra space between names and the reserved color slots. */
const SUMMARY_NAME_SWATCH_PADDING_PX = 16;
const SUMMARY_SWATCH_COLUMN_OUTER_WIDTH =
  SUMMARY_SWATCH_COLUMN_WIDTH + SUMMARY_NAME_SWATCH_PADDING_PX * 2;

type JudgingListLayout = 'scrollable' | 'pagination';

type JudgingSortOption =
  | 'bib'
  | 'rawScore'
  | 'leaderLastName'
  | 'followerLastName'
  | 'unscoredOnly';

type JudgingDropdownValue =
  | JudgingSortOption
  | 'assignRandomScores'
  | JudgingListLayout
  | JudgingScoreInputMode;

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

function summaryNameColumnSx(textAlign: 'left' | 'right', fontSize: ContestTitleFontSize) {
  return {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
    flex: 1,
    textAlign,
    fontSize,
  } as const;
}

function reservedSwatchSlotSx() {
  return {
    width: COLOR_SWATCH_SIZE,
    height: COLOR_SWATCH_SIZE,
    flexShrink: 0,
  } as const;
}

type JudgingEntry = JudgingFinalsEntry;

function rosterContest(contest: JudgingFinalsContestRef): JudgingHomeContest {
  return {
    id: `finals-${contest.eventId ?? 0}-${contest.contestId ?? 0}-${contest.contestItemId}`,
    eventId: contest.eventId ?? 0,
    eventName: contest.eventName,
    skillLevelLabel: contest.skillLevel,
    divisionLabel: contest.contestType,
    contestId: contest.contestId,
    contestItemId: contest.eventId !== null ? contest.contestItemId : '',
    skillLevelKey: '',
    divisionKey: '',
    leaderCount: 0,
    followerCount: 0,
    locked: false,
    canToggleLock: false,
  };
}

async function loadContestEntries(contest: JudgingFinalsContestRef): Promise<JudgingEntry[]> {
  const canLoadRoster = contest.contestId !== null || (contest.eventId !== null && contest.contestItemId !== '');
  let pairs = contest.pairs;
  if (pairs === null) {
    if (!canLoadRoster) {
      return [];
    }
    pairs = await fetchJudgingContestPairs({
      eventId: contest.eventId ?? 0,
      contestId: contest.contestId,
      contestItemId: contest.eventId !== null ? contest.contestItemId : '',
    });
  }
  if (pairs.length === 0 || !canLoadRoster) {
    return buildJudgingFinalsEntries(pairs, []);
  }
  const people = await fetchJudgingContestRoster(rosterContest(contest));
  return buildJudgingFinalsEntries(pairs, people);
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

function rosterBibText(bib: number | null): string {
  return bib === null ? '—' : String(bib);
}

/** About twice a normal word space, so the bib and name read as separate items. */
const ROSTER_BIB_NAME_GAP_PX = 8;

type CompetitorNamesTextProps = {
  leader: LegionMember;
  follower: LegionMember;
  followerBib: number | null;
  leaderColors: CompetitorColorRecord;
  followerColors: CompetitorColorRecord;
  fontSize: ContestTitleFontSize;
};

function CompetitorNamesText({
  leader,
  follower,
  followerBib,
  leaderColors,
  followerColors,
  fontSize,
}: CompetitorNamesTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [nameMode, setNameMode] = useState<SummaryNameMode>(SUMMARY_NAME_MODES[0]);

  const showLeaderSwatch = hasSelectedColors(leaderColors);
  const showFollowerSwatch = hasSelectedColors(followerColors);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) {
      return;
    }

    const checkFit = () => {
      const nameColumnWidth = Math.max(
        0,
        (container.clientWidth - SUMMARY_SWATCH_COLUMN_OUTER_WIDTH) / 2,
      );

      for (const mode of SUMMARY_NAME_MODES) {
        measure.textContent = formatSummaryLeaderName(leader, mode);
        const leaderFits = measure.scrollWidth <= nameColumnWidth;
        measure.textContent = rosterBibText(followerBib);
        const followerBibWidth = measure.scrollWidth;
        measure.textContent = formatSummaryFollowerName(follower, mode);
        const followerFits = followerBibWidth + ROSTER_BIB_NAME_GAP_PX + measure.scrollWidth <= nameColumnWidth;

        if (leaderFits && followerFits) {
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
  }, [followerBib, leader, follower, fontSize]);

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
        sx={summaryNameColumnSx('right', fontSize)}
      >
        {formatSummaryLeaderName(leader, nameMode)}
      </Typography>

      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: `${SUMMARY_SWATCH_GAP}px`,
          flex: `0 0 ${SUMMARY_SWATCH_COLUMN_OUTER_WIDTH}px`,
          width: SUMMARY_SWATCH_COLUMN_OUTER_WIDTH,
          px: `${SUMMARY_NAME_SWATCH_PADDING_PX}px`,
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {showLeaderSwatch ? (
          <CompetitorColorSwatchBox
            colors={leaderColors}
            size={COLOR_SWATCH_SIZE}
          />
        ) : (
          <Box component="span" aria-hidden sx={reservedSwatchSlotSx()} />
        )}
        {showFollowerSwatch ? (
          <CompetitorColorSwatchBox
            colors={followerColors}
            size={COLOR_SWATCH_SIZE}
          />
        ) : (
          <Box component="span" aria-hidden sx={reservedSwatchSlotSx()} />
        )}
      </Box>

      <Typography
        component="span"
        variant="body1"
        sx={summaryNameColumnSx('left', fontSize)}
      >
        <Box
          component="span"
          sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, mr: `${ROSTER_BIB_NAME_GAP_PX}px` }}
        >
          {rosterBibText(followerBib)}
        </Box>
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
          fontSize,
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
  rosterBib: number | null;
  role: CompetitorRole;
  colorRecord: CompetitorColorRecord;
  onPaletteClick: (target: PaletteTarget) => void;
};

function CompetitorNameDetail({
  member,
  bibNumber,
  rosterBib,
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
        <Box
          component="span"
          sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, mr: `${ROSTER_BIB_NAME_GAP_PX}px` }}
        >
          {rosterBibText(rosterBib)}
        </Box>
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
  scoreInputMode: JudgingScoreInputMode;
  onScoreDigitChange: (bibNumber: number, index: number, value: number) => void;
  onScoreChange: (bibNumber: number, value: number) => void;
  onPaletteClick: (target: PaletteTarget) => void;
  titleFontSize: ContestTitleFontSize;
  largeScreen: boolean;
};

function JudgingEntryAccordion({
  entry,
  expanded,
  onAccordionChange,
  competitorColors,
  getEntryScore,
  scoreInputMode,
  onScoreDigitChange,
  onScoreChange,
  onPaletteClick,
  titleFontSize,
  largeScreen,
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
            width: '100%',
            mr: 0,
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
              flex: `0 0 ${largeScreen ? LARGE_SCREEN_NUMBER_COLUMN_WIDTH : NUMBER_COLUMN_WIDTH}`,
              width: largeScreen ? LARGE_SCREEN_NUMBER_COLUMN_WIDTH : NUMBER_COLUMN_WIDTH,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
              textAlign: 'left',
              fontSize: titleFontSize,
              lineHeight: 1.2,
            }}
          >
            {entry.number}
          </Typography>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CompetitorNamesText
              leader={entry.leader}
              follower={entry.follower}
              followerBib={entry.followerBib}
              leaderColors={leaderColors}
              followerColors={followerColors}
              fontSize={titleFontSize}
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
              fontSize: titleFontSize,
              lineHeight: 1.2,
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
            mode={scoreInputMode}
            onDigitChange={(index, value) => onScoreDigitChange(entry.number, index, value)}
            onScoreChange={(value) => onScoreChange(entry.number, value)}
          />
          <CompetitorNameDetail
            member={entry.leader}
            bibNumber={entry.number}
            rosterBib={entry.leaderBib}
            role="leader"
            colorRecord={leaderColors}
            onPaletteClick={onPaletteClick}
          />
          <CompetitorNameDetail
            member={entry.follower}
            bibNumber={entry.number}
            rosterBib={entry.followerBib}
            role="follower"
            colorRecord={followerColors}
            onPaletteClick={onPaletteClick}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

function submittedScoreKey(entries: JudgingEntry[], scoreByBib: Record<number, EntryScoreState>): string {
  return entries
    .map((entry) => {
      const score = scoreByBib[entry.number];
      return `${entry.number}:${score?.touched ? score.digits.join(',') : ''}`;
    })
    .join('|');
}

export default function JudgingPage() {
  const location = useLocation();
  const contest = useMemo(
    () => readJudgingFinalsContest(location.state, new URLSearchParams(location.search)),
    [location.search, location.state],
  );
  const { showSuccess, showInfo, showProblem } = useMessages();
  const [entries, setEntries] = useState<JudgingEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [entriesError, setEntriesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setEntries([]);
    setEntriesLoading(true);
    setEntriesError(null);
    void loadContestEntries(contest)
      .then((rows) => {
        if (!cancelled) {
          setEntries(rows);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setEntries([]);
          setEntriesError(loadError instanceof Error ? loadError.message : 'Unable to load contest couples.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setEntriesLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [contest]);
  const largeScreen = useIpad97OrLargerScreen();
  const titleFontSize = largeScreen
    ? LARGE_SCREEN_CONTEST_TITLE_FONT_SIZE
    : CONTEST_TITLE_FONT_SIZE;

  useEffect(() => {
    showInfo('Click on any color message boxes to hide them', {
      id: 'judging-dismiss-hint',
    });
    showInfo('Click on any row to use slider to set a raw score', {
      id: 'judging-row-slider-hint',
    });
    showInfo('Use the dropdown options to sort the contestants.', {
      id: 'judging-sort-dropdown-hint',
    });
  }, [showInfo]);
  const [paletteTarget, setPaletteTarget] = useState<PaletteTarget | null>(null);
  const [competitorColors, setCompetitorColors] = useState<
    Record<string, CompetitorColorRecord>
  >({});
  const [scoreByBib, setScoreByBib] = useState<Record<number, EntryScoreState>>({});
  const [expandedBib, setExpandedBib] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<JudgingSortOption>('bib');
  const [listLayout, setListLayout] = useState<JudgingListLayout>('scrollable');
  const [scoreInputMode, setScoreInputMode] = useState<JudgingScoreInputMode>('slider');
  const [currentPage, setCurrentPage] = useState(0);
  const [frozenDisplayEntries, setFrozenDisplayEntries] = useState<JudgingEntry[] | null>(
    null,
  );
  const [duplicateScoreDialog, setDuplicateScoreDialog] =
    useState<DuplicateScoreDialogState | null>(null);
  const [scoresSubmitted, setScoresSubmitted] = useState(false);
  const [judgeProgress, setJudgeProgress] = useState<JudgingFinalsSubmissionStatus | null>(null);
  const [refreshingProgress, setRefreshingProgress] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const submittedScoreKeyRef = useRef<string | null>(null);
  const submittingRef = useRef(false);
  const progressRequestRef = useRef(0);

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
    if (!scoresSubmitted) {
      return;
    }
    if (submittedScoreKey(entries, scoreByBib) !== submittedScoreKeyRef.current) {
      setScoresSubmitted(false);
    }
  }, [entries, scoreByBib, scoresSubmitted]);

  const backEnabled = canLeaveJudgingFinals({
    loading: entriesLoading,
    entryCount: entries.length,
    percentComplete,
    submitted: scoresSubmitted,
  });

  useEffect(() => {
    const previousPercent = previousPercentCompleteRef.current;
    previousPercentCompleteRef.current = percentComplete;

    if (percentComplete >= 100 && previousPercent < 100) {
      setSortOption('rawScore');
    }
  }, [percentComplete]);

  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value as JudgingDropdownValue;

    if (value === 'slider' || value === 'dropdowns') {
      setScoreInputMode(value);
      return;
    }

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

  const handleScoreChange = (bibNumber: number, value: number) => {
    setScoreByBib((current) => ({
      ...current,
      [bibNumber]: { digits: scoreToDigits(value), touched: true },
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

  const loadJudgeProgress = useCallback((clearFirst: boolean) => {
    const request = progressRequestRef.current + 1;
    progressRequestRef.current = request;
    if (clearFirst) {
      setJudgeProgress(null);
    }
    setRefreshingProgress(true);
    setProgressError(null);
    void fetchJudgingSubmissionProgress(contest)
      .then((status) => {
        if (progressRequestRef.current === request) {
          setJudgeProgress(status);
        }
      })
      .catch((loadError: unknown) => {
        if (progressRequestRef.current !== request) {
          return;
        }
        setProgressError(loadError instanceof Error ? loadError.message : 'Unable to refresh judge submissions.');
      })
      .finally(() => {
        if (progressRequestRef.current === request) {
          setRefreshingProgress(false);
        }
      });
  }, [contest]);

  useEffect(() => {
    loadJudgeProgress(true);
    return () => {
      progressRequestRef.current += 1;
    };
  }, [loadJudgeProgress]);

  const handleSubmit = () => {
    if (submittingRef.current) {
      return;
    }
    submittingRef.current = true;
    const submission = buildJudgeSubmission(
      scoreByBib,
      entries.map((entry) => entry.number),
      judgeProgress?.judgeId || 'local-judge',
    );

    saveJudgeSubmission(submission);
    void saveJudgingFinalsSubmission(contest, submission)
      .then((status) => {
        submittedScoreKeyRef.current = submittedScoreKey(entries, scoreByBib);
        setScoresSubmitted(true);
        setJudgeProgress(status);
        showSuccess(
          `Scores submitted with ${submission.placements.length} placements derived (1st = highest score).`,
        );
      })
      .catch((error: unknown) => {
        showProblem(error instanceof Error ? error.message : 'Unable to save judge scores.');
      })
      .finally(() => {
        submittingRef.current = false;
      });
  };

  const duplicateDialogCurrentEntry = duplicateScoreDialog
    ? entryByBib.get(duplicateScoreDialog.currentBib)
    : undefined;
  const duplicateDialogOtherEntry = duplicateScoreDialog
    ? entryByBib.get(duplicateScoreDialog.otherBib)
    : undefined;

  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const isLandscape = useMediaQuery(LANDSCAPE_MEDIA_QUERY);
  const isTabletLandscape = !showXsLayout && isLandscape;
  // Phone: 360px centered column. Tablet portrait: full Paper width.
  // Tablet landscape: enclosing Paper is 70% of the viewport.
  const judgingContentSx = showXsLayout
    ? mobileColumnSx
    : { width: '100%', maxWidth: '100%', boxSizing: 'border-box' as const };
  const judgingPaperWidthSx = showXsLayout
    ? { width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }
    : isTabletLandscape
      ? {
          width: TABLET_LANDSCAPE_CONTENT_WIDTH,
          maxWidth: TABLET_LANDSCAPE_CONTENT_WIDTH,
          mx: 'auto',
        }
      : { width: '100%', maxWidth: '100%', mx: 0 };

  return (
    <Container
      maxWidth={showXsLayout ? containerMaxWidth : false}
      sx={{
        py: { xs: 2, md: 3, lg: 4 },
        px: { xs: 2, md: 3, lg: 4 },
        height: { xs: 'auto', md: '100vh' },
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        ...(showXsLayout
          ? {}
          : {
              // Override theme lg/xl 1000px cap so Judging uses iPad / desktop width.
              maxWidth: '100%',
            }),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3, lg: 4 },
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          ...judgingPaperWidthSx,
          boxSizing: 'border-box',
        }}
      >
        <PageBackButton to="/judgingHome" label="Back to Judging" disabled={!backEnabled} />

        <Stack spacing={1} sx={{ ...judgingContentSx, flexShrink: 0 }}>
          <Typography variant="h6" component="h1" sx={{ textAlign: 'center' }}>
            {judgingFinalsTitle(contest)}
          </Typography>

          <PercentCompleteBar percent={percentComplete} onSubmit={handleSubmit} />
          {judgeProgress?.showBar ? (
            <Stack spacing={0.5}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <PercentCompleteBar
                    percent={judgeProgress.percent}
                    label={judgeProgress.label}
                    ariaLabel={`${judgeProgress.submitted} of ${judgeProgress.assigned} judges submitted`}
                  />
                </Box>
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  disabled={refreshingProgress}
                  onClick={() => loadJudgeProgress(false)}
                  aria-label="Refresh submitted judge count"
                  sx={{ textTransform: 'none', flexShrink: 0 }}
                >
                  {refreshingProgress ? 'Refreshing…' : 'Refresh'}
                </Button>
              </Stack>
              {progressError ? (
                <Typography variant="body2" color="error">
                  {progressError}
                </Typography>
              ) : null}
            </Stack>
          ) : null}

          <Select
            size="small"
            value={sortOption}
            onChange={handleSortChange}
            aria-label="Judging options"
            fullWidth
            sx={{
              width: '100%',
              maxWidth: '100%',
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
            <Divider />
            <MenuItem
              value="slider"
              sx={{ fontWeight: scoreInputMode === 'slider' ? 700 : 400 }}
            >
              Raw Scores as Slider
            </MenuItem>
            <MenuItem
              value="dropdowns"
              sx={{ fontWeight: scoreInputMode === 'dropdowns' ? 700 : 400 }}
            >
              Raw Scores as Dropdowns
            </MenuItem>
          </Select>

          {listLayout === 'pagination' && displayEntries.length > 0 && (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1}
              sx={{
                ...judgingContentSx,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={handlePreviousPage}
                disabled={safeCurrentPage === 0}
                sx={{ minWidth: 96, maxWidth: showXsLayout ? CONTENT_MAX_WIDTH : 'none' }}
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
                sx={{ minWidth: 96, maxWidth: showXsLayout ? CONTENT_MAX_WIDTH : 'none' }}
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
            width: '100%',
          }}
        >
          <Stack spacing={1} sx={judgingContentSx}>
            {entriesLoading ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Loading couples…
              </Typography>
            ) : entriesError ? (
              <Typography variant="body2" color="error" sx={{ py: 2, textAlign: 'center' }}>
                {entriesError}
              </Typography>
            ) : entries.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No saved couples for this contest.
              </Typography>
            ) : null}
            {visibleEntries.map((entry) => (
              <JudgingEntryAccordion
                key={entry.number}
                entry={entry}
                expanded={expandedBib === entry.number}
                onAccordionChange={handleAccordionChange}
                competitorColors={competitorColors}
                getEntryScore={getEntryScore}
                scoreInputMode={scoreInputMode}
                onScoreDigitChange={handleScoreDigitChange}
                onScoreChange={handleScoreChange}
                onPaletteClick={setPaletteTarget}
                titleFontSize={titleFontSize}
                largeScreen={largeScreen}
              />
            ))}
          </Stack>
        </Box>
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
