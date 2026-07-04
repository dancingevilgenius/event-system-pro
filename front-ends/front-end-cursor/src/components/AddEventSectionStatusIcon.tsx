import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, Tooltip } from '@mui/material';
import { type AddEventSectionStatus } from './AddEventSectionStatusToggle';

const statusIconSx = {
  fontSize: 22,
} as const;

type AddEventSectionStatusIconProps = {
  status: AddEventSectionStatus;
  sectionTitle: string;
};

export default function AddEventSectionStatusIcon({
  status,
  sectionTitle,
}: AddEventSectionStatusIconProps) {
  if (status === 'not_started') {
    return null;
  }

  const isFinalized = status === 'finalized';
  const Icon = isFinalized ? CheckCircleIcon : TaskAltIcon;
  const label = isFinalized ? 'Finalized' : 'In Progress';
  const color = isFinalized ? 'success.main' : 'warning.main';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        ml: 'auto',
        flexShrink: 0,
      }}
      aria-label={`${sectionTitle}: ${label}`}
    >
      <Tooltip title={label} arrow>
        <Box component="span" sx={{ display: 'inline-flex', lineHeight: 0 }}>
          <Icon sx={{ ...statusIconSx, color }} aria-hidden />
        </Box>
      </Tooltip>
    </Box>
  );
}
