import {
  Box,
  Button,
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type MouseEvent, type SyntheticEvent, useState } from 'react';
import { mobileColumnSx } from '../constants/layout';
import {
  createDefaultEventPass,
  createEmptyEventPass,
  type EventPassFormState,
} from '../lib/eventPasses';
import EventPassSortableAccordion from './EventPassSortableAccordion';

const passFieldsColumnSx = mobileColumnSx;

type AddEventPassesProps = {
  onFieldEdit?: () => void;
};

type HasPassesValue = 'yes' | 'no';

export default function AddEventPasses({ onFieldEdit }: AddEventPassesProps) {
  const [hasPasses, setHasPasses] = useState(false);
  const [passes, setPasses] = useState<EventPassFormState[]>(() => [createDefaultEventPass()]);
  const [expandedPassId, setExpandedPassId] = useState<string | false>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const passIds = passes.map((pass) => pass.id);

  const updatePass = (
    id: string,
    patch: Partial<Pick<EventPassFormState, 'name' | 'cost' | 'description'>>,
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

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={passIds} strategy={verticalListSortingStrategy}>
            <Stack spacing={1.5}>
              {passes.map((pass) => (
                <EventPassSortableAccordion
                  key={pass.id}
                  pass={pass}
                  expanded={hasPasses && expandedPassId === pass.id}
                  disabled={!hasPasses}
                  onAccordionChange={handleAccordionChange(pass.id)}
                  onChange={updatePass}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleAddPass} disabled={!hasPasses}>
            Add new pass
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
