import { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Stack,
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { centeredContentStackSx, pageContainerSx } from "@/constants/layout";
import { PercentCompleteBar } from "@/components/PercentCompleteBar";
import { CompetitorColorSwatchBox } from "@/components/CompetitorColorSwatchBox";
import { CompetitorColorDialog } from "@/components/CompetitorColorDialog";
import { DuplicateScoreDialog } from "@/components/DuplicateScoreDialog";
import { PaletteOutlinedIcon } from "@/icons/PaletteOutlinedIcon";
import {
  getEligibleCharacters,
  type CharacterName,
} from "@/data/legionNames";
import {
  type Couple,
  type CompetitorColors,
  type Role,
  emptyRawScore,
  scoreFromDigits,
  digitsFromScore,
  formatScore,
  isScored,
} from "@/types/judgingScore";

type SortMode =
  | "bib"
  | "raw"
  | "leader-last"
  | "follower-last"
  | "unscored"
  | "random";

const TOTAL_COUPLES = 20;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickIndex<T>(arr: T[]): number {
  return Math.floor(Math.random() * arr.length);
}

function generateCouples(): Couple[] {
  const pool = getEligibleCharacters();
  const used = new Set<CharacterName>();

  const pickFromPool = (preferredSex: "male" | "female"): CharacterName => {
    const usePreferred = Math.random() < 0.9;
    let candidates = pool.filter(
      (c) =>
        !used.has(c) && (usePreferred ? c.sex === preferredSex : true)
    );
    if (candidates.length === 0) {
      candidates = pool.filter((c) => !used.has(c));
    }
    const chosen = candidates[pickIndex(candidates)];
    used.add(chosen);
    return chosen;
  };

  // Unique bib numbers
  const bibs = new Set<number>();
  while (bibs.size < TOTAL_COUPLES) bibs.add(randInt(1, 999));
  const sortedBibs = [...bibs].sort((a, b) => a - b);

  return sortedBibs.map((bib) => {
    const leader = pickFromPool("male");
    const follower = pickFromPool("female");
    return {
      bib,
      leaderFirst: leader.first,
      leaderLast: leader.last,
      followerFirst: follower.first,
      followerLast: follower.last,
      raw: emptyRawScore(),
      leaderColors: {},
      followerColors: {},
    };
  });
}

function computeOrder(couples: Couple[], mode: SortMode): number[] {
  const arr = [...couples];
  if (mode === "unscored") {
    return arr
      .filter((c) => !isScored(c.raw))
      .sort((a, b) => a.bib - b.bib)
      .map((c) => c.bib);
  }
  if (mode === "raw") {
    arr.sort((a, b) => {
      const sa = isScored(a.raw) ? scoreFromDigits(a.raw.digits) : -Infinity;
      const sb = isScored(b.raw) ? scoreFromDigits(b.raw.digits) : -Infinity;
      if (sb !== sa) return sb - sa;
      return a.bib - b.bib;
    });
  } else if (mode === "leader-last") {
    arr.sort((a, b) => {
      const cmp = a.leaderLast.localeCompare(b.leaderLast);
      return cmp !== 0 ? cmp : a.bib - b.bib;
    });
  } else if (mode === "follower-last") {
    arr.sort((a, b) => {
      const cmp = a.followerLast.localeCompare(b.followerLast);
      return cmp !== 0 ? cmp : a.bib - b.bib;
    });
  } else {
    arr.sort((a, b) => a.bib - b.bib);
  }
  return arr.map((c) => c.bib);
}

function findDuplicateBib(couples: Couple[], bib: number): number | null {
  const me = couples.find((c) => c.bib === bib);
  if (!me) return null;
  const myScore = scoreFromDigits(me.raw.digits);
  if (myScore <= 0) return null;
  const match = couples.find(
    (c) => c.bib !== bib && scoreFromDigits(c.raw.digits) === myScore
  );
  return match ? match.bib : null;
}

function adjustForDuplicate(
  couples: Couple[],
  raiseBib: number,
  otherBib: number
): Couple[] {
  const raise = couples.find((c) => c.bib === raiseBib)!;
  const other = couples.find((c) => c.bib === otherBib)!;
  const raiseScore = scoreFromDigits(raise.raw.digits);
  const otherScore = scoreFromDigits(other.raw.digits);

  const newRaiseScore = Math.min(99.99, raiseScore + 0.1);
  const collides = couples.some(
    (c) =>
      c.bib !== raiseBib &&
      c.bib !== otherBib &&
      Math.abs(scoreFromDigits(c.raw.digits) - newRaiseScore) < 0.005
  );

  return couples.map((c) => {
    if (collides) {
      // Lower the other by 0.1 instead, leave raise unchanged
      if (c.bib === otherBib) {
        const lowered = Math.max(0, otherScore - 0.1);
        return {
          ...c,
          raw: { digits: digitsFromScore(lowered), touched: true },
        };
      }
      return c;
    }
    if (c.bib === raiseBib) {
      return {
        ...c,
        raw: { digits: digitsFromScore(newRaiseScore), touched: true },
      };
    }
    return c;
  });
}

interface NameDisplay {
  leader: string;
  follower: string;
}

function shortenNames(
  leaderFirst: string,
  followerFirst: string,
  step: number
): NameDisplay {
  // 0 = both full, 1 = leader initial + follower full, 2 = leader full + follower initial, 3 = both initials
  const initial = (s: string) => `${s.charAt(0)}.`;
  switch (step) {
    case 0:
      return { leader: leaderFirst, follower: followerFirst };
    case 1:
      return { leader: initial(leaderFirst), follower: followerFirst };
    case 2:
      return { leader: leaderFirst, follower: initial(followerFirst) };
    default:
      return { leader: initial(leaderFirst), follower: initial(followerFirst) };
  }
}

interface NamesRowProps {
  leaderFirst: string;
  followerFirst: string;
  leaderColors: CompetitorColors;
  followerColors: CompetitorColors;
}

function CollapsedNamesRow({
  leaderFirst,
  followerFirst,
  leaderColors,
  followerColors,
}: NamesRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      const el = containerRef.current;
      const meas = measureRef.current;
      if (!el || !meas) return;
      // try each step until fits
      for (let s = 0; s <= 3; s++) {
        const { leader, follower } = shortenNames(leaderFirst, followerFirst, s);
        meas.textContent = `${leader} · ${follower}`;
        if (meas.scrollWidth <= el.clientWidth) {
          setStep(s);
          return;
        }
      }
      setStep(3);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [leaderFirst, followerFirst]);

  const { leader, follower } = shortenNames(leaderFirst, followerFirst, step);
  const hasLeaderSwatch = !!leaderColors.top || !!leaderColors.bottom;
  const hasFollowerSwatch = !!followerColors.top || !!followerColors.bottom;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {hasLeaderSwatch && (
        <CompetitorColorSwatchBox
          colors={leaderColors}
          size={16}
          testId="collapsed-leader-swatch"
        />
      )}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          position: "relative",
          fontSize: "0.92rem",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>
          {leader} · {follower}
        </span>
        {/* Hidden measurer */}
        <span
          ref={measureRef}
          aria-hidden
          style={{
            position: "absolute",
            visibility: "hidden",
            whiteSpace: "nowrap",
            top: 0,
            left: 0,
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
        />
      </Box>
      {hasFollowerSwatch && (
        <CompetitorColorSwatchBox
          colors={followerColors}
          size={16}
          testId="collapsed-follower-swatch"
        />
      )}
    </Box>
  );
}

interface DigitSelectProps {
  value: number;
  onChange: (v: number) => void;
  testId: string;
}

function DigitSelect({ value, onChange, testId }: DigitSelectProps) {
  return (
    <FormControl
      size="small"
      onClick={(e) => e.stopPropagation()}
      sx={{ minWidth: 48, width: 48 }}
    >
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        inputProps={{ "data-testid": testId }}
        onClick={(e) => e.stopPropagation()}
        MenuProps={{
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
        }}
        sx={{ fontSize: "0.95rem", fontWeight: 600 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <MenuItem key={n} value={n}>
            {n}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

interface CompetitorRowProps {
  label: string;
  first: string;
  last: string;
  colors: CompetitorColors;
  onOpenColor: () => void;
  testIdPrefix: string;
}

function CompetitorRow({
  label,
  first,
  last,
  colors,
  onOpenColor,
  testIdPrefix,
}: CompetitorRowProps) {
  const hasColors = !!colors.top || !!colors.bottom;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 0.5,
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onOpenColor();
        }}
        data-testid={`${testIdPrefix}-color-btn`}
        sx={{ p: 0.5 }}
      >
        {hasColors ? (
          <CompetitorColorSwatchBox colors={colors} size={22} />
        ) : (
          <PaletteOutlinedIcon />
        )}
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", lineHeight: 1, fontSize: "0.7rem" }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600 }}
          data-testid={`${testIdPrefix}-name`}
          noWrap
        >
          {first} {last}
        </Typography>
      </Box>
    </Box>
  );
}

export default function JudgingPage() {
  const navigate = useNavigate();
  const [couples, setCouples] = useState<Couple[]>(() => generateCouples());
  const [expandedBib, setExpandedBib] = useState<number | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("bib");
  const [frozenOrder, setFrozenOrder] = useState<number[] | null>(null);

  const [dupDialog, setDupDialog] = useState<{
    currentBib: number;
    otherBib: number;
  } | null>(null);

  const [colorDialog, setColorDialog] = useState<{
    bib: number;
    role: Role;
    firstName: string;
    initial: CompetitorColors;
  } | null>(null);

  const prevComplete = useRef(false);

  const scoredCount = couples.filter((c) => isScored(c.raw)).length;
  const percent = (scoredCount / TOTAL_COUPLES) * 100;

  // Auto switch to raw when first hitting 100%
  useEffect(() => {
    const complete = scoredCount === TOTAL_COUPLES;
    if (complete && !prevComplete.current) {
      setSortMode("raw");
    }
    prevComplete.current = complete;
  }, [scoredCount]);

  const orderedBibs = useMemo(() => {
    if (expandedBib !== null && frozenOrder) {
      // Ensure expanded bib is included even if filter would hide it
      if (frozenOrder.includes(expandedBib)) return frozenOrder;
      return [expandedBib, ...frozenOrder];
    }
    return computeOrder(couples, sortMode);
  }, [couples, sortMode, expandedBib, frozenOrder]);

  const closeAndCheckDuplicate = (bib: number) => {
    const otherBib = findDuplicateBib(couples, bib);
    if (otherBib !== null) {
      setDupDialog({ currentBib: bib, otherBib });
    }
  };

  const handleAccordionChange =
    (bib: number) => (_: unknown, isExpanded: boolean) => {
      if (isExpanded) {
        if (expandedBib !== null && expandedBib !== bib) {
          closeAndCheckDuplicate(expandedBib);
        }
        setFrozenOrder(computeOrder(couples, sortMode));
        setExpandedBib(bib);
      } else {
        setExpandedBib(null);
        setFrozenOrder(null);
        closeAndCheckDuplicate(bib);
      }
    };

  const handleSortChange = (next: SortMode) => {
    if (next === "random") {
      // Bulk action
      const newCouples = couples.map((c) => {
        const s = 30 + Math.random() * 69.9;
        return {
          ...c,
          raw: { digits: digitsFromScore(s), touched: true },
        };
      });
      setCouples(newCouples);
      setSortMode("raw");
      setExpandedBib(null);
      setFrozenOrder(null);
      return;
    }
    if (expandedBib !== null) {
      closeAndCheckDuplicate(expandedBib);
    }
    setSortMode(next);
    setExpandedBib(null);
    setFrozenOrder(null);
  };

  const updateDigit = (bib: number, idx: 0 | 1 | 2 | 3, value: number) => {
    setCouples((prev) =>
      prev.map((c) => {
        if (c.bib !== bib) return c;
        const newDigits = [...c.raw.digits] as [number, number, number, number];
        newDigits[idx] = value;
        return {
          ...c,
          raw: { digits: newDigits, touched: true },
        };
      })
    );
  };

  const handleOpenColor = (bib: number, role: Role) => {
    const c = couples.find((x) => x.bib === bib)!;
    setColorDialog({
      bib,
      role,
      firstName: role === "leader" ? c.leaderFirst : c.followerFirst,
      initial: role === "leader" ? c.leaderColors : c.followerColors,
    });
  };

  const handleSaveColors = (colors: CompetitorColors) => {
    if (!colorDialog) return;
    const { bib, role } = colorDialog;
    setCouples((prev) =>
      prev.map((c) =>
        c.bib === bib
          ? role === "leader"
            ? { ...c, leaderColors: colors }
            : { ...c, followerColors: colors }
          : c
      )
    );
    setColorDialog(null);
  };

  const handleDupChoose = (chooseCurrent: boolean) => {
    if (!dupDialog) return;
    const raiseBib = chooseCurrent
      ? dupDialog.currentBib
      : dupDialog.otherBib;
    const otherBib = chooseCurrent
      ? dupDialog.otherBib
      : dupDialog.currentBib;
    const newCouples = adjustForDuplicate(couples, raiseBib, otherBib);
    setCouples(newCouples);
    if (sortMode === "raw" && expandedBib !== null) {
      setFrozenOrder(computeOrder(newCouples, sortMode));
    }
    setDupDialog(null);
  };

  const currentDup = dupDialog
    ? couples.find((c) => c.bib === dupDialog.currentBib)
    : undefined;
  const otherDup = dupDialog
    ? couples.find((c) => c.bib === dupDialog.otherBib)
    : undefined;

  return (
    <Container maxWidth="md" sx={pageContainerSx}>
      <Stack sx={centeredContentStackSx} spacing={1.5}>
        <PercentCompleteBar
          percent={percent}
          onSubmit={() => navigate("/staff")}
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="sort-label">Sort / Filter</InputLabel>
          <Select
            labelId="sort-label"
            label="Sort / Filter"
            value={sortMode === "random" ? "bib" : sortMode}
            onChange={(e) => handleSortChange(e.target.value as SortMode)}
            inputProps={{ "data-testid": "sort-select" }}
          >
            <MenuItem value="bib" data-testid="sort-opt-bib">
              Sort by Bib #
            </MenuItem>
            <MenuItem value="raw" data-testid="sort-opt-raw">
              Sort by Raw Score
            </MenuItem>
            <MenuItem
              value="leader-last"
              data-testid="sort-opt-leader-last"
            >
              Sort by Leader's Last Name
            </MenuItem>
            <MenuItem
              value="follower-last"
              data-testid="sort-opt-follower-last"
            >
              Sort by Follower's Last Name
            </MenuItem>
            <MenuItem value="unscored" data-testid="sort-opt-unscored">
              Unscored Only
            </MenuItem>
            <MenuItem value="random" data-testid="sort-opt-random">
              Assign Random Scores
            </MenuItem>
          </Select>
        </FormControl>

        <Box data-testid="couples-list" sx={{ width: "100%" }}>
          {orderedBibs.map((bib) => {
            const c = couples.find((x) => x.bib === bib);
            if (!c) return null;
            const expanded = expandedBib === bib;
            const score = scoreFromDigits(c.raw.digits);
            const touched = c.raw.touched;
            return (
              <Accordion
                key={bib}
                expanded={expanded}
                onChange={handleAccordionChange(bib)}
                disableGutters
                square={false}
                data-testid={`couple-${bib}`}
                sx={{
                  mb: 0.75,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  "&:before": { display: "none" },
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  sx={{
                    px: 1.5,
                    "& .MuiAccordionSummary-content": {
                      my: 0,
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      minWidth: 36,
                      color: "primary.main",
                    }}
                    data-testid={`bib-${bib}`}
                  >
                    {bib}
                  </Typography>
                  <CollapsedNamesRow
                    leaderFirst={c.leaderFirst}
                    followerFirst={c.followerFirst}
                    leaderColors={c.leaderColors}
                    followerColors={c.followerColors}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      minWidth: 50,
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                    }}
                    data-testid={`score-summary-${bib}`}
                  >
                    {touched ? formatScore(score) : ""}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  onClick={(e) => e.stopPropagation()}
                  sx={{ pt: 0, pb: 1.5 }}
                >
                  <Divider sx={{ mb: 1.5 }} />
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 700,
                      }}
                    >
                      Raw Score
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <DigitSelect
                        value={c.raw.digits[0]}
                        onChange={(v) => updateDigit(bib, 0, v)}
                        testId={`digit-${bib}-0`}
                      />
                      <DigitSelect
                        value={c.raw.digits[1]}
                        onChange={(v) => updateDigit(bib, 1, v)}
                        testId={`digit-${bib}-1`}
                      />
                      <Typography
                        sx={{ fontWeight: 800, fontSize: "1.2rem", mx: 0.25 }}
                      >
                        .
                      </Typography>
                      <DigitSelect
                        value={c.raw.digits[2]}
                        onChange={(v) => updateDigit(bib, 2, v)}
                        testId={`digit-${bib}-2`}
                      />
                      <DigitSelect
                        value={c.raw.digits[3]}
                        onChange={(v) => updateDigit(bib, 3, v)}
                        testId={`digit-${bib}-3`}
                      />
                    </Box>
                  </Box>
                  <CompetitorRow
                    label="Leader"
                    first={c.leaderFirst}
                    last={c.leaderLast}
                    colors={c.leaderColors}
                    onOpenColor={() => handleOpenColor(bib, "leader")}
                    testIdPrefix={`leader-${bib}`}
                  />
                  <CompetitorRow
                    label="Follower"
                    first={c.followerFirst}
                    last={c.followerLast}
                    colors={c.followerColors}
                    onOpenColor={() => handleOpenColor(bib, "follower")}
                    testIdPrefix={`follower-${bib}`}
                  />
                </AccordionDetails>
              </Accordion>
            );
          })}
          {orderedBibs.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: "center",
                color: "text.secondary",
                borderRadius: 2,
              }}
              data-testid="couples-empty"
            >
              No couples match the current filter.
            </Paper>
          )}
        </Box>

        <Button
          variant="text"
          onClick={() => navigate("/staff")}
          data-testid="judging-back-staff-btn"
          fullWidth
        >
          Back to Staff
        </Button>
      </Stack>

      {colorDialog && (
        <CompetitorColorDialog
          open={!!colorDialog}
          firstName={colorDialog.firstName}
          initialColors={colorDialog.initial}
          onSave={handleSaveColors}
          onCancel={() => setColorDialog(null)}
        />
      )}

      {dupDialog && currentDup && otherDup && (
        <DuplicateScoreDialog
          open={!!dupDialog}
          currentLeaderFirst={currentDup.leaderFirst}
          currentFollowerFirst={currentDup.followerFirst}
          otherLeaderFirst={otherDup.leaderFirst}
          otherFollowerFirst={otherDup.followerFirst}
          onChooseCurrentHigher={() => handleDupChoose(true)}
          onChooseOtherHigher={() => handleDupChoose(false)}
          onClose={() => setDupDialog(null)}
        />
      )}
    </Container>
  );
}
