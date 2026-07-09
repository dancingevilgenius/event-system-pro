import {
  Box,
  Button,
  Stack,
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
import { type SyntheticEvent, useState } from 'react';
import { mobileColumnSx } from '../constants/layout';
import {
  createDefaultEventPass,
  createEmptyEventPass,
  type EventPassFormState,
} from '../lib/eventPasses';
import EventPassSortableAccordion from './EventPassSortableAccordion';

const passFieldsColumnSx = mobileColumnSx;

type EventPassesProps = {
  onFieldEdit?: () => void;
};

export default function EventPasses({ onFieldEdit }: EventPassesProps) {
  const [passes, setPasses] = useState<EventPassFormState[]>(() => [createDefaultEventPass()]);
  const [expandedPassId, setExpandedPassId] = useState<string | false>(
    () => passes[0]?.id ?? false,
  );

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

  const handleAddPass = () => {
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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={passIds} strategy={verticalListSortingStrategy}>
            <Stack spacing={1.5}>
              {passes.map((pass) => (
                <EventPassSortableAccordion
                  key={pass.id}
                  pass={pass}
                  expanded={expandedPassId === pass.id}
                  onAccordionChange={handleAccordionChange(pass.id)}
                  onChange={updatePass}
                />
              ))}
            </Stack>
          </SortableContext>
        </DndContext>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleAddPass}>
            Add new pass
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
