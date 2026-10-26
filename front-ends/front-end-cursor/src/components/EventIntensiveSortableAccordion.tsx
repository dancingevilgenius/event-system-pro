import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type SyntheticEvent } from 'react';
import {
  getEventIntensiveDisplayName,
  intensiveCostLabel,
  sanitizeIntensiveCostInput,
  type EventIntensiveFormState,
} from '../lib/eventIntensives';
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
    width: '100%',
  },
} as const;

const titleGridSx = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) 5.5rem',
  columnGap: 1,
  alignItems: 'center',
  flex: '1 1 auto',
  minWidth: 0,
} as const;

const titleColumnSx = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

type EventIntensiveSortableAccordionProps = {
  intensive: EventIntensiveFormState;
  expanded: boolean;
  onAccordionChange: (event: SyntheticEvent, isExpanded: boolean) => void;
  onChange: (
    id: string,
    patch: Partial<Pick<EventIntensiveFormState, 'name' | 'instructors' | 'cost' | 'dateTime'>>,
  ) => void;
  onDelete: (id: string) => void;
};

export default function EventIntensiveSortableAccordion({
  intensive,
  expanded,
  onAccordionChange,
  onChange,
  onDelete,
}: EventIntensiveSortableAccordionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: intensive.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const displayTitle = getEventIntensiveDisplayName(intensive.name);
  const instructorsLabel = intensive.instructors.trim();
  const costLabel = intensiveCostLabel(intensive.cost);

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
            aria-controls={`${intensive.id}-content`}
            id={`${intensive.id}-header`}
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
            <Box sx={titleGridSx}>
              <Typography variant="subtitle1" component="span" sx={{ ...titleColumnSx, fontWeight: 600 }}>
                {displayTitle}
              </Typography>
              <Typography variant="subtitle1" component="span" sx={titleColumnSx}>
                {instructorsLabel}
              </Typography>
              <Typography variant="subtitle1" component="span" sx={titleColumnSx}>
                {costLabel}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
            <Stack spacing={2}>
              <AppTextField
                label="Name"
                value={intensive.name}
                onChange={(event) => onChange(intensive.id, { name: event.target.value })}
                onBlur={() => onChange(intensive.id, { name: trimSavedText(intensive.name) })}
                fullWidth
              />
              <AppTextField
                label="Instructors"
                value={intensive.instructors}
                onChange={(event) =>
                  onChange(intensive.id, { instructors: event.target.value })
                }
                onBlur={() =>
                  onChange(intensive.id, { instructors: trimSavedText(intensive.instructors) })
                }
                fullWidth
              />
              <AppTextField
                label="Cost"
                value={sanitizeIntensiveCostInput(intensive.cost)}
                onChange={(event) =>
                  onChange(intensive.id, { cost: sanitizeIntensiveCostInput(event.target.value) })
                }
                onBlur={() =>
                  onChange(intensive.id, { cost: sanitizeIntensiveCostInput(intensive.cost) })
                }
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                  htmlInput: {
                    inputMode: 'numeric',
                    min: 0,
                    'aria-label': 'Cost',
                  },
                }}
              />
              <AppTextField
                label="Date"
                type="datetime-local"
                value={intensive.dateTime}
                onChange={(event) => onChange(intensive.id, { dateTime: event.target.value })}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    'aria-label': 'Date with hour and minute',
                  },
                }}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
        <IconButton
          aria-label={`Delete ${displayTitle}`}
          size="small"
          onClick={() => onDelete(intensive.id)}
          sx={{ position: 'absolute', top: 6, right: 4, zIndex: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </div>
  );
}
