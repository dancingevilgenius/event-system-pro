import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneIcon from '@mui/icons-material/Done';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  type SelectChangeEvent,
} from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JudgeHeaderInitials, { judgeHeaderRowSx } from '../components/JudgeHeaderInitials';
import MobileBackIconButton from '../components/MobileBackIconButton';
import PercentCompleteBar from '../components/PercentCompleteBar';
import {
  CONTENT_MAX_WIDTH,
  LANDSCAPE_MEDIA_QUERY,
  TABLET_LANDSCAPE_CONTENT_WIDTH,
  mobileColumnSx,
} from '../constants/layout';
import { createMockContestEntries } from '../data/mockContestEntries';
import {
  formatFullFirstLast,
  formatInitialLast,
  type LegionMember,
} from '../data/legionNames';
import {
  CONTEST_TITLE_FONT_SIZE,
  LARGE_SCREEN_CONTEST_TITLE_FONT_SIZE,
  useIpad97OrLargerScreen,
  type ContestTitleFontSize,
} from '../hooks/useContestTitleFontSize';
import { trainingTargetSx, usePageTraining } from '../hooks/usePageTraining';
import { isCoachEnabled, markRowElementId } from '../lib/pageTraining';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { formatBackTooltip } from '../utils/backTooltip';

const FILTER_YES_ELEMENT_ID = 'prelims-filter-yes';
const FILTER_ALL_ELEMENT_ID = 'prelims-filter-all';
const FILTER_MAYBE_ELEMENT_ID = 'prelims-filter-maybe';

const NUMBER_COLUMN_WIDTH = '2.75rem';
const LARGE_SCREEN_NUMBER_COLUMN_WIDTH = '3.25rem';
const TARGET_WARNING_SLOT_WIDTH = 40;
const PAIR_DIVIDER_WIDTH = 16;
const ENTRY_ROW_HEIGHT = 40;

type RowFontSize = ContestTitleFontSize;

const NAME_MODES = [
  { leaderFullFirst: true, followerFullFirst: true },
  { leaderFullFirst: false, followerFullFirst: true },
  { leaderFullFirst: true, followerFullFirst: false },
  { leaderFullFirst: false, followerFullFirst: false },
] as const;

type NameMode = (typeof NAME_MODES)[number];

type PrelimsMark = 'yes' | 'maybe' | 'no';

type MarkFilter = 'all' | PrelimsMark | 'unmarked';

type PrelimsMoreJson = {
  targetYesCount: number;
  targetMaybeCount: number;
};

/** Demo stand-in for contest more_json callback targets. */
const PRELIMS_COUPLE_COUNT = 12;
const DEMO_PRELIMS_MORE_JSON: PrelimsMoreJson = {
  targetYesCount: 5,
  targetMaybeCount: 2,
};

type PrelimsEntry = {
  number: number;
  leader: LegionMember;
  follower: LegionMember | null;
};

const PRELIMS_MARKS: { value: PrelimsMark; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Alternate' },
  { value: 'no', label: 'No' },
];

const MARK_FILTERS: { value: MarkFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...PRELIMS_MARKS,
  { value: 'unmarked', label: 'Unmarked' },
];

function formatDancerName(dancer: LegionMember, useFullFirst: boolean): string {
  return useFullFirst
    ? formatFullFirstLast(dancer.first, dancer.last)
    : formatInitialLast(dancer.first, dancer.last);
}

