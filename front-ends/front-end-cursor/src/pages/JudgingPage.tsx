import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaletteOutlinedIcon from '../components/PaletteOutlinedIcon';
import { centeredContentStackSx, CONTENT_MAX_WIDTH } from '../constants/layout';
import {
  formatFullFirstLast,
  formatJudgePair,
  LEGION_MEMBER_NAMES,
  memberKey,
  type LegionMember,
} from '../data/legionNames';

const ENTRY_COUNT = 20;
const NUMBER_COLUMN_WIDTH = '3.5rem';

type JudgingEntry = {
  number: number;
  judge1: LegionMember;
  judge2: LegionMember;
};

function pickRandomMember(exclude?: LegionMember): LegionMember {
  const excludeKey = exclude ? memberKey(exclude) : undefined;
  const pool = excludeKey
    ? LEGION_MEMBER_NAMES.filter((member) => memberKey(member) !== excludeKey)
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
      const judge1 = pickRandomMember();
      const judge2 = pickRandomMember(judge1);

      return { number, judge1, judge2 };
    });
}

type JudgeNamesTextProps = {
  judge1: LegionMember;
  judge2: LegionMember;
};

function JudgeNamesText({ judge1, judge2 }: JudgeNamesTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [useFullFirst, setUseFullFirst] = useState(true);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) {
      return;
    }

    const checkFit = () => {
      measure.textContent = formatJudgePair(judge1, judge2, true);
      setUseFullFirst(measure.scrollWidth <= container.clientWidth);
    };

    checkFit();

    const observer = new ResizeObserver(checkFit);
    observer.observe(container);

    return () => observer.disconnect();
  }, [judge1, judge2]);

  return (
    <Box
      component="span"
      ref={containerRef}
      sx={{
        position: 'relative',
        flex: 1,
        minWidth: 0,
        display: 'block',
      }}
    >
      <Typography
        component="span"
        variant="body1"
        sx={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {formatJudgePair(judge1, judge2, useFullFirst)}
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

type JudgeNameDetailProps = {
  member: LegionMember;
};

function JudgeNameDetail({ member }: JudgeNameDetailProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <PaletteOutlinedIcon fontSize="small" color="action" aria-hidden />
      <Typography variant="body2">{formatFullFirstLast(member.first, member.last)}</Typography>
    </Stack>
  );
}

export default function JudgingPage() {
  const navigate = useNavigate();
  const entries = useMemo(() => createJudgingEntries(), []);

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

                  <JudgeNamesText judge1={entry.judge1} judge2={entry.judge2} />
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Stack spacing={1}>
                  <JudgeNameDetail member={entry.judge1} />
                  <JudgeNameDetail member={entry.judge2} />
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
    </Container>
  );
}
