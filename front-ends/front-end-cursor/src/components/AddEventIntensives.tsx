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
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import {
  createEmptyEventIntensive,
  getEventIntensiveDisplayName,
  type EventIntensiveFormState,
} from '../lib/eventIntensives';
import EventIntensiveSortableAccordion from './EventIntensiveSortableAccordion';

const intensivesModeToggleSx = {
  ...mobileColumnSx,
  '& .MuiToggleButton-root': {
    flex: 1,
    py: 1,
    px: { xs: 0.5, md: 1.5 },
    fontSize: { xs: '0.75rem', md: '0.875rem' },
    lineHeight: 1.2,
    whiteSpace: 'normal',
  },
} as const;

export type EventIntensivesSummary = {
  hasIntensives: boolean;
  intensiveCount: number;
};

type AddEventIntensivesProps = {
  onFieldEdit?: () => void;
  onSummaryChange?: (summary: EventIntensivesSummary) => void;
};

type HasIntensivesValue = 'yes' | 'no';

export default function AddEventIntensives({
  onFieldEdit,
  onSummaryChange,
}: AddEventIntensivesProps) {
  const [hasIntensives, setHasIntensives] = useState(false);
  const [intensives, setIntensives] = useState<EventIntensiveFormState[]>([]);
  const [expandedIntensiveId, setExpandedIntensiveId] = useState<string | false>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteNameRef = useRef('');
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const intensiveIds = intensives.map((intensive) => intensive.id);

  useEffect(() => {
    onSummaryChange?.({ hasIntensives, intensiveCount: intensives.length });
  }, [hasIntensives, intensives.length, onSummaryChange]);

  useEffect(() => {
    reportExport('intensives', { hasIntensives, intensives });
  }, [hasIntensives, intensives, reportExport]);

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    setHasIntensives(appliedImport.intensives.hasIntensives);
    setIntensives(appliedImport.intensives.intensives);
    setExpandedIntensiveId(false);
    setPendingDeleteId(null);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

  const updateIntensive = (
    id: string,
    patch: Partial<Pick<EventIntensiveFormState, 'name' | 'instructors' | 'cost' | 'dateTime'>>,
  ) => {
    setIntensives((current) =>
      current.map((intensive) => (intensive.id === id ? { ...intensive, ...patch } : intensive)),
    );
    onFieldEdit?.();
  };

  const handleHasIntensivesChange = (
    _event: MouseEvent<HTMLElement>,
    nextValue: HasIntensivesValue | null,
  ) => {
    if (nextValue === null) {
      return;
    }

    const enabled = nextValue === 'yes';
    setHasIntensives(enabled);
    if (!enabled) {
      setExpandedIntensiveId(false);
    }
    onFieldEdit?.();
  };

  const handleAddIntensive = () => {
    if (!hasIntensives) {
      return;
    }

    const nextIntensive = createEmptyEventIntensive();
    setIntensives((current) => [...current, nextIntensive]);
    setExpandedIntensiveId(nextIntensive.id);
    onFieldEdit?.();
  };

  const handleAccordionChange =
    (intensiveId: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpandedIntensiveId(isExpanded ? intensiveId : false);
    };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setIntensives((current) => {
      const oldIndex = current.findIndex((intensive) => intensive.id === active.id);
      const newIndex = current.findIndex((intensive) => intensive.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
    onFieldEdit?.();
  };

  const requestDelete = (id: string) => {
    const intensive = intensives.find((item) => item.id === id);
    pendingDeleteNameRef.current = getEventIntensiveDisplayName(intensive?.name ?? '');
    setPendingDeleteId(id);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const confirmDelete = () => {
    if (pendingDeleteId === null) {
      return;
    }

    setIntensives((current) => current.filter((intensive) => intensive.id !== pendingDeleteId));
    setExpandedIntensiveId((current) => (current === pendingDeleteId ? false : current));
    setPendingDeleteId(null);
    onFieldEdit?.();
  };

  return (
    <Box sx={mobileColumnSx}>
      <Stack spacing={1.5}>
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={hasIntensives ? 'yes' : 'no'}
          onChange={handleHasIntensivesChange}
          aria-label="Intensive workshops"
          sx={intensivesModeToggleSx}
        >
          <ToggleButton value="no" aria-label="No-Intensives">
            No-Intensives
          </ToggleButton>
          <ToggleButton value="yes" aria-label="Yes-Intensives">
            Yes-Intensives
          </ToggleButton>
        </ToggleButtonGroup>

        {hasIntensives && intensives.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={intensiveIds} strategy={verticalListSortingStrategy}>
              <Stack spacing={1.5}>
                {intensives.map((intensive) => (
                  <EventIntensiveSortableAccordion
                    key={intensive.id}
                    intensive={intensive}
                    expanded={expandedIntensiveId === intensive.id}
                    onAccordionChange={handleAccordionChange(intensive.id)}
                    onChange={updateIntensive}
                    onDelete={requestDelete}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        ) : null}

        {hasIntensives ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleAddIntensive}>
              Add New Intensive
            </Button>
          </Box>
        ) : null}
      </Stack>

      <Dialog
        open={pendingDeleteId !== null}
        onClose={cancelDelete}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-intensive-title"
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
          <DialogContentText id="delete-intensive-title">
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
