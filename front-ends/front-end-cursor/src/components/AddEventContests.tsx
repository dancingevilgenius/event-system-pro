import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import {
  fetchEventMoreJson,
  fetchSortedStaticListEntries,
  parseEventContests,
  parseEventStaff,
  type EventContestDraft,
  type EventContestsState,
  type ScoringJudgeCount,
  type StaticListEntry,
} from '../api/postgrest';
import { mobileColumnSx } from '../constants/layout';
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import { useMessages } from '../hooks/useMessages';
import { buildDefaultSwingContestTitle } from '../lib/swingDanceContest';
import {
  WSDC_SKILL_LEVELS_LIST_CODE,
  WSDC_SWING_DIVISIONS_LIST_CODE,
} from '../lib/staticList';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';
import DragHandleIcon from './DragHandleIcon';

export type EventContestsSummary = {
  hasContests: boolean;
  contestCount: number;
};

type AddEventContestsProps = {
  eventId: number | null;
  eventTypeCode?: string | null;
  onFieldEdit?: () => void;
  onSummaryChange?: (summary: EventContestsSummary) => void;
  onSaveContests: (contests: EventContestsState) => void;
};

type HasContestsValue = 'yes' | 'no';

type ContestJudgeOption = {
  staffId: string;
  label: string;
};

const JUDGE_ROLE_CODES = new Set(['JUDGE', 'HEAD_JUDGE']);

const fieldLabelSx = { fontWeight: 700 };

function staffJudgeLabel(firstName: string, lastName: string): string {
  return [firstName.trim(), lastName.trim()].filter((part) => part !== '').join(' ');
}

function isContestJudge(primaryRoleCode: string, secondaryRoleCode: string): boolean {
  return JUDGE_ROLE_CODES.has(primaryRoleCode) || JUDGE_ROLE_CODES.has(secondaryRoleCode);
}

function resizeScoringJudgeIds(current: string[], count: ScoringJudgeCount): string[] {
  const next = current.slice(0, count);
  while (next.length < count) {
    next.push('');
  }
  return next;
}

function eventTypeIncludesSwing(eventTypeCode: string | null | undefined): boolean {
  return (eventTypeCode ?? '').toLowerCase().includes('swing');
}

function SortableContestRow({
  contest,
  onEdit,
  onDelete,
}: {
  contest: EventContestDraft;
  onEdit: (contest: EventContestDraft) => void;
  onDelete: (contestId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: contest.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        px: 1,
        py: 0.75,
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${buildDefaultSwingContestTitle(contest.divisionLabel, contest.skillLevelLabel)}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: '0 0 auto',
          color: 'text.secondary',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        <DragHandleIcon fontSize="small" />
      </Box>
      <Typography variant="body2" sx={{ flex: '1 1 auto', minWidth: 0 }}>
        {buildDefaultSwingContestTitle(contest.divisionLabel, contest.skillLevelLabel)}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flex: '0 0 auto' }}>
        <Button size="small" variant="outlined" onClick={() => onEdit(contest)}>
          Edit
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={() => onDelete(contest.id)}>
          Delete
        </Button>
      </Stack>
    </Box>
  );
}