function nameColumnSx(textAlign: 'left' | 'right' | 'center', fontSize: RowFontSize) {
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

function markButtonFill(mark: PrelimsMark | undefined): string | undefined {
  switch (mark) {
    case 'yes':
      return '#e5f6ea';
    case 'maybe':
      return '#fff6d4';
    case 'no':
      return '#fde8e8';
    default:
      return undefined;
  }
}

function filterButtonFill(filter: MarkFilter): string | undefined {
  if (filter === 'yes' || filter === 'maybe' || filter === 'no') {
    return markButtonFill(filter);
  }

  return undefined;
}

function emptyFilterMessage(filter: MarkFilter): string {
  switch (filter) {
    case 'yes':
      return 'No dancers marked Yes.';
    case 'maybe':
      return 'No dancers marked Alternate.';
    case 'no':
      return 'No dancers marked No.';
    case 'unmarked':
      return 'All dancers are marked.';
    default:
      return 'No dancers in this list.';
  }
}

type DancerNamesProps = {
  leader: LegionMember;
  follower: LegionMember | null;
  fontSize: RowFontSize;
};

function DancerNames({ leader, follower, fontSize }: DancerNamesProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [nameMode, setNameMode] = useState<NameMode>(NAME_MODES[0]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) {
      return;
    }

    const checkFit = () => {
      if (!follower) {
        const width = container.clientWidth;
        measure.textContent = formatDancerName(leader, true);
        setNameMode(
          measure.scrollWidth <= width ? NAME_MODES[0] : NAME_MODES[NAME_MODES.length - 1],
        );
        return;
      }

      const nameColumnWidth = Math.max(0, (container.clientWidth - PAIR_DIVIDER_WIDTH) / 2);

      for (const mode of NAME_MODES) {
        measure.textContent = formatDancerName(leader, mode.leaderFullFirst);
        const leaderFits = measure.scrollWidth <= nameColumnWidth;
        measure.textContent = formatDancerName(follower, mode.followerFullFirst);
        const followerFits = measure.scrollWidth <= nameColumnWidth;

        if (leaderFits && followerFits) {
          setNameMode(mode);
          return;
        }
      }

      setNameMode(NAME_MODES[NAME_MODES.length - 1]);
    };

    checkFit();

    const observer = new ResizeObserver(checkFit);
    observer.observe(container);

    return () => observer.disconnect();
  }, [leader, follower, fontSize]);

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
      {follower ? (
        <>
          <Typography component="span" variant="body1" sx={nameColumnSx('right', fontSize)}>
            {formatDancerName(leader, nameMode.leaderFullFirst)}
          </Typography>
          <Typography
            component="span"
            variant="body1"
            color="text.secondary"
            aria-hidden
            sx={{
              flex: `0 0 ${PAIR_DIVIDER_WIDTH}px`,
              width: PAIR_DIVIDER_WIDTH,
              textAlign: 'center',
              flexShrink: 0,
              fontSize,
              lineHeight: 1.2,
            }}
          >
            ·
          </Typography>
          <Typography component="span" variant="body1" sx={nameColumnSx('left', fontSize)}>
            {formatDancerName(follower, nameMode.followerFullFirst)}
          </Typography>
        </>
      ) : (
        <Typography component="span" variant="body1" sx={nameColumnSx('center', fontSize)}>
          {formatDancerName(leader, nameMode.leaderFullFirst)}
        </Typography>
      )}

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

type PrelimsMarkSelectProps = {
  bibNumber: number;
  mark: PrelimsMark | undefined;
  onChange: (mark: PrelimsMark | null) => void;
  fontSize: RowFontSize;
  largeScreen: boolean;
  disabled?: boolean;
};

