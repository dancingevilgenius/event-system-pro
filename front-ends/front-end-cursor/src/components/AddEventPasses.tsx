import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
import { type MouseEvent, type SyntheticEvent, useEffect, useRef, useState } from 'react';
import { mobileColumnSx } from '../constants/layout';
import {
  useAppliedEventImport,
  useEventFormExportSnapshots,
  useReportEventFormSection,
} from '../context/EventFormExportContext';
import { pricedEarlyBirdWindows } from '../lib/eventEarlyBirdDates';
import {
  createEmptyEventPass,
  getEventPassDisplayName,
  type EventPassFormState,
} from '../lib/eventPasses';
import EventPassSortableAccordion from './EventPassSortableAccordion';

const passFieldsColumnSx = mobileColumnSx;

export type EventPassesSummary = {
  hasPasses: boolean;
  passCount: number;
};

type AddEventPassesProps = {
  onFieldEdit?: () => void;
  onSummaryChange?: (summary: EventPassesSummary) => void;
};

type HasPassesValue = 'yes' | 'no';

export default function AddEventPasses({
  onFieldEdit,
  onSummaryChange,
}: AddEventPassesProps) {
  const [hasPasses, setHasPasses] = useState(false);
  const [passes, setPasses] = useState<EventPassFormState[]>(() => [createEmptyEventPass()]);
  const [expandedPassId, setExpandedPassId] = useState<string | false>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteNameRef = useRef('');
  const reportExport = useReportEventFormSection();
  const snapshots = useEventFormExportSnapshots();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);
  const earlyBirdWindows = pricedEarlyBirdWindows(
    snapshots.earlyBird?.mode,
    snapshots.earlyBird?.windows,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const passIds = passes.map((pass) => pass.id);

  useEffect(() => {
    onSummaryChange?.({ hasPasses, passCount: passes.length });
  }, [hasPasses, onSummaryChange, passes.length]);

  useEffect(() => {
    reportExport('passes', { hasPasses, passes });
  }, [hasPasses, passes, reportExport]);

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    setHasPasses(appliedImport.passes.hasPasses);
    setPasses(appliedImport.passes.passes);
    setExpandedPassId(false);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

  const updatePass = (
    id: string,
    patch: Partial<
      Pick<EventPassFormState, 'name' | 'cost' | 'description' | 'earlyBirdCosts' | 'spectator'>
    >,
  ) => {
    setPasses((current) =>
      current.map((pass) => (pass.id === id ? { ...pass, ...patch } : pass)),
    );
    onFieldEdit?.();
  };

  const handleHasPassesChange = (
    _event: MouseEvent<HTMLElement>,
    nextValue: HasPassesValue | null,
  ) => {
    if (nextValue === null) {
      return;
    }

    const enabled = nextValue === 'yes';
    setHasPasses(enabled);
    if (!enabled) {
      setExpandedPassId(false);
    }
    onFieldEdit?.();
  };

  const handleAddPass = () => {
    if (!hasPasses) {
      return;
    }

    const nextPass = createEmptyEventPass();
    setPasses((current) => [...current, nextPass]);
    setExpandedPassId(nextPass.id);
    onFieldEdit?.();
  };

  const handleAccordionChange =
    (passId: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpandedPassId(isExpanded ? passId : false);
    };

  const requestDelete = (id: string) => {
    const pass = passes.find((item) => item.id === id);
    const name = getEventPassDisplayName(pass?.name ?? '');
    pendingDeleteNameRef.current = name.length > 0 ? name : 'this pass';
    setPendingDeleteId(id);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const confirmDelete = () => {
    if (pendingDeleteId === null) {
      return;
    }

    setPasses((current) => current.filter((pass) => pass.id !== pendingDeleteId));
    setExpandedPassId((current) => (current === pendingDeleteId ? false : current));
    setPendingDeleteId(null);
    onFieldEdit?.();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setPasses((current) => {
      const oldIndex = current.findIndex((pass) => pass.id === active.id);
      const newIndex = current.findIndex((pass) => pass.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
    onFieldEdit?.();
  };

  return (
    <Box sx={passFieldsColumnSx}>
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>
            Has Passes
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={hasPasses ? 'yes' : 'no'}
            onChange={handleHasPassesChange}
            aria-label="Has Passes"
          >
            <ToggleButton value="no" aria-label="No">
              No
            </ToggleButton>
            <ToggleButton value="yes" aria-label="Yes">
              Yes
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {hasPasses ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={passIds} strategy={verticalListSortingStrategy}>
              <Stack spacing={1.5}>
                {passes.map((pass) => (
                  <EventPassSortableAccordion
                    key={pass.id}
                    pass={pass}
                    earlyBirdWindows={earlyBirdWindows}
                    expanded={expandedPassId === pass.id}
                    onAccordionChange={handleAccordionChange(pass.id)}
                    onChange={updatePass}
                    onDelete={requestDelete}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : null}

        {hasPasses ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleAddPass}>
              Add new pass
            </Button>
          </Box>
        ) : null}
      </Stack>

      <Dialog
        open={pendingDeleteId !== null}
        onClose={cancelDelete}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-pass-title"
      >
        <DialogTitle sx={{ position: 'relative', minHeight: 40, p: 1 }}>
          <IconButton
            aria-label="Close"
            onClick={cancelDelete}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-pass-title">
            {`Delete ${pendingDeleteNameRef.current}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 4, pt: 1, pb: 3 }}>
          <Button onClick={cancelDelete} sx={{ minWidth: 96 }}>
            No
          </Button>
          <Button variant="contained" onClick={confirmDelete} sx={{ minWidth: 96 }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
