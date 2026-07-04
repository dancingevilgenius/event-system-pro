import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { type MouseEvent } from 'react';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

export type AddEventSectionStatus = 'not_started' | 'in_progress' | 'finalized';

const STATUS_OPTIONS: { value: AddEventSectionStatus; label: string }[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'finalized', label: 'Finalized' },
];

const toggleGroupSx = {
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  '& .MuiToggleButton-root': {
    flex: 1,
    py: 1,
    px: { xs: 0.5, sm: 1.5 },
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    lineHeight: 1.2,
    whiteSpace: 'normal',
  },
} as const;

type AddEventSectionStatusToggleProps = {
  value: AddEventSectionStatus;
  onChange: (status: AddEventSectionStatus) => void;
  disabledStatuses?: AddEventSectionStatus[];
  'aria-label'?: string;
};

export default function AddEventSectionStatusToggle({
  value,
  onChange,
  disabledStatuses,
  'aria-label': ariaLabel = 'Section status',
}: AddEventSectionStatusToggleProps) {
  const handleChange = (
    _event: MouseEvent<HTMLElement>,
    nextValue: AddEventSectionStatus | null,
  ) => {
    if (nextValue !== null) {
      onChange(nextValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      fullWidth
      onChange={handleChange}
      aria-label={ariaLabel}
      sx={toggleGroupSx}
    >
      {STATUS_OPTIONS.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
          disabled={disabledStatuses?.includes(option.value)}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
