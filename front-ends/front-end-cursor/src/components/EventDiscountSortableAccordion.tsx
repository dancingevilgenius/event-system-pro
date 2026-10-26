import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type MouseEvent, type SyntheticEvent } from 'react';
import {
  discountValueLabel,
  getEventDiscountDisplayName,
  type DiscountValueKind,
  type EventDiscountFormState,
} from '../lib/eventDiscounts';
import { sanitizePassCostInput } from '../lib/eventPasses';
import { trimSavedText } from '../utils/trimSavedText';
import AppTextField from './AppTextField';
import DeleteIcon from './DeleteIcon';
import DragHandleIcon from './DragHandleIcon';

const accordionSummarySx = {
  pl: 2,
  pr: 7,
  minHeight: 48,
  '& .MuiAccordionSummary-content': {
    my: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    minWidth: 0,
  },
} as const;

type EventDiscountSortableAccordionProps = {
  discount: EventDiscountFormState;
  expanded: boolean;
  onAccordionChange: (event: SyntheticEvent, isExpanded: boolean) => void;
  onChange: (
    id: string,
    patch: Partial<Pick<EventDiscountFormState, 'name' | 'valueKind' | 'value' | 'description'>>,
  ) => void;
  onDelete: (id: string) => void;
};

export default function EventDiscountSortableAccordion({
  discount,
  expanded,
  onAccordionChange,
  onChange,
  onDelete,
}: EventDiscountSortableAccordionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: discount.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const displayTitle = getEventDiscountDisplayName(discount.name);
  const valueLabel = discountValueLabel(discount.valueKind);

  const handleValueKindChange = (
    _event: MouseEvent<HTMLElement>,
    nextKind: DiscountValueKind | null,
  ) => {
    if (nextKind === null) {
      return;
    }

    onChange(discount.id, { valueKind: nextKind });
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Box sx={{ position: 'relative' }}>
        <Accordion
          expanded={expanded}
          onChange={onAccordionChange}
          disableGutters
          elevation={0}
          variant="outlined"
          sx={{ width: '100%', overflow: 'hidden' }}
        >
          <AccordionSummary
            aria-controls={`${discount.id}-content`}
            id={`${discount.id}-header`}
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
                color: 'text.secondary',
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              aria-label={`Drag to reorder ${displayTitle}`}
            >
              <DragHandleIcon fontSize="small" />
            </Box>
            <Typography
              variant="subtitle1"
              component="span"
              sx={{
                fontWeight: 600,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayTitle}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Stack spacing={2}>
              <AppTextField
                label="Name"
                value={discount.name}
                onChange={(event) => onChange(discount.id, { name: event.target.value })}
                onBlur={() => onChange(discount.id, { name: trimSavedText(discount.name) })}
                fullWidth
              />
              <ToggleButtonGroup
                exclusive
                fullWidth
                size="small"
                value={discount.valueKind}
                onChange={handleValueKindChange}
                aria-label="Percent or amount"
              >
                <ToggleButton value="percent" aria-label="Percent">
                  Percent
                </ToggleButton>
                <ToggleButton value="amount" aria-label="Amount">
                  Amount
                </ToggleButton>
              </ToggleButtonGroup>
              <AppTextField
                label={valueLabel}
                value={discount.value}
                onChange={(event) =>
                  onChange(discount.id, { value: sanitizePassCostInput(event.target.value) })
                }
                onBlur={() => onChange(discount.id, { value: trimSavedText(discount.value) })}
                fullWidth
                slotProps={{
                  htmlInput: {
                    inputMode: 'decimal',
                    'aria-label': valueLabel,
                  },
                }}
              />
              <AppTextField
                label="Description"
                value={discount.description}
                onChange={(event) => onChange(discount.id, { description: event.target.value })}
                onBlur={() =>
                  onChange(discount.id, { description: trimSavedText(discount.description) })
                }
                multiline
                minRows={3}
                fullWidth
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
        <IconButton
          aria-label={`Delete ${displayTitle}`}
          size="small"
          onClick={() => onDelete(discount.id)}
          sx={{ position: 'absolute', top: 6, right: 4, zIndex: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </div>
  );
}
