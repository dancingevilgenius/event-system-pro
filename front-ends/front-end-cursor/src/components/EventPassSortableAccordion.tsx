import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  IconButton,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type ReactNode, type SyntheticEvent } from 'react';
import {
  formatEarlyBirdDate,
  savedEarlyBirdName,
  type PricedEarlyBirdWindow,
} from '../lib/eventEarlyBirdDates';
import {
  getEventPassDisplayName,
  PASS_COST_MAX_DIGITS,
  sanitizePassCostInput,
  SPECTATOR_PASS_TOOLTIP,
  type EventPassFormState,
} from '../lib/eventPasses';
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

const earlyBirdCostRowSx = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 1fr) auto',
  columnGap: 1,
  alignItems: 'center',
  width: '100%',
  minWidth: 0,
} as const;

const earlyBirdCostTextSx = {
  minWidth: 0,
  overflowWrap: 'anywhere',
  lineHeight: 1.2,
  fontSize: { xs: '0.75rem', md: '0.875rem' },
} as const;

type EventPassSortableAccordionProps = {
  pass: EventPassFormState;
  earlyBirdWindows: PricedEarlyBirdWindow[];
  expanded: boolean;
  disabled?: boolean;
  onAccordionChange: (event: SyntheticEvent, isExpanded: boolean) => void;
  onChange: (
    id: string,
    patch: Partial<
      Pick<EventPassFormState, 'name' | 'cost' | 'description' | 'earlyBirdCosts' | 'spectator'>
    >,
  ) => void;
  onDelete: (id: string) => void;
};

/** Outlined padding plus four digits, and no wider. */
const passCostInputSx = {
  width: 'calc(4ch + 1.75rem)',
  flex: '0 0 auto',
} as const;

function passCostFieldProps(ariaLabel: string) {
  return {
    htmlInput: {
      inputMode: 'numeric' as const,
      min: 0,
      maxLength: PASS_COST_MAX_DIGITS,
      'aria-label': ariaLabel,
    },
  };
}

function SpectatorPassCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Tooltip title={SPECTATOR_PASS_TOOLTIP}>
      <FormControlLabel
        sx={{ ml: 0.25, mr: 0, flex: '0 0 auto' }}
        control={
          <Checkbox
            size="small"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            slotProps={{
              input: { 'aria-label': 'Spectator' },
            }}
            sx={{ p: 0.5 }}
          />
        }
        label={
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Spectator
          </Typography>
        }
      />
    </Tooltip>
  );
}

function PassCostAmount({ children }: { children: ReactNode }) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', width: 'fit-content', maxWidth: '100%' }}>
      <Typography
        variant="body2"
        component="span"
        sx={{ flex: '0 0 auto', fontSize: { xs: '0.75rem', md: '0.875rem' } }}
      >
        $USD
      </Typography>
      {children}
    </Stack>
  );
}

export default function EventPassSortableAccordion({
  pass,
  earlyBirdWindows,
  expanded,
  disabled = false,
  onAccordionChange,
  onChange,
  onDelete,
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
  const dragLabel = displayTitle.length > 0 ? displayTitle : 'pass';
  const earlyBirdCosts = pass.earlyBirdCosts ?? {};
  const showEarlyBirdCosts = earlyBirdWindows.length > 0;
  const spectatorChecked = pass.spectator === true;
  const spectatorCheckbox = (
    <SpectatorPassCheckbox
      checked={spectatorChecked}
      onChange={(spectator) => onChange(pass.id, { spectator })}
    />
  );

  return (
    <div ref={setNodeRef} style={style}>
      <Box sx={{ position: 'relative' }}>
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
            aria-label={`Drag to reorder ${dragLabel}`}
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
              onBlur={() => onChange(pass.id, { name: trimSavedText(pass.name) })}
              fullWidth
            />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {spectatorCheckbox}
            </Box>
            {showEarlyBirdCosts ? (
              <Stack spacing={1}>
                <Box sx={earlyBirdCostRowSx}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Name
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Start Date
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    End Date
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Cost
                  </Typography>
                </Box>
                {earlyBirdWindows.map((window) => {
                  const windowName = savedEarlyBirdName(window.name, window.index);
                  const startLabel = formatEarlyBirdDate(window.startDate);
                  const endLabel = formatEarlyBirdDate(window.endDate);
                  const cost = sanitizePassCostInput(earlyBirdCosts[window.id] ?? '');
                  return (
                    <Box key={window.id} sx={earlyBirdCostRowSx}>
                      <Typography variant="body2" title={windowName} sx={earlyBirdCostTextSx}>
                        {windowName}
                      </Typography>
                      <Typography
                        variant="body2"
                        title={startLabel || undefined}
                        sx={earlyBirdCostTextSx}
                      >
                        {startLabel || '—'}
                      </Typography>
                      <Typography
                        variant="body2"
                        title={endLabel || undefined}
                        sx={earlyBirdCostTextSx}
                      >
                        {endLabel || '—'}
                      </Typography>
                      <PassCostAmount>
                        <AppTextField
                          value={cost}
                          onChange={(event) =>
                            onChange(pass.id, {
                              earlyBirdCosts: {
                                ...earlyBirdCosts,
                                [window.id]: sanitizePassCostInput(event.target.value),
                              },
                            })
                          }
                          onBlur={(event) =>
                            onChange(pass.id, {
                              earlyBirdCosts: {
                                ...earlyBirdCosts,
                                [window.id]: sanitizePassCostInput(event.target.value),
                              },
                            })
                          }
                          size="small"
                          sx={passCostInputSx}
                          slotProps={passCostFieldProps(`${windowName} cost in USD`)}
                        />
                      </PassCostAmount>
                    </Box>
                  );
                })}
              </Stack>
            ) : (
              <PassCostAmount>
                <AppTextField
                  label="Cost"
                  value={sanitizePassCostInput(pass.cost)}
                  onChange={(event) =>
                    onChange(pass.id, { cost: sanitizePassCostInput(event.target.value) })
                  }
                  onBlur={() => onChange(pass.id, { cost: sanitizePassCostInput(pass.cost) })}
                  sx={passCostInputSx}
                  slotProps={passCostFieldProps('Cost in USD')}
                />
              </PassCostAmount>
            )}
            <AppTextField
              label="Description"
              value={pass.description}
              onChange={(event) => onChange(pass.id, { description: event.target.value })}
              onBlur={() => onChange(pass.id, { description: trimSavedText(pass.description) })}
              placeholder="This pass comes with abc, and xyz..."
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      {disabled ? null : (
        <IconButton
          aria-label={`Delete ${dragLabel}`}
          size="small"
          onClick={() => onDelete(pass.id)}
          sx={{ position: 'absolute', top: 6, right: 4, zIndex: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
      </Box>
    </div>
  );
}
