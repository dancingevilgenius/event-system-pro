import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
import {
  fetchContestRoster,
  saveContestRoster,
  type ContestRosterPerson,
  type ContestRosterRole,
  type UpcomingRegistrationContest,
} from '../api/postgrest';

const LEADER_DROP_ID = 'roster-drop-leader';
const FOLLOWER_DROP_ID = 'roster-drop-follower';

const rosterCollision: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }
  return rectIntersection(args);
};

function rosterFullName(person: ContestRosterPerson): string {
  const name = [person.firstName, person.lastName].filter((part) => part.trim() !== '').join(' ');
  return name === '' ? 'Unnamed competitor' : name;
}

function contestDialogTitle(contest: UpcomingRegistrationContest): string {
  return [contest.eventName, contest.skillLevelLabel, contest.divisionLabel]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' · ');
}

function peopleInRole(people: ContestRosterPerson[], role: ContestRosterRole): ContestRosterPerson[] {
  return people.filter((person) => person.role === role);
}

type RosterColumnProps = {
  dropId: string;
  title: string;
  people: ContestRosterPerson[];
  saving: boolean;
  onScratch: (person: ContestRosterPerson) => void;
};

function RosterName({
  person,
  saving,
}: {
  person: ContestRosterPerson;
  saving: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: person.id,
    disabled: saving,
    data: { role: person.role },
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        flex: 1,
        minWidth: 0,
        py: 0.75,
        cursor: saving ? 'default' : 'grab',
        touchAction: 'none',
        opacity: isDragging ? 0.35 : 1,
      }}
    >
      <Typography variant="body2">{rosterFullName(person)}</Typography>
    </Box>
  );
}

function RosterColumn({ dropId, title, people, saving, onScratch }: RosterColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: dropId, disabled: saving });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: { xs: 180, md: 240 },
        p: { xs: 1.5, md: 2 },
        borderRadius: 1,
        border: 1,
        borderColor: isOver ? 'primary.main' : 'divider',
        bgcolor: isOver ? 'action.hover' : 'background.paper',
      }}
    >
      <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={1}>
        {people.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            None registered
          </Typography>
        ) : (
          people.map((person) => (
            <Stack
              key={person.id}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <RosterName person={person} saving={saving} />
              <Button
                type="button"
                size="small"
                variant="outlined"
                disabled={saving}
                onClick={() => onScratch(person)}
                aria-label={`Scratch ${rosterFullName(person)}`}
                sx={{ flexShrink: 0, textTransform: 'none' }}
              >
                Scratch
              </Button>
            </Stack>
          ))
        )}
      </Stack>
    </Box>
  );
}

type RegistrationContestRosterDialogProps = {
  contest: UpcomingRegistrationContest | null;
  onClose: () => void;
  onCountsChange: (contestId: string, leaderCount: number, followerCount: number) => void;
};

