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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useCallback, useEffect, useState } from 'react';
import { fetchSortedStaticListEntries, type StaticListEntry } from '../api/postgrest';
import { useMessages } from '../hooks/useMessages';
import {
  WSDC_SKILL_LEVELS_LIST_CODE,
  WSDC_SWING_DIVISIONS_LIST_CODE,
} from '../lib/staticList';
import {
  countOtherContestsWithPair,
  createEmptySwingDanceContest,
  getSaveBlockingContestIds,
  hasSaveBlockingDuplicatePairs,
  swingDanceContestSetToJson,
  type SwingDanceContestFormState,
} from '../lib/swingDanceContest';
import AppTextField from './AppTextField';
import SwingDanceContest from './SwingDanceContest';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

export default function SwingDanceContestSet() {
  const isMobile = useIsMobileDevice();
  const { showWarning, showProblem } = useMessages();
  const [contests, setContests] = useState<SwingDanceContestFormState[]>([
    createEmptySwingDanceContest(),
  ]);
  const [danceOptions, setDanceOptions] = useState<StaticListEntry[]>([]);
  const [levelOptions, setLevelOptions] = useState<StaticListEntry[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [generatedJson, setGeneratedJson] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    let cancelled = false;

    setLoadingLists(true);
    setListError(null);

    Promise.all([
      fetchSortedStaticListEntries(WSDC_SWING_DIVISIONS_LIST_CODE, 'swing divisions'),
      fetchSortedStaticListEntries(WSDC_SKILL_LEVELS_LIST_CODE, 'skill levels'),
    ])
      .then(([dances, levels]) => {
        if (cancelled) {
          return;
        }

        setDanceOptions(dances);
        setLevelOptions(levels);
      })
      .catch((error) => {
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
  }, []);

  const contestIds = contests.map((contest) => contest.id);

  const handleContestChange = useCallback(
    (
      id: string,
      next: SwingDanceContestFormState,
      options?: { checkDuplicates?: boolean },
    ) => {
      setContests((current) => {
        if (options?.checkDuplicates) {
          const duplicateCount = countOtherContestsWithPair(
            current,
            id,
            next.danceKey,
            next.levelKey,
          );

          if (duplicateCount > 0) {
            showWarning(
              'This dance and level combination already exists. You can keep it if you give each contest a different title.',
            );
          }
        }

        return current.map((contest) => (contest.id === id ? next : contest));
      });

      if (options?.checkDuplicates) {
        setHighlightedIds(new Set());
      }
    },
    [showWarning],
  );

  const handleContestDelete = useCallback((id: string) => {
    setContests((current) => current.filter((contest) => contest.id !== id));
    setHighlightedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const handleAddContest = () => {
    setContests((current) => [...current, createEmptySwingDanceContest()]);
    setHighlightedIds(new Set());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setContests((current) => {
      const oldIndex = current.findIndex((contest) => contest.id === active.id);
      const newIndex = current.findIndex((contest) => contest.id === over.id);

      if (oldIndex < 0 || newIndex < 0) {
        return current;
      }

      return arrayMove(current, oldIndex, newIndex);
    });
  };

  const handleSave = () => {
    if (hasSaveBlockingDuplicatePairs(contests)) {
      const blockingIds = getSaveBlockingContestIds(contests);
      setHighlightedIds(blockingIds);
      showProblem(
        'Duplicate dance and level combinations must have unique titles. Change a dropdown or give each matching contest a different title.',
      );
      return;
    }

    const json = swingDanceContestSetToJson(contests, danceOptions, levelOptions);

    if (json.length === 0) {
      showProblem('Add at least one contest with a swing event and level selected.');
      return;
    }

    setGeneratedJson(JSON.stringify(json, null, 2));
    setJsonDialogOpen(true);
    setHighlightedIds(new Set());
  };

  if (loadingLists) {
    return (
      <Stack sx={{ py: 4, alignItems: 'center' }}>
        <CircularProgress size={32} />
      </Stack>
    );
  }

  if (listError) {
    return (
      <Typography variant="body2" color="error" sx={{ py: 2 }}>
        {listError}
      </Typography>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={contestIds} strategy={verticalListSortingStrategy}>
            <Stack spacing={2}>
              {contests.map((contest) => (
                <SwingDanceContest
                  key={contest.id}
                  contest={contest}
                  danceOptions={danceOptions}
                  levelOptions={levelOptions}
                  duplicateHighlight={highlightedIds.has(contest.id)}
                  onChange={handleContestChange}
                  onDelete={handleContestDelete}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>

        {contests.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No contests yet. Add one below.
          </Typography>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleAddContest}>
            + Add
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Stack>

      <Dialog
        open={jsonDialogOpen}
        onClose={() => setJsonDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Contest JSON</DialogTitle>
        <DialogContent>
          <AppTextField
            value={generatedJson}
            multiline
            minRows={12}
            fullWidth
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ flexDirection: isMobile ? 'column' : 'row', gap: 1, px: 3, pb: 2 }}>
          <Button onClick={() => setJsonDialogOpen(false)} fullWidth={isMobile}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
