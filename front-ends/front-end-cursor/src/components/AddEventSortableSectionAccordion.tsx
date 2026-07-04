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
import { type ReactNode, type SyntheticEvent } from 'react';
import AddEventSectionStatusIcon from './AddEventSectionStatusIcon';
import AddEventSectionStatusToggle, {
  type AddEventSectionStatus,
} from './AddEventSectionStatusToggle';
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

type AddEventSortableSectionAccordionProps = {
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string;
  expanded: boolean;
  onAccordionChange: (event: SyntheticEvent, isExpanded: boolean) => void;
  sectionContent: ReactNode;
  sectionStatus: AddEventSectionStatus;
  onStatusChange: (status: AddEventSectionStatus) => void;
  disabledStatuses?: AddEventSectionStatus[];
  showStatusToggle?: boolean;
};

export default function AddEventSortableSectionAccordion({
  sectionId,
  sectionTitle,
  sectionDescription,
  expanded,
  onAccordionChange,
  sectionContent,
  sectionStatus,
  onStatusChange,
  disabledStatuses,
  showStatusToggle = true,
}: AddEventSortableSectionAccordionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion
        expanded={expanded}
        onChange={onAccordionChange}
        disableGutters
        elevation={0}
        variant="outlined"
        sx={{ width: '100%', overflow: 'hidden' }}
      >
        <AccordionSummary
          aria-controls={`${sectionId}-content`}
          id={`${sectionId}-header`}
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
            aria-label={`Drag to reorder ${sectionTitle}`}
          >
            <DragHandleIcon fontSize="small" />
          </Box>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: 600, minWidth: 0 }}
          >
            {sectionTitle}
          </Typography>
          <AddEventSectionStatusIcon status={sectionStatus} sectionTitle={sectionTitle} />
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
          <Stack spacing={2}>
            {sectionContent ?? (
              <Typography variant="body2" color="text.secondary">
                {sectionDescription}
              </Typography>
            )}
            {showStatusToggle ? (
              <AddEventSectionStatusToggle
                value={sectionStatus}
                onChange={onStatusChange}
                disabledStatuses={disabledStatuses}
                aria-label={`${sectionTitle} status`}
              />
            ) : null}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