export default function AddEventContests({
  eventId,
  eventTypeCode,
  onFieldEdit,
  onSummaryChange,
  onSaveContests,
}: AddEventContestsProps) {
  const { showInfo, showProblem } = useMessages();
  const [hasContests, setHasContests] = useState(false);
  const [contests, setContests] = useState<EventContestDraft[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(eventId !== null);
  const hasContestsRef = useRef(hasContests);
  const contestsRef = useRef(contests);
  const dirtyRef = useRef(false);
  const onSaveContestsRef = useRef(onSaveContests);
  const [loaded, setLoaded] = useState(eventId === null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContestId, setEditingContestId] = useState<string | null>(null);
  const [divisionKey, setDivisionKey] = useState('');
  const [skillLevelKey, setSkillLevelKey] = useState('');
  const [headJudgeStaffId, setHeadJudgeStaffId] = useState('');
  const [scoringJudgeCount, setScoringJudgeCount] = useState<ScoringJudgeCount | null>(null);
  const [scoringJudgeIds, setScoringJudgeIds] = useState<string[]>([]);
  const [judgeOptions, setJudgeOptions] = useState<ContestJudgeOption[]>([]);
  const [divisions, setDivisions] = useState<StaticListEntry[]>([]);
  const [skillLevels, setSkillLevels] = useState<StaticListEntry[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [listsLoaded, setListsLoaded] = useState(false);
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);
  const hydratedImportTokenRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    hasContestsRef.current = hasContests;
  }, [hasContests]);

  useEffect(() => {
    contestsRef.current = contests;
  }, [contests]);

  useEffect(() => {
    onSaveContestsRef.current = onSaveContests;
  }, [onSaveContests]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    onSummaryChange?.({ hasContests, contestCount: contests.length });
  }, [contests.length, hasContests, loaded, onSummaryChange]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    reportExport('contests', { hasContests, contests });
  }, [contests, hasContests, loaded, reportExport]);

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    hydratedImportTokenRef.current = appliedImport.token;
    hasContestsRef.current = appliedImport.contests.hasContests;
    contestsRef.current = appliedImport.contests.contests;
    dirtyRef.current = true;
    setHasContests(appliedImport.contests.hasContests);
    setContests(appliedImport.contests.contests);
    setLoaded(true);
    setLoadingSaved(false);
    onSaveContestsRef.current(appliedImport.contests);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

  useEffect(() => {
    if (eventId === null) {
      setLoadingSaved(false);
      setLoaded(true);
      return;
    }

    let cancelled = false;
    setLoadingSaved(true);

    void fetchEventMoreJson(eventId)
      .then((moreJson) => {
        if (cancelled || dirtyRef.current || hydratedImportTokenRef.current !== 0) {
          return;
        }

        const saved = parseEventContests(moreJson);
        hasContestsRef.current = saved.hasContests;
        contestsRef.current = saved.contests;
        setHasContests(saved.hasContests);
        setContests(saved.contests);
      })
      .catch(() => {
        if (!cancelled && !dirtyRef.current) {
          setHasContests(false);
          setContests([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSaved(false);
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const persistContests = (nextHasContests: boolean, nextContests: EventContestDraft[]) => {
    onSaveContestsRef.current({
      hasContests: nextHasContests,
      contests: nextContests,
    });
  };

  useEffect(() => {
    if (!dialogOpen || listsLoaded) {
      return;
    }

    let cancelled = false;
    setLoadingLists(true);
    setListError(null);

    Promise.all([
      fetchSortedStaticListEntries(WSDC_SWING_DIVISIONS_LIST_CODE, 'swing divisions'),
      fetchSortedStaticListEntries(WSDC_SKILL_LEVELS_LIST_CODE, 'skill levels'),
    ])
      .then(([divisionEntries, skillLevelEntries]) => {
        if (cancelled) {
          return;
        }

        setDivisions(divisionEntries);
        setSkillLevels(skillLevelEntries);
        setListsLoaded(true);
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }

        setListError(
          error instanceof Error ? error.message : 'Unable to load swing contest options.',
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingLists(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dialogOpen, listsLoaded]);

  useEffect(() => {
    if (!dialogOpen || eventId === null) {
      return;
    }

    let cancelled = false;
    void fetchEventMoreJson(eventId)
      .then((moreJson) => {
        if (cancelled) {
          return;
        }

        const staff = parseEventStaff(moreJson);
        setJudgeOptions(
          staff.members.flatMap((member) => {
            if (!isContestJudge(member.primaryRoleCode, member.secondaryRoleCode)) {
              return [];
            }
            const label = staffJudgeLabel(member.firstName, member.lastName);
            if (label === '') {
              return [];
            }
            return [{ staffId: member.id, label }];
          }),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setJudgeOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dialogOpen, eventId]);

  const handleHasContestsChange = (
    _event: MouseEvent<HTMLElement>,
    nextValue: HasContestsValue | null,
  ) => {
    if (nextValue === null) {
      return;
    }

    const nextHasContests = nextValue === 'yes';
    hasContestsRef.current = nextHasContests;
    setHasContests(nextHasContests);
    dirtyRef.current = true;
    onFieldEdit?.();
    persistContests(nextHasContests, contestsRef.current);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDivisionKey('');
    setSkillLevelKey('');
    setHeadJudgeStaffId('');
    setScoringJudgeCount(null);
    setScoringJudgeIds([]);
  };

  const handleAddContest = () => {
    if (!hasContests) {
      return;
    }

    if (!eventTypeIncludesSwing(eventTypeCode)) {
      showInfo('Contest setup for this event type is not available yet.');
      return;
    }

    setEditingContestId(null);
    setDivisionKey('');
    setSkillLevelKey('');
    setHeadJudgeStaffId('');
    setScoringJudgeCount(null);
    setScoringJudgeIds([]);
    setDialogOpen(true);
  };

  const handleEditContest = (contest: EventContestDraft) => {
    setEditingContestId(contest.id);
    setDivisionKey(contest.divisionKey);
    setSkillLevelKey(contest.skillLevelKey);
    const savedCount = contest.scoringJudgeCount ?? null;
    setHeadJudgeStaffId(contest.headJudgeStaffId ?? '');
    setScoringJudgeCount(savedCount);
    setScoringJudgeIds(
      savedCount === null ? [] : resizeScoringJudgeIds(contest.scoringJudgeStaffIds ?? [], savedCount),
    );
    setDialogOpen(true);
  };

  const handleDeleteContest = (contestId: string) => {
    const next = contestsRef.current.filter((contest) => contest.id !== contestId);
    contestsRef.current = next;
    setContests(next);
    dirtyRef.current = true;
    onFieldEdit?.();
    persistContests(hasContestsRef.current, next);
  };

  const handleSave = () => {
    const division = divisions.find((entry) => entry.key === divisionKey);
    const skillLevel = skillLevels.find((entry) => entry.key === skillLevelKey);

    if (!division || !skillLevel) {
      showProblem('Select a swing division and a skill level.');
      return;
    }

    const nextContest = {
      divisionKey: division.key,
      divisionLabel: division.label,
      skillLevelKey: skillLevel.key,
      skillLevelLabel: skillLevel.label,
      headJudgeStaffId,
      scoringJudgeCount,
      scoringJudgeStaffIds:
        scoringJudgeCount === null ? [] : resizeScoringJudgeIds(scoringJudgeIds, scoringJudgeCount),
    };

    const next = editingContestId
      ? contestsRef.current.map((contest) =>
          contest.id === editingContestId ? { ...contest, ...nextContest } : contest,
        )
      : [
          ...contestsRef.current,
          {
            id: crypto.randomUUID(),
            ...nextContest,
          },
        ];
    contestsRef.current = next;
    setContests(next);
    dirtyRef.current = true;
    onFieldEdit?.();
    persistContests(hasContestsRef.current, next);
    closeDialog();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const current = contestsRef.current;
    const oldIndex = current.findIndex((contest) => contest.id === active.id);
    const newIndex = current.findIndex((contest) => contest.id === over.id);
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const next = arrayMove(current, oldIndex, newIndex);
    contestsRef.current = next;
    setContests(next);
    dirtyRef.current = true;
    onFieldEdit?.();
    persistContests(hasContestsRef.current, next);
  };

  const canSave = divisionKey !== '' && skillLevelKey !== '' && !loadingLists && !listError;

  const judgeChoices = (selectedStaffId: string, excludedStaffIds: Set<string>) => {
    const choices = judgeOptions.filter(
      (option) => option.staffId === selectedStaffId || !excludedStaffIds.has(option.staffId),
    );
    if (selectedStaffId !== '' && !choices.some((option) => option.staffId === selectedStaffId)) {
      choices.push({ staffId: selectedStaffId, label: 'Former staff member' });
    }
    return choices;
  };

  const handleScoringJudgeCountChange = (value: string) => {
    if (value !== '3' && value !== '5' && value !== '7') {
      setScoringJudgeCount(null);
      setScoringJudgeIds([]);
      return;
    }
    const count = Number(value) as ScoringJudgeCount;
    setScoringJudgeCount(count);
    setScoringJudgeIds((current) => resizeScoringJudgeIds(current, count));
  };

  const handleScoringJudgeChange = (index: number, staffId: string) => {
    setScoringJudgeIds((current) => current.map((id, rowIndex) => (rowIndex === index ? staffId : id)));
  };
  const contestIds = contests.map((contest) => contest.id);

  return (
    <Box sx={mobileColumnSx}>
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>
            Has Contests
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={hasContests ? 'yes' : 'no'}
            onChange={handleHasContestsChange}
            aria-label="Has Contests"
            disabled={loadingSaved}
          >
            <ToggleButton value="no" aria-label="No">
              No
            </ToggleButton>
            <ToggleButton value="yes" aria-label="Yes">
              Yes
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {hasContests && contests.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={contestIds} strategy={verticalListSortingStrategy}>
              <Stack spacing={1}>
                {contests.map((contest) => (
                  <SortableContestRow
                    key={contest.id}
                    contest={contest}
                    onEdit={handleEditContest}
                    onDelete={handleDeleteContest}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : null}

        {hasContests ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleAddContest}>
              Add Contest
            </Button>
          </Box>
        ) : null}
      </Stack>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 5, position: 'relative' }}>
          {editingContestId ? 'Edit Contest' : 'Add Contest'}
          <IconButton
            aria-label={editingContestId ? 'Close edit contest dialog' : 'Close add contest dialog'}
            onClick={closeDialog}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {loadingLists ? (
              <Stack sx={{ py: 2, alignItems: 'center' }}>
                <CircularProgress size={28} />
              </Stack>
            ) : null}
            {listError ? (
              <Typography variant="body2" color="error">
                {listError}
              </Typography>
            ) : null}
            {!loadingLists && !listError ? (
              <>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5}>
                    <AppTextField
                      select
                      label="Swing Division"
                      value={divisionKey}
                      onChange={(event) => setDivisionKey(event.target.value)}
                      fullWidth
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      <MenuItem value="">
                        <em>Select division</em>
                      </MenuItem>
                      {divisions.map((entry) => (
                        <MenuItem key={entry.key} value={entry.key}>
                          {entry.label}
                        </MenuItem>
                      ))}
                    </AppTextField>
                    <AppTextField
                      select
                      label="Skill Level"
                      value={skillLevelKey}
                      onChange={(event) => setSkillLevelKey(event.target.value)}
                      fullWidth
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      <MenuItem value="">
                        <em>Select skill level</em>
                      </MenuItem>
                      {skillLevels.map((entry) => (
                        <MenuItem key={entry.key} value={entry.key}>
                          {entry.label}
                        </MenuItem>
                      ))}
                    </AppTextField>
                  </Stack>
                  <Divider />
                </Stack>
                <AppTextField
                  select
                  label="Head Judge"
                  value={headJudgeStaffId}
                  onChange={(event) => setHeadJudgeStaffId(event.target.value)}
                  fullWidth
                  slotProps={{
                    inputLabel: { sx: fieldLabelSx },
                  }}
                >
                  <MenuItem value="">
                    <em>Select a Head Judge</em>
                  </MenuItem>
                  {judgeChoices(headJudgeStaffId, new Set()).map((option) => (
                    <MenuItem key={option.staffId} value={option.staffId}>
                      {option.label}
                    </MenuItem>
                  ))}
                </AppTextField>
                <AppTextField
                  select
                  label="Number of Scoring Judges"
                  value={scoringJudgeCount === null ? '' : String(scoringJudgeCount)}
                  onChange={(event) => handleScoringJudgeCountChange(event.target.value)}
                  fullWidth
                  slotProps={{
                    inputLabel: { sx: fieldLabelSx },
                  }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="7">7</MenuItem>
                </AppTextField>
                {scoringJudgeIds.map((staffId, index) => {
                  const excluded = new Set(
                    scoringJudgeIds.filter((id, rowIndex) => rowIndex !== index && id !== ''),
                  );
                  return (
                    <AppTextField
                      key={`scoring-judge-${index}`}
                      select
                      label="Select a Judge"
                      value={staffId}
                      onChange={(event) => handleScoringJudgeChange(index, event.target.value)}
                      fullWidth
                      slotProps={{
                        inputLabel: { sx: fieldLabelSx },
                        htmlInput: { 'aria-label': `Select a Judge ${index + 1}` },
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a Judge</em>
                      </MenuItem>
                      {judgeChoices(staffId, excluded).map((option) => (
                        <MenuItem key={option.staffId} value={option.staffId}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </AppTextField>
                  );
                })}
              </>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!canSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