function PrelimsMarkSelect({
  bibNumber,
  mark,
  onChange,
  fontSize,
  largeScreen,
  disabled = false,
}: PrelimsMarkSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    if (value === 'yes' || value === 'maybe' || value === 'no') {
      onChange(value);
      return;
    }

    onChange(null);
  };

  const selectWidth = largeScreen ? '11.5rem' : { xs: '8.25rem', md: '9.5rem' };
  const markFill = markButtonFill(mark);

  return (
    <Select
      size="small"
      displayEmpty
      disabled={disabled}
      value={mark ?? ''}
      onChange={handleChange}
      aria-label={`Mark for bib ${bibNumber}`}
      MenuProps={{
        sx: { zIndex: (theme) => theme.zIndex.snackbar + 3 },
      }}
      sx={{
        width: selectWidth,
        flex: largeScreen ? '0 0 11.5rem' : { xs: '0 0 8.25rem', md: '0 0 9.5rem' },
        flexShrink: 0,
        height: 32,
        color: mark ? '#000' : 'text.secondary',
        bgcolor: markFill,
        fontSize,
        '&:hover': {
          bgcolor: markFill,
        },
        '&.Mui-focused': {
          bgcolor: markFill,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderWidth: 1,
        },
        '& .MuiSelect-select': {
          py: 0,
          pl: { xs: 0.75, md: 1.5 },
          pr: { xs: '1.25rem !important', md: '2rem !important' },
          display: 'flex',
          alignItems: 'center',
          height: 32,
          minHeight: '32px !important',
          boxSizing: 'border-box',
          fontWeight: mark ? 700 : 400,
          lineHeight: 1.2,
          color: 'inherit',
        },
        '& .MuiSelect-icon': {
          right: { xs: 0, md: 4 },
          fontSize: largeScreen ? '1.5rem' : { xs: '1rem', md: '1.5rem' },
          color: mark ? '#000' : undefined,
        },
      }}
    >
      <MenuItem value="">
        <Box component="span" sx={{ color: 'text.secondary' }}>
          Choose
        </Box>
      </MenuItem>
      {PRELIMS_MARKS.map((option) => (
        <MenuItem key={option.value} value={option.value} sx={{ color: 'text.primary', fontWeight: 700 }}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

type OverTargetMark = 'yes' | 'maybe' | 'no';

type TargetProgressRowProps = {
  percent: number;
  label: string;
  overTarget: boolean;
  onTarget: boolean;
  warningLabel: string;
  matchedLabel: string;
  onWarningClick: () => void;
  onBarClick: () => void;
  barActionLabel: string;
  controlsDisabled?: boolean;
};

function TargetProgressRow({
  percent,
  label,
  overTarget,
  onTarget,
  warningLabel,
  matchedLabel,
  onWarningClick,
  onBarClick,
  barActionLabel,
  controlsDisabled = false,
}: TargetProgressRowProps) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', width: '100%' }}>
      {overTarget || onTarget ? (
        <Box
          sx={{
            width: { xs: 28, md: TARGET_WARNING_SLOT_WIDTH },
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {overTarget ? (
            <IconButton
              size="small"
              aria-label={warningLabel}
              color="warning"
              disabled={controlsDisabled}
              onClick={onWarningClick}
            >
              <WarningAmberIcon />
            </IconButton>
          ) : (
            <CheckCircleIcon color="success" role="img" aria-label={matchedLabel} />
          )}
        </Box>
      ) : null}
      <Box
        component="button"
        type="button"
        onClick={onBarClick}
        disabled={controlsDisabled}
        aria-label={barActionLabel}
        sx={{
          flex: 1,
          minWidth: 0,
          p: 0,
          m: 0,
          border: 0,
          bgcolor: 'transparent',
          cursor: controlsDisabled ? 'default' : 'pointer',
          font: 'inherit',
          color: 'inherit',
          textAlign: 'left',
        }}
      >
        <PercentCompleteBar percent={percent} label={label} dense />
      </Box>
    </Stack>
  );
}

type PrelimsEntryRowProps = {
  entry: PrelimsEntry;
  mark: PrelimsMark | undefined;
  onMarkChange: (bibNumber: number, mark: PrelimsMark | null) => void;
  fontSize: RowFontSize;
  largeScreen: boolean;
  markElementId?: string;
  markDisabled?: boolean;
  markHighlighted?: boolean;
};

function PrelimsEntryRow({
  entry,
  mark,
  onMarkChange,
  fontSize,
  largeScreen,
  markElementId,
  markDisabled = false,
  markHighlighted = false,
}: PrelimsEntryRowProps) {
  const dancerLabel = entry.follower
    ? `${formatFullFirstLast(entry.leader.first, entry.leader.last)} and ${formatFullFirstLast(entry.follower.first, entry.follower.last)}`
    : formatFullFirstLast(entry.leader.first, entry.leader.last);

  return (
    <Box
      data-prelims-entry=""
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
        gap: 0.5,
        px: { xs: 0.5, md: 1 },
        py: 0,
        height: ENTRY_ROW_HEIGHT,
        minHeight: ENTRY_ROW_HEIGHT,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        boxSizing: 'border-box',
        ...(markHighlighted
          ? { position: 'relative', zIndex: (theme) => theme.zIndex.snackbar + 2 }
          : {}),
      }}
      aria-label={`Bib ${entry.number}, ${dancerLabel}`}
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
          fontSize,
          lineHeight: 1.2,
        }}
      >
        {entry.number}
      </Typography>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <DancerNames leader={entry.leader} follower={entry.follower} fontSize={fontSize} />
      </Box>

      <Box
        aria-hidden
        sx={{
          width: largeScreen ? 28 : 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {mark ? <MarkChoiceIcon mark={mark} largeScreen={largeScreen} /> : null}
      </Box>

      <Box
        id={markElementId}
        data-training-target={markHighlighted ? '' : undefined}
        sx={{
          flexShrink: 0,
          ...(markHighlighted ? trainingTargetSx : {}),
        }}
      >
        <PrelimsMarkSelect
          bibNumber={entry.number}
          mark={mark}
          disabled={markDisabled}
          onChange={(nextMark) => onMarkChange(entry.number, nextMark)}
          fontSize={fontSize}
          largeScreen={largeScreen}
        />
      </Box>
    </Box>
  );
}

const PRELIMS_YES_HINT_ID = 'prelims-yes-target-hint';
const PRELIMS_ALTERNATE_HINT_ID = 'prelims-maybe-target-hint';
const PRELIMS_NO_HINT_ID = 'prelims-no-remaining-hint';

function markChoiceIcon(mark: PrelimsMark) {
  switch (mark) {
    case 'yes':
      return DoneIcon;
    case 'maybe':
      return SpellcheckIcon;
    case 'no':
      return NotInterestedIcon;
  }
}

function MarkChoiceIcon({ mark, largeScreen }: { mark: PrelimsMark; largeScreen: boolean }) {
  const Icon = markChoiceIcon(mark);
  return <Icon sx={{ fontSize: largeScreen ? 26 : 20 }} />;
}

function filterElementId(filter: MarkFilter): string | undefined {
  if (filter === 'yes') {
    return FILTER_YES_ELEMENT_ID;
  }

  if (filter === 'all') {
    return FILTER_ALL_ELEMENT_ID;
  }

  if (filter === 'maybe') {
    return FILTER_MAYBE_ELEMENT_ID;
  }

  return undefined;
}

export default function PrelimsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const coaching = isCoachEnabled(location.search);
  const { showSuccess, showInfo, dismissMessage } = useMessages();
  const { restartNonce, trainingDisabled, isTrainingTarget, reportSelect } = usePageTraining();
  const entryListRef = useRef<HTMLDivElement>(null);
  // Mock roster. When this page loads contest_entry for a contestId, call
  // useContestRosterRealtime and silently replace entries only. Keep markByBib.
  const mockEntries = useMemo(() => createMockContestEntries(PRELIMS_COUPLE_COUNT), []);
  const isIpad97OrLargerScreen = useIpad97OrLargerScreen();
  const rowFontSize: RowFontSize = isIpad97OrLargerScreen
    ? LARGE_SCREEN_CONTEST_TITLE_FONT_SIZE
    : CONTEST_TITLE_FONT_SIZE;
  const [markByBib, setMarkByBib] = useState<Record<number, PrelimsMark>>({});
  const [markFilter, setMarkFilter] = useState<MarkFilter>('all');
  const [overTargetDialog, setOverTargetDialog] = useState<OverTargetMark | null>(null);
  const [dialogMark, setDialogMark] = useState<OverTargetMark>('yes');
  const [appliedRestartNonce, setAppliedRestartNonce] = useState(restartNonce);
  if (appliedRestartNonce !== restartNonce) {
    setAppliedRestartNonce(restartNonce);
    setMarkByBib({});
    setMarkFilter('all');
    setOverTargetDialog(null);
  }

  const entries = useMemo<PrelimsEntry[]>(
    () =>
      mockEntries.map((entry) => ({
        number: entry.number,
        leader: entry.leader,
        follower: entry.follower,
      })),
    [mockEntries],
  );
  const rowNumberByBib = useMemo(() => {
    const rowNumbers = new Map<number, number>();
    entries.forEach((entry, index) => {
      rowNumbers.set(entry.number, index + 1);
    });
    return rowNumbers;
  }, [entries]);
  const coachingLocksControls = trainingDisabled();
  const laterRowIsTarget = isTrainingTarget(markRowElementId(3));

  const prelimsMoreJson = DEMO_PRELIMS_MORE_JSON;
  const yesTargetCount = prelimsMoreJson.targetYesCount;
  const maybeTargetCount = prelimsMoreJson.targetMaybeCount;

  useEffect(() => {
    if (laterRowIsTarget && markFilter !== 'all') {
      setMarkFilter('all');
    }
  }, [laterRowIsTarget, markFilter]);

  useLayoutEffect(() => {
    entryListRef.current?.scrollTo({ top: 0 });
  }, [restartNonce]);

  useEffect(() => {
    if (coaching) {
      dismissMessage(PRELIMS_YES_HINT_ID);
      dismissMessage(PRELIMS_ALTERNATE_HINT_ID);
      dismissMessage(PRELIMS_NO_HINT_ID);
      return;
    }

    showInfo(
      `Set ${yesTargetCount} couples with "Yes" value to continue to finals`,
      { id: PRELIMS_YES_HINT_ID },
    );
    showInfo(`Set ${maybeTargetCount} couples with "Alternate" value`, {
      id: PRELIMS_ALTERNATE_HINT_ID,
    });
    showInfo('Set all remaining couples to "No" value, after your Yes/Alternate targets are met', {
      id: PRELIMS_NO_HINT_ID,
    });
  }, [coaching, dismissMessage, maybeTargetCount, showInfo, yesTargetCount]);

  const judgeYesCount = entries.filter((entry) => markByBib[entry.number] === 'yes').length;
  const judgeMaybeCount = entries.filter((entry) => markByBib[entry.number] === 'maybe').length;
  const judgeNoCount = entries.filter((entry) => markByBib[entry.number] === 'no').length;
  const unmarkedCount = entries.filter((entry) => markByBib[entry.number] === undefined).length;
  const noTargetCount = Math.max(0, entries.length - yesTargetCount - maybeTargetCount);
  const judgeYesPercent = yesTargetCount === 0 ? 0 : (judgeYesCount / yesTargetCount) * 100;
  const judgeMaybePercent =
    maybeTargetCount === 0 ? 0 : (judgeMaybeCount / maybeTargetCount) * 100;
  const judgeNoPercent = noTargetCount === 0 ? 0 : (judgeNoCount / noTargetCount) * 100;
  const yesOverTarget = judgeYesCount > yesTargetCount;
  const maybeOverTarget = judgeMaybeCount > maybeTargetCount;
  const noOverTarget = judgeNoCount > noTargetCount;
  const yesOnTarget = judgeYesCount === yesTargetCount;
  const maybeOnTarget = judgeMaybeCount === maybeTargetCount;
  const noOnTarget = judgeNoCount === noTargetCount;
  const submitDisabled =
    judgeYesCount !== yesTargetCount ||
    judgeMaybeCount !== maybeTargetCount ||
    unmarkedCount > 0;
  const overTargetCopy =
    dialogMark === 'maybe'
      ? {
          title: 'Too many Alternate marks',
          body: `Reduce the number Alternate marks down to ${maybeTargetCount}.`,
        }
      : dialogMark === 'no'
        ? {
            title: 'Too many No marks',
            body: `Reduce the number No marks down to ${noTargetCount}.`,
          }
        : {
            title: 'Too many Yes marks',
            body: `Reduce the number Yes marks down to ${yesTargetCount}.`,
          };

  const openOverTargetDialog = (mark: OverTargetMark) => {
    setDialogMark(mark);
    setOverTargetDialog(mark);
  };

  const visibleEntries =
    markFilter === 'all'
      ? entries
      : markFilter === 'unmarked'
        ? entries.filter((entry) => markByBib[entry.number] === undefined)
        : entries.filter((entry) => markByBib[entry.number] === markFilter);

  const handleMarkFilterChange = (_event: MouseEvent<HTMLElement>, next: MarkFilter | null) => {
    setMarkFilter(next ?? 'all');
  };

  const selectMarkFilter = (next: MarkFilter) => {
    setMarkFilter(next);
  };

  const handleSubmit = () => {
    if (submitDisabled) {
      return;
    }

    showSuccess(
      `Prelims submitted with ${judgeYesCount} yes and ${judgeMaybeCount} alternate.`,
    );
    navigate('/judge-demos');
  };

  const handleMarkChange = (bibNumber: number, mark: PrelimsMark | null) => {
    const rowNumber = rowNumberByBib.get(bibNumber);
    if (rowNumber && reportSelect(markRowElementId(rowNumber), mark ?? '') === 'revert') {
      return;
    }

    setMarkByBib((current) => {
      const next = { ...current };

      if (mark === null) {
        delete next[bibNumber];
      } else {
        next[bibNumber] = mark;
      }

      return next;
    });
  };

  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const backTooltip = formatBackTooltip('Back to Judge Demos');
  const isLandscape = useMediaQuery(LANDSCAPE_MEDIA_QUERY);
  const isTabletLandscape = !showXsLayout && isLandscape;
  const contentSx = showXsLayout
    ? mobileColumnSx
    : { width: '100%', maxWidth: '100%', boxSizing: 'border-box' as const };
  const paperWidthSx = showXsLayout
    ? { width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }
    : isTabletLandscape
      ? {
          width: TABLET_LANDSCAPE_CONTENT_WIDTH,
          maxWidth: TABLET_LANDSCAPE_CONTENT_WIDTH,
          mx: 'auto',
        }
      : { width: '100%', maxWidth: '100%', mx: 0 };

  return (
    <>
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
          ...paperWidthSx,
          boxSizing: 'border-box',
        }}
      >
        <Stack spacing={1} sx={{ ...contentSx, flexShrink: 0 }}>
          <Box sx={judgeHeaderRowSx}>
            <Tooltip title={backTooltip}>
              <span>
                <MobileBackIconButton label={backTooltip} onClick={() => navigate('/judge-demos')} />
              </span>
            </Tooltip>
            <Typography
              variant="h6"
              component="h1"
              sx={{ textAlign: 'center', minWidth: 0, overflowWrap: 'break-word', lineHeight: 1.2 }}
            >
              All-American Prelims
            </Typography>
            <JudgeHeaderInitials />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              width: '100%',
            }}
          >
            {!submitDisabled ? (
              <CheckCircleIcon
                color="success"
                role="img"
                aria-label="Submit is ready"
              />
            ) : (
              <Box sx={{ width: 24 }} aria-hidden />
            )}
            <Button
              variant="contained"
              disabled={submitDisabled || coachingLocksControls}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Box sx={{ width: 24 }} aria-hidden />
          </Box>

          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={markFilter}
            onChange={handleMarkFilterChange}
            aria-label="Filter marks"
          >
            {MARK_FILTERS.map((option) => {
              const elementId = filterElementId(option.value);
              const selectedFill = filterButtonFill(option.value);

              return (
                <ToggleButton
                  key={option.value}
                  id={elementId}
                  value={option.value}
                  disabled={trainingDisabled(elementId)}
                  aria-label={option.label}
                  onClick={() => selectMarkFilter(option.value)}
                  sx={{
                    flex: 1,
                    px: 0.5,
                    fontWeight: 700,
                    fontSize: { xs: '0.75rem', md: '0.8125rem' },
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    ...(elementId && isTrainingTarget(elementId) ? trainingTargetSx : {}),
                    '&.Mui-selected': {
                      color: '#000',
                      bgcolor: selectedFill,
                    },
                    '&.Mui-selected:hover': {
                      color: '#000',
                      bgcolor: selectedFill,
                    },
                    '&.Mui-selected.Mui-disabled': {
                      color: '#000',
                      bgcolor: selectedFill,
                    },
                  }}
                >
                  {option.label}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TargetProgressRow
                percent={judgeYesPercent}
                label={`Yes ${judgeYesCount} / ${yesTargetCount}`}
                overTarget={yesOverTarget}
                onTarget={yesOnTarget}
                warningLabel="Yes count is above the target"
                matchedLabel="Yes count matches the target"
                onWarningClick={() => openOverTargetDialog('yes')}
                onBarClick={() => setMarkFilter('yes')}
                barActionLabel="Filter by Yes"
                controlsDisabled={coachingLocksControls}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TargetProgressRow
                percent={judgeMaybePercent}
                label={`Alternate ${judgeMaybeCount} / ${maybeTargetCount}`}
                overTarget={maybeOverTarget}
                onTarget={maybeOnTarget}
                warningLabel="Alternate count is above the target"
                matchedLabel="Alternate count matches the target"
                onWarningClick={() => openOverTargetDialog('maybe')}
                onBarClick={() => setMarkFilter('maybe')}
                barActionLabel="Filter by Alternate"
                controlsDisabled={coachingLocksControls}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TargetProgressRow
                percent={judgeNoPercent}
                label={`No ${judgeNoCount} / ${noTargetCount}`}
                overTarget={noOverTarget}
                onTarget={noOnTarget}
                warningLabel="No count is above the target"
                matchedLabel="No count matches the target"
                onWarningClick={() => openOverTargetDialog('no')}
                onBarClick={() => setMarkFilter('no')}
                barActionLabel="Filter by No"
                controlsDisabled={coachingLocksControls}
              />
            </Box>
          </Stack>
        </Stack>

        <Box
          ref={entryListRef}
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowY: 'auto',
            width: '100%',
          }}
        >
          <Stack spacing={1} sx={contentSx}>
            {visibleEntries.length === 0 && markFilter !== 'all' ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 2 }}
              >
                {emptyFilterMessage(markFilter)}
              </Typography>
            ) : (
              visibleEntries.map((entry) => {
                const rowNumber = rowNumberByBib.get(entry.number) ?? 0;
                const markElementId = markRowElementId(rowNumber);

                return (
                  <PrelimsEntryRow
                    key={entry.number}
                    entry={entry}
                    mark={markByBib[entry.number]}
                    onMarkChange={handleMarkChange}
                    fontSize={rowFontSize}
                    largeScreen={isIpad97OrLargerScreen}
                    markElementId={markElementId}
                    markDisabled={trainingDisabled(markElementId)}
                    markHighlighted={isTrainingTarget(markElementId)}
                  />
                );
              })
            )}
          </Stack>
        </Box>
      </Paper>
    </Container>

    <Dialog
      open={overTargetDialog !== null}
      onClose={() => setOverTargetDialog(null)}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{overTargetCopy.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{overTargetCopy.body}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setOverTargetDialog(null)}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
