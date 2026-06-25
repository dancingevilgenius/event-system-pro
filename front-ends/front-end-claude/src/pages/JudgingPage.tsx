import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

import { PercentCompleteBar } from '../components/PercentCompleteBar';
import { RawScoreInput } from '../components/RawScoreInput';
import { ColorSwatchButton, CoupleColors } from '../components/ColorSwatchButton';
import { CompetitorColorDialog } from '../components/CompetitorColorDialog';
import { DuplicateScoreDialog } from '../components/DuplicateScoreDialog';
import { generateCouples, Couple } from '../utils/nameSelection';
import { formatCoupleNames, pickNameDisplayLevel } from '../utils/nameDisplay';
import {
  RawScoreState,
  clampScore,
  formatScore,
  isScored,
  isUnscored,
} from '../types/judgingScore';
import { SORT_FILTER_LABELS, SORT_FILTER_ORDER, SortFilterOption } from '../types/sortFilter';
import {
  COUPLE_COUNT,
  CONTENT_MAX_WIDTH,
  DUPLICATE_NUDGE,
  RANDOM_SCORE_MAX,
  RANDOM_SCORE_MIN,
  SCORE_MAX,
} from '../constants/layout';

type Role = 'leader' | 'follower';

interface ColorDialogTarget {
  bib: number;
  role: Role;
  firstName: string;
}

interface DuplicateTarget {
  currentBib: number;
  otherBib: number;
}

function randomScoreInRange(): number {
  const value = RANDOM_SCORE_MIN + Math.random() * (RANDOM_SCORE_MAX - RANDOM_SCORE_MIN);
  return Math.round(value * 10) / 10; // one decimal place, matches "30.0 to 99.9"
}