export default function RegistrationContestRosterDialog({
  contest,
  onClose,
  onCountsChange,
}: RegistrationContestRosterDialogProps) {
  const [people, setPeople] = useState<ContestRosterPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scratchTarget, setScratchTarget] = useState<ContestRosterPerson | null>(null);
  const scratchPromptRef = useRef('Do you really want to scratch this competitor?');
  if (scratchTarget) {
    scratchPromptRef.current = `Do you really want to scratch ${rosterFullName(scratchTarget)}?`;
  }
  const [activeId, setActiveId] = useState<string | null>(null);
  const contestRef = useRef(contest);
  contestRef.current = contest;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const contestId = contest?.id ?? null;

  useEffect(() => {
    const requested = contestRef.current;
    if (!requested || contestId === null) {
      setPeople([]);
      setError(null);
      setScratchTarget(null);
      setActiveId(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setPeople([]);
    setScratchTarget(null);

    void fetchContestRoster(requested)
      .then((rows) => {
        if (cancelled) {
          return;
        }
        setPeople(rows);
        onCountsChange(
          requested.id,
          peopleInRole(rows, 'leader').length,
          peopleInRole(rows, 'follower').length,
        );
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setPeople([]);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load contest roster.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contestId, onCountsChange]);

  const activePerson = people.find((person) => person.id === activeId) ?? null;

  async function persist(next: ContestRosterPerson[], previous: ContestRosterPerson[]) {
    if (!contest) {
      return;
    }
    setPeople(next);
    onCountsChange(
      contest.id,
      peopleInRole(next, 'leader').length,
      peopleInRole(next, 'follower').length,
    );
    setSaving(true);
    setError(null);
    try {
      await saveContestRoster(contest, next);
      const fresh = await fetchContestRoster(contest);
      setPeople(fresh);
      onCountsChange(
        contest.id,
        peopleInRole(fresh, 'leader').length,
        peopleInRole(fresh, 'follower').length,
      );
    } catch (saveError: unknown) {
      setPeople(previous);
      onCountsChange(
        contest.id,
        peopleInRole(previous, 'leader').length,
        peopleInRole(previous, 'follower').length,
      );
      setError(saveError instanceof Error ? saveError.message : 'Unable to save contest roster.');
    } finally {
      setSaving(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    if (!contest || saving) {
      return;
    }
    const { active, over } = event;
    if (!over) {
      return;
    }
    const nextRole: ContestRosterRole | null =
      over.id === LEADER_DROP_ID ? 'leader' : over.id === FOLLOWER_DROP_ID ? 'follower' : null;
    if (!nextRole) {
      return;
    }
    const person = people.find((candidate) => candidate.id === active.id);
    if (!person || person.role === nextRole) {
      return;
    }
    const next = people.map((candidate) =>
      candidate.id === person.id ? { ...candidate, role: nextRole } : candidate,
    );
    void persist(next, people);
  }

  function confirmScratch() {
    if (!scratchTarget) {
      return;
    }
    const target = scratchTarget;
    setScratchTarget(null);
    const next = people.filter((person) => person.id !== target.id);
    void persist(next, people);
  }

  const leaders = peopleInRole(people, 'leader');
  const followers = peopleInRole(people, 'follower');

  return (
    <>
      <Dialog
        open={contest !== null}
        onClose={() => {
          if (!saving && scratchTarget === null) {
            onClose();
          }
        }}
        fullWidth
        maxWidth="md"
        aria-labelledby="contest-roster-title"
      >
        <DialogTitle id="contest-roster-title">
          {contest ? contestDialogTitle(contest) : 'Registered competitors'}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Stack direction="row" spacing={1} sx={{ py: 3, alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Loading roster…
              </Typography>
            </Stack>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={rosterCollision}
              onDragStart={(event) => setActiveId(String(event.active.id))}
              onDragCancel={() => setActiveId(null)}
              onDragEnd={handleDragEnd}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ pt: 0.5 }}>
                <RosterColumn
                  dropId={LEADER_DROP_ID}
                  title="Leaders"
                  people={leaders}
                  saving={saving}
                  onScratch={setScratchTarget}
                />
                <RosterColumn
                  dropId={FOLLOWER_DROP_ID}
                  title="Followers"
                  people={followers}
                  saving={saving}
                  onScratch={setScratchTarget}
                />
              </Stack>
              <DragOverlay zIndex={2000}>
                {activePerson ? (
                  <Typography
                    variant="body2"
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      boxShadow: 3,
                    }}
                  >
                    {rosterFullName(activePerson)}
                  </Typography>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
          {error ? (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          ) : null}
          {saving ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Saving roster…
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button type="button" onClick={onClose} disabled={saving}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={scratchTarget !== null}
        onClose={() => {
          if (!saving) {
            setScratchTarget(null);
          }
        }}
        fullWidth
        maxWidth="xs"
        aria-labelledby="scratch-roster-title"
      >
        <DialogTitle id="scratch-roster-title">Scratch competitor</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{scratchPromptRef.current}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button type="button" onClick={() => setScratchTarget(null)} disabled={saving}>
            No
          </Button>
          <Button type="button" variant="contained" onClick={confirmScratch} disabled={saving}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
