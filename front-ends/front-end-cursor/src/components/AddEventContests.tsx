import {
  Box,
  Button,
  CircularProgress,
  Dialog,
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
  type EventContestDraft,
  type EventContestsState,
  type StaticListEntry,
} from '../api/postgrest';
import { mobileColumnSx } from '../constants/layout';
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
  const [divisions, setDivisions] = useState<StaticListEntry[]>([]);
  const [skillLevels, setSkillLevels] = useState<StaticListEntry[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [listsLoaded, setListsLoaded] = useState(false);

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
    if (eventId === null) {
      setLoadingSaved(false);
      setLoaded(true);
      return;
    }

    let cancelled = false;
    setLoadingSaved(true);

    void fetchEventMoreJson(eventId)
      .then((moreJson) => {
        if (cancelled || dirtyRef.current) {
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
    setDialogOpen(true);
  };

  const handleEditContest = (contest: EventContestDraft) => {
    setEditingContestId(contest.id);
    setDivisionKey(contest.divisionKey);
    setSkillLevelKey(contest.skillLevelKey);
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

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleAddContest} disabled={!hasContests}>
            Add Contest
          </Button>
        </Box>
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
                <AppTextField
                  select
                  label="Swing Division"
                  value={divisionKey}
                  onChange={(event) => setDivisionKey(event.target.value)}
                  fullWidth
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
