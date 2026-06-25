import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CompetitorColorDialog from '../components/CompetitorColorDialog';
import CompetitorColorSwatch from '../components/CompetitorColorSwatch';
import CompetitorColorSwatchBox, {
  COLOR_SWATCH_SIZE,
} from '../components/CompetitorColorSwatchBox';
import PaletteOutlinedIcon from '../components/PaletteOutlinedIcon';
import { centeredContentStackSx, CONTENT_MAX_WIDTH } from '../constants/layout';
import {
  formatCompetitorPair,
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

const ENTRY_COUNT = 20;
const NUMBER_COLUMN_WIDTH = '3.5rem';
const SUMMARY_SWATCH_GAP = 4;

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
  const [useFullFirst, setUseFullFirst] = useState(true);

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
      measure.textContent = formatCompetitorPair(leader, follower, true);
      const fitsFull =
        measure.scrollWidth + swatchReserve <= container.clientWidth;

      measure.textContent = formatCompetitorPair(leader, follower, false);
      setUseFullFirst(fitsFull);
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
        flex: 1,
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
        {formatCompetitorPair(leader, follower, useFullFirst)}
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
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
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
          sx={{ p: 0.5, width: 34, height: 34, flexShrink: 0 }}
        >
          <PaletteOutlinedIcon fontSize="small" color="action" />
        </IconButton>
      )}
      <Typography variant="body2">{fullName}</Typography>
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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Judging
        </Typography>

        <Stack spacing={1} sx={{ my: 3, ...centeredContentStackSx }}>
          {entries.map((entry) => (
            <Accordion
              key={entry.number}
              disableGutters
              elevation={0}
              variant="outlined"
              sx={{ width: '100%' }}
            >
              <AccordionSummary>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    minWidth: 0,
                    gap: 2,
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
              </AccordionSummary>

              <AccordionDetails onClick={(event) => event.stopPropagation()}>
                <Stack spacing={1}>
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
