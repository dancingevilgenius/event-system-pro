import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
  Typography,
  useMediaQuery,
  type SelectChangeEvent,
  type Theme,
} from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBackButton from '../components/PageBackButton';
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
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';

const NUMBER_COLUMN_WIDTH = '2.75rem';
const LARGE_SCREEN_NUMBER_COLUMN_WIDTH = '3.25rem';
const TARGET_WARNING_SLOT_WIDTH = 40;
const PAIR_DIVIDER_WIDTH = 16;
const ENTRY_ROW_HEIGHT = 40;
const DANCER_NAME_FONT_SIZE = { xs: '0.8125rem', md: '1rem' } as const;
const LARGE_SCREEN_ROW_FONT_SIZE = '1.5rem';
const IPAD_97_MIN_CSS_PX = 768;

type RowFontSize = typeof DANCER_NAME_FONT_SIZE | typeof LARGE_SCREEN_ROW_FONT_SIZE;

function detectIpad97OrLargerScreen(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return Math.min(window.screen.width, window.screen.height) >= IPAD_97_MIN_CSS_PX;
}

function useIpad97OrLargerScreen(): boolean {
  const [matches, setMatches] = useState(detectIpad97OrLargerScreen);

  useEffect(() => {
    const update = () => setMatches(detectIpad97OrLargerScreen());

    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return matches;
}

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
const DEMO_PRELIMS_MORE_JSON: PrelimsMoreJson = {
  targetYesCount: 10,
  targetMaybeCount: 2,
};

type PrelimsEntry = {
  number: number;
  leader: LegionMember;
  follower: LegionMember | null;
};

const PRELIMS_MARKS: { value: PrelimsMark; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
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

function maybeMarkColor(theme: Theme): string {
  return theme.palette.mode === 'dark' ? '#ffe14a' : '#c4a000';
}

function filterSelectedColor(filter: MarkFilter): string | ((theme: Theme) => string) {
  switch (filter) {
    case 'yes':
      return 'success.main';
    case 'maybe':
      return maybeMarkColor;
    case 'no':
      return 'error.main';
    default:
      return 'text.primary';
  }
}

function emptyFilterMessage(filter: MarkFilter): string {
  switch (filter) {
    case 'yes':
      return 'No dancers marked Yes.';
    case 'maybe':
      return 'No dancers marked Maybe.';
    case 'no':
      return 'No dancers marked No.';
    case 'unmarked':
      return 'All dancers are marked.';
    default:
      return 'No dancers in this list.';
  }
}

function markColor(mark: PrelimsMark | undefined): string | ((theme: Theme) => string) {
  switch (mark) {
    case 'yes':
      return 'success.main';
    case 'maybe':
      return maybeMarkColor;
    case 'no':
      return 'error.main';
    default:
      return 'text.secondary';
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
};

function PrelimsMarkSelect({
  bibNumber,
  mark,
  onChange,
  fontSize,
  largeScreen,
}: PrelimsMarkSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;

    if (value === 'yes' || value === 'maybe' || value === 'no') {
      onChange(value);
      return;
    }

    onChange(null);
  };

  const selectWidth = largeScreen ? '8.75rem' : { xs: '6.5rem', md: '7.25rem' };

  return (
    <Select
      size="small"
      displayEmpty
      value={mark ?? ''}
      onChange={handleChange}
      aria-label={`Mark for bib ${bibNumber}`}
      sx={{
        width: selectWidth,
        flex: largeScreen ? '0 0 8.75rem' : { xs: '0 0 6.5rem', md: '0 0 7.25rem' },
        flexShrink: 0,
        height: 32,
        color: markColor(mark),
        fontSize,
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
        },
        '& .MuiSelect-icon': {
          right: { xs: 0, md: 4 },
          fontSize: largeScreen ? '1.5rem' : { xs: '1rem', md: '1.5rem' },
        },
      }}
    >
      <MenuItem value="">
        <Box component="span" sx={{ color: 'text.secondary' }}>
          Choose
        </Box>
      </MenuItem>
      {PRELIMS_MARKS.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{ color: markColor(option.value), fontWeight: 700 }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

type OverTargetMark = 'yes' | 'maybe';

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
}: TargetProgressRowProps) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', width: '100%' }}>
      <Box
        sx={{
          width: TARGET_WARNING_SLOT_WIDTH,
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {overTarget ? (
          <IconButton size="small" aria-label={warningLabel} color="warning" onClick={onWarningClick}>
            <WarningAmberIcon />
          </IconButton>
        ) : onTarget ? (
          <CheckCircleIcon color="success" role="img" aria-label={matchedLabel} />
        ) : null}
      </Box>
      <Box
        component="button"
        type="button"
        onClick={onBarClick}
        aria-label={barActionLabel}
        sx={{
          flex: 1,
          minWidth: 0,
          p: 0,
          m: 0,
          border: 0,
          bgcolor: 'transparent',
          cursor: 'pointer',
          font: 'inherit',
          color: 'inherit',
          textAlign: 'left',
        }}
      >
        <PercentCompleteBar percent={percent} label={label} />
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
};

function PrelimsEntryRow({ entry, mark, onMarkChange, fontSize, largeScreen }: PrelimsEntryRowProps) {
  const dancerLabel = entry.follower
    ? `${formatFullFirstLast(entry.leader.first, entry.leader.last)} and ${formatFullFirstLast(entry.follower.first, entry.follower.last)}`
    : formatFullFirstLast(entry.leader.first, entry.leader.last);

  return (
    <Box
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

      <PrelimsMarkSelect
        bibNumber={entry.number}
        mark={mark}
        onChange={(nextMark) => onMarkChange(entry.number, nextMark)}
        fontSize={fontSize}
        largeScreen={largeScreen}
      />
    </Box>
  );
}

export default function PrelimsPage() {
  const navigate = useNavigate();
  const { showSuccess, showInfo } = useMessages();
  const mockEntries = useMemo(() => createMockContestEntries(), []);
  const isIpad97OrLargerScreen = useIpad97OrLargerScreen();
  const rowFontSize: RowFontSize = isIpad97OrLargerScreen
    ? LARGE_SCREEN_ROW_FONT_SIZE
    : DANCER_NAME_FONT_SIZE;
  const [markByBib, setMarkByBib] = useState<Record<number, PrelimsMark>>({});
  const [markFilter, setMarkFilter] = useState<MarkFilter>('all');
  const [overTargetDialog, setOverTargetDialog] = useState<OverTargetMark | null>(null);
  const [dialogMark, setDialogMark] = useState<OverTargetMark>('yes');

  const entries = useMemo<PrelimsEntry[]>(
    () =>
      mockEntries.map((entry) => ({
        number: entry.number,
        leader: entry.leader,
        follower: entry.follower,
      })),
    [mockEntries],
  );

  const prelimsMoreJson = DEMO_PRELIMS_MORE_JSON;
  const yesTargetCount = prelimsMoreJson.targetYesCount;
  const maybeTargetCount = prelimsMoreJson.targetMaybeCount;

  useEffect(() => {
    showInfo(
      `Set ${yesTargetCount} couples with "Yes" value to continue to finals`,
      { id: 'prelims-yes-target-hint' },
    );
    showInfo(`Set ${maybeTargetCount} couples with "Maybe" value`, {
      id: 'prelims-maybe-target-hint',
    });
    showInfo('Set all remaining couples to "No" value, after your Yes/Maybe targets are met', {
      id: 'prelims-no-remaining-hint',
    });
  }, [maybeTargetCount, showInfo, yesTargetCount]);

  const judgeYesCount = entries.filter((entry) => markByBib[entry.number] === 'yes').length;
  const judgeMaybeCount = entries.filter((entry) => markByBib[entry.number] === 'maybe').length;
  const unmarkedCount = entries.filter((entry) => markByBib[entry.number] === undefined).length;
  const judgeYesPercent = yesTargetCount === 0 ? 0 : (judgeYesCount / yesTargetCount) * 100;
  const judgeMaybePercent =
    maybeTargetCount === 0 ? 0 : (judgeMaybeCount / maybeTargetCount) * 100;
  const yesOverTarget = judgeYesCount > yesTargetCount;
  const maybeOverTarget = judgeMaybeCount > maybeTargetCount;
  const yesOnTarget = judgeYesCount === yesTargetCount;
  const maybeOnTarget = judgeMaybeCount === maybeTargetCount;
  const submitDisabled =
    judgeYesCount !== yesTargetCount ||
    judgeMaybeCount !== maybeTargetCount ||
    unmarkedCount > 0;
  const overTargetCopy =
    dialogMark === 'maybe'
      ? {
          title: 'Too many Maybe marks',
          body: `Reduce the number Maybe marks down to ${maybeTargetCount}.`,
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

  const handleSubmit = () => {
    if (submitDisabled) {
      return;
    }

    showSuccess(
      `Prelims submitted with ${judgeYesCount} yes and ${judgeMaybeCount} maybe.`,
    );
    navigate('/staff');
  };

  const handleMarkChange = (bibNumber: number, mark: PrelimsMark | null) => {
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
        <PageBackButton to="/staff" label="Back to Staff" />

        <Stack spacing={1} sx={{ ...contentSx, flexShrink: 0 }}>
          <Typography variant="h6" component="h1" sx={{ textAlign: 'center' }}>
            All-American Prelims
          </Typography>

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
            <Button variant="contained" disabled={submitDisabled} onClick={handleSubmit}>
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
            {MARK_FILTERS.map((option) => (
              <ToggleButton
                key={option.value}
                value={option.value}
                aria-label={option.label}
                sx={{
                  flex: 1,
                  px: 0.5,
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', md: '0.8125rem' },
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  '&.Mui-selected': {
                    color: filterSelectedColor(option.value),
                  },
                  '&.Mui-selected:hover': {
                    color: filterSelectedColor(option.value),
                  },
                }}
              >
                {option.label}
              </ToggleButton>
            ))}
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
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TargetProgressRow
                percent={judgeMaybePercent}
                label={`Maybe ${judgeMaybeCount} / ${maybeTargetCount}`}
                overTarget={maybeOverTarget}
                onTarget={maybeOnTarget}
                warningLabel="Maybe count is above the target"
                matchedLabel="Maybe count matches the target"
                onWarningClick={() => openOverTargetDialog('maybe')}
                onBarClick={() => setMarkFilter('maybe')}
                barActionLabel="Filter by Maybe"
              />
            </Box>
          </Stack>
        </Stack>

        <Box
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
              visibleEntries.map((entry) => (
                <PrelimsEntryRow
                  key={entry.number}
                  entry={entry}
                  mark={markByBib[entry.number]}
                  onMarkChange={handleMarkChange}
                  fontSize={rowFontSize}
                  largeScreen={isIpad97OrLargerScreen}
                />
              ))
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
