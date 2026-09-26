import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type SyntheticEvent } from 'react';
import {
  getEventPassDisplayName,
  sanitizePassCostInput,
  type EventPassFormState,
} from '../lib/eventPasses';
import AppTextField from './AppTextField';
import DragHandleIcon from './DragHandleIcon';

const accordionSummarySx = {
  px: 2,
  minHeight: 48,
  '& .MuiAccordionSummary-content': {
    my: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    minWidth: 0,
  },
} as const;

type EventPassSortableAccordionProps = {
  pass: EventPassFormState;
  expanded: boolean;
  disabled?: boolean;
  onAccordionChange: (event: SyntheticEvent, isExpanded: boolean) => void;
  onChange: (
    id: string,
    patch: Partial<Pick<EventPassFormState, 'name' | 'cost' | 'description'>>,
  ) => void;
};

export default function EventPassSortableAccordion({
  pass,
  expanded,
  disabled = false,
  onAccordionChange,
  onChange,
}: EventPassSortableAccordionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: pass.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const displayTitle = getEventPassDisplayName(pass.name);

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion
        expanded={disabled ? false : expanded}
        onChange={disabled ? undefined : onAccordionChange}
        disabled={disabled}
        disableGutters
        elevation={0}
        variant="outlined"
        sx={{ width: '100%', overflow: 'hidden' }}
      >
        <AccordionSummary
          aria-controls={`${pass.id}-content`}
          id={`${pass.id}-header`}
          sx={accordionSummarySx}
        >
          <Box
            {...attributes}
            {...listeners}
            onClick={(event) => event.stopPropagation()}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: '0 0 auto',
              color: disabled ? 'action.disabled' : 'text.secondary',
              cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
              pointerEvents: disabled ? 'none' : 'auto',
            }}
            aria-label={`Drag to reorder ${displayTitle}`}
          >
            <DragHandleIcon fontSize="small" />
          </Box>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: 600, minWidth: 0 }}
          >
            {displayTitle}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
          <Stack spacing={2}>
            <AppTextField
              label="Name"
              value={pass.name}
              onChange={(event) => onChange(pass.id, { name: event.target.value })}
              fullWidth
            />
            <AppTextField
              label="Cost"
              value={pass.cost}
              onChange={(event) =>
                onChange(pass.id, { cost: sanitizePassCostInput(event.target.value) })
              }
              fullWidth
              slotProps={{
                htmlInput: {
                  inputMode: 'decimal',
                  min: 0,
                },
              }}
            />
            <AppTextField
              label="Description"
              value={pass.description}
              onChange={(event) => onChange(pass.id, { description: event.target.value })}
              placeholder="This pass comes with abc, and xyz..."
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