export default function JudgingPage() {
  const navigate = useNavigate();

  // Generated once per page load/visit — fixed for the lifetime of this mount.
  const [couples] = useState<Couple[]>(() => generateCouples());

  const [scores, setScores] = useState<Record<number, RawScoreState>>(() => {
    const initial: Record<number, RawScoreState> = {};
    couples.forEach((c) => {
      initial[c.bib] = { touched: false, value: 0 };
    });
    return initial;
  });

  const [colors, setColors] = useState<Record<string, CoupleColors>>(() => {
    const initial: Record<string, CoupleColors> = {};
    couples.forEach((c) => {
      initial[`${c.bib}-leader`] = { top: null, bottom: null };
      initial[`${c.bib}-follower`] = { top: null, bottom: null };
    });
    return initial;
  });

  const [sortFilter, setSortFilter] = useState<SortFilterOption>('bib');
  const [openBib, setOpenBib] = useState<number | null>(null);

  // While a panel is open, freeze the visible order/filter snapshot so
  // score or dropdown changes don't reshuffle the list underneath the user.
  const frozenOrderRef = useRef<number[] | null>(null);

  // Tracks whether 100% has already been reached once, so the
  // auto-switch-to-Sort-by-Raw-Score only fires on the transition into 100%.
  const hasAutoSwitchedRef = useRef(false);

  const [colorDialogTarget, setColorDialogTarget] = useState<ColorDialogTarget | null>(null);
  const [duplicateTarget, setDuplicateTarget] = useState<DuplicateTarget | null>(null);

  const coupleByBib = useMemo(() => {
    const map = new Map<number, Couple>();
    couples.forEach((c) => map.set(c.bib, c));
    return map;
  }, [couples]);

  const scoredCount = useMemo(
    () => couples.filter((c) => isScored(scores[c.bib])).length,
    [couples, scores],
  );
  const percentComplete = (scoredCount / COUPLE_COUNT) * 100;

  // --- Sorting / filtering -------------------------------------------------

  function computeOrder(
    option: SortFilterOption,
    scoresOverride?: Record<number, RawScoreState>,
  ): number[] {
    const scoreData = scoresOverride ?? scores;
    let list = [...couples];

    if (option === 'unscoredOnly') {
      list = list.filter((c) => isUnscored(scoreData[c.bib]));
      list.sort((a, b) => a.bib - b.bib);
      return list.map((c) => c.bib);
    }

    switch (option) {
      case 'rawScore':
        list.sort((a, b) => {
          const aScored = isScored(scoreData[a.bib]);
          const bScored = isScored(scoreData[b.bib]);
          if (aScored && !bScored) return -1;
          if (!aScored && bScored) return 1;
          if (aScored && bScored) {
            const diff = scoreData[b.bib].value - scoreData[a.bib].value;
            if (diff !== 0) return diff;
          }
          return a.bib - b.bib;
        });
        break;
      case 'leaderLastName':
        list.sort((a, b) => {
          const cmp = a.leader.lastName.localeCompare(b.leader.lastName);
          return cmp !== 0 ? cmp : a.bib - b.bib;
        });
        break;
      case 'followerLastName':
        list.sort((a, b) => {
          const cmp = a.follower.lastName.localeCompare(b.follower.lastName);
          return cmp !== 0 ? cmp : a.bib - b.bib;
        });
        break;
      case 'bib':
      default:
        list.sort((a, b) => a.bib - b.bib);
        break;
    }
    return list.map((c) => c.bib);
  }

  // The order actually shown: frozen snapshot while a panel is open,
  // otherwise live-recomputed from current sortFilter + scores.
  const visibleOrder = useMemo(() => {
    if (openBib !== null && frozenOrderRef.current) {
      return frozenOrderRef.current;
    }
    return computeOrder(sortFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortFilter, scores, openBib, couples]);

  // --- Duplicate detection --------------------------------------------------

  function findDuplicateFor(bib: number): number | null {
    const state = scores[bib];
    if (!isScored(state)) return null;
    const match = couples.find(
      (c) => c.bib !== bib && isScored(scores[c.bib]) && scores[c.bib].value === state.value,
    );
    return match ? match.bib : null;
  }

  // --- Accordion open/close -------------------------------------------------

  function closePanelAndCheckDuplicate(bib: number) {
    const dupBib = findDuplicateFor(bib);
    if (dupBib !== null) {
      setDuplicateTarget({ currentBib: bib, otherBib: dupBib });
    }
  }

  function handleAccordionToggle(bib: number) {
    if (openBib === bib) {
      // Collapsing the open panel.
      setOpenBib(null);
      frozenOrderRef.current = null;
      closePanelAndCheckDuplicate(bib);
    } else {
      // Opening a panel: if another was open, closing it first triggers its
      // own duplicate check; then snapshot the order for the newly open one.
      const previouslyOpen = openBib;
      setOpenBib(bib);
      frozenOrderRef.current = computeOrder(sortFilter);
      if (previouslyOpen !== null) {
        closePanelAndCheckDuplicate(previouslyOpen);
      }
    }
  }

  function handleSortFilterChange(option: SortFilterOption) {
    const previouslyOpen = openBib;
    setSortFilter(option);
    setOpenBib(null);
    frozenOrderRef.current = null;
    if (previouslyOpen !== null) {
      closePanelAndCheckDuplicate(previouslyOpen);
    }
  }

  // --- Score updates ---------------------------------------------------------

  function updateScore(bib: number, newValue: number) {
    setScores((prev) => {
      const next = { ...prev, [bib]: { touched: true, value: clampScore(newValue) } };
      return next;
    });
  }

  function handleAssignRandomScores() {
    setScores((prev) => {
      const next = { ...prev };
      couples.forEach((c) => {
        next[c.bib] = { touched: true, value: randomScoreInRange() };
      });
      return next;
    });
    setSortFilter('rawScore');
    setOpenBib(null);
    frozenOrderRef.current = null;
    // Bulk scoring can create duplicates anywhere, but the spec's duplicate
    // flow is keyed specifically to a single panel closing — Assign Random
    // Scores is a distinct dropdown action and doesn't trigger that dialog.
  }

  // Auto-switch to Sort by Raw Score the moment 100% is first reached.
  useEffect(() => {
    if (!hasAutoSwitchedRef.current && scoredCount === COUPLE_COUNT) {
      hasAutoSwitchedRef.current = true;
      setSortFilter('rawScore');
      setOpenBib(null);
      frozenOrderRef.current = null;
    }
  }, [scoredCount]);

  // --- Duplicate resolution ---------------------------------------------------

  function resolveDuplicate(direction: 'current' | 'other') {
    if (!duplicateTarget) return;
    const { currentBib, otherBib } = duplicateTarget;
    const raiseBib = direction === 'current' ? currentBib : otherBib;
    const lowerBib = direction === 'current' ? otherBib : currentBib;

    const raiseScore = scores[raiseBib].value;
    const proposedRaise = clampScore(raiseScore + DUPLICATE_NUDGE);
    const collides = couples.some(
      (c) => c.bib !== raiseBib && isScored(scores[c.bib]) && scores[c.bib].value === proposedRaise,
    );

    const nextScores: Record<number, RawScoreState> = { ...scores };
    if (!collides && proposedRaise <= SCORE_MAX) {
      nextScores[raiseBib] = { ...scores[raiseBib], value: proposedRaise };
    } else {
      const proposedLower = clampScore(scores[lowerBib].value - DUPLICATE_NUDGE);
      nextScores[lowerBib] = { ...scores[lowerBib], value: proposedLower };
    }

    setScores(nextScores);
    setDuplicateTarget(null);

    // If sort is by Raw Score, the list must re-sort to reflect the new
    // scores — including when another panel is still open with a frozen
    // list. Refresh the frozen snapshot using the scores we just computed,
    // not a stale read of pre-update state.
    if (sortFilter === 'rawScore' && openBib !== null) {
      frozenOrderRef.current = computeOrder('rawScore', nextScores);
    }
  }

  // --- Color dialog -----------------------------------------------------------

  function openColorDialog(bib: number, role: Role, firstName: string) {
    setColorDialogTarget({ bib, role, firstName });
  }

  function saveColors(newColors: CoupleColors) {
    if (!colorDialogTarget) return;
    const key = `${colorDialogTarget.bib}-${colorDialogTarget.role}`;
    setColors((prev) => ({ ...prev, [key]: newColors }));
    setColorDialogTarget(null);
  }

  // --- Render helpers -----------------------------------------------------------

  function renderSummaryNames(couple: Couple) {
    const level = pickNameDisplayLevel(
      couple.leader.firstName,
      couple.follower.firstName,
      CONTENT_MAX_WIDTH - 140,
      56,
    );
    return formatCoupleNames(couple.leader.firstName, couple.follower.firstName, level);
  }

  const duplicateCouples = duplicateTarget
    ? {
        current: coupleByBib.get(duplicateTarget.currentBib)!,
        other: coupleByBib.get(duplicateTarget.otherBib)!,
      }
    : null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.default',
          pt: 2,
          pb: 1.5,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
          <PercentCompleteBar percent={percentComplete} onSubmit={() => navigate('/staff')} />
        </Box>
      </Box>

      <Box sx={{ maxWidth: CONTENT_MAX_WIDTH, mx: 'auto', px: 2, pt: 2 }}>
        <Select
          fullWidth
          size="small"
          value={sortFilter}
          onChange={(e) => {
            const value = e.target.value as SortFilterOption | 'assignRandom';
            if (value === 'assignRandom') {
              handleAssignRandomScores();
            } else {
              handleSortFilterChange(value);
            }
          }}
          sx={{ mb: 2, bgcolor: 'background.paper' }}
        >
          {SORT_FILTER_ORDER.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {SORT_FILTER_LABELS[opt]}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem value="assignRandom">Assign Random Scores</MenuItem>
        </Select>

        {visibleOrder.map((bib) => {
          const couple = coupleByBib.get(bib)!;
          const scoreState = scores[bib];
          const isOpen = openBib === bib;
          const leaderColors = colors[`${bib}-leader`];
          const followerColors = colors[`${bib}-follower`];

          return (
            <Accordion
              key={bib}
              expanded={isOpen}
              onChange={() => handleAccordionToggle(bib)}
              sx={{ mb: 1.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
            >
              <AccordionSummary
                sx={{
                  '& .MuiAccordionSummary-content': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  },
                }}
              >
                <Typography sx={{ fontWeight: 700, minWidth: 32, color: 'primary.main' }}>
                  {couple.bib}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                  <ColorSwatchButton
                    colors={leaderColors}
                    onClick={() => openColorDialog(bib, 'leader', couple.leader.firstName)}
                  />
                  <ColorSwatchButton
                    colors={followerColors}
                    onClick={() => openColorDialog(bib, 'follower', couple.follower.firstName)}
                  />
                </Box>

                <Typography sx={{ flex: 1, fontSize: '0.9rem' }} noWrap>
                  {renderSummaryNames(couple)}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: scoreState.touched ? 'secondary.dark' : 'transparent',
                    minWidth: 44,
                    textAlign: 'right',
                  }}
                >
                  {scoreState.touched ? formatScore(scoreState.value) : '00.00'}
                </Typography>
              </AccordionSummary>

              <AccordionDetails onClick={(e) => e.stopPropagation()}>
                <RawScoreInput
                  value={scoreState.value}
                  onChange={(v) => updateScore(bib, v)}
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ColorSwatchButton
                      colors={leaderColors}
                      onClick={() => openColorDialog(bib, 'leader', couple.leader.firstName)}
                      size={32}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Leader
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        {couple.leader.firstName} {couple.leader.lastName}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ColorSwatchButton
                      colors={followerColors}
                      onClick={() => openColorDialog(bib, 'follower', couple.follower.firstName)}
                      size={32}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Follower
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        {couple.follower.firstName} {couple.follower.lastName}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}

        <Button
          variant="text"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate('/staff')}
        >
          Back to Staff
        </Button>
      </Box>

      {colorDialogTarget && (
        <CompetitorColorDialog
          open
          firstName={colorDialogTarget.firstName}
          existingColors={colors[`${colorDialogTarget.bib}-${colorDialogTarget.role}`]}
          onSave={saveColors}
          onClose={() => setColorDialogTarget(null)}
        />
      )}

      {duplicateCouples && (
        <DuplicateScoreDialog
          open
          currentLeaderFirst={duplicateCouples.current.leader.firstName}
          currentFollowerFirst={duplicateCouples.current.follower.firstName}
          otherLeaderFirst={duplicateCouples.other.leader.firstName}
          otherFollowerFirst={duplicateCouples.other.follower.firstName}
          score={scores[duplicateTarget!.currentBib].value}
          onChooseCurrent={() => resolveDuplicate('current')}
          onChooseOther={() => resolveDuplicate('other')}
          onClose={() => setDuplicateTarget(null)}
        />
      )}
    </Box>
  );
}
