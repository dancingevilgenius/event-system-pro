import { Button, type ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CREATE_EVENT_PATH } from '../constants/eventRoutes';
import { rememberEventGroupCode } from '../lib/eventGroupSession';

type AddEventButtonProps = {
  eventGroupCode: string;
  eventId?: number;
  label?: string;
} & Pick<ButtonProps, 'variant' | 'fullWidth' | 'size'>;

export default function AddEventButton({
  eventGroupCode,
  eventId,
  label = 'Add Event',
  variant = 'outlined',
  fullWidth = true,
  size = 'large',
}: AddEventButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const trimmedCode = eventGroupCode.trim();
    rememberEventGroupCode(trimmedCode);
    navigate(CREATE_EVENT_PATH, {
      state: {
        eventGroupCode: trimmedCode,
        ...(typeof eventId === 'number' && Number.isFinite(eventId) ? { eventId } : {}),
      },
    });
  };

  return (
    <Button variant={variant} size={size} fullWidth={fullWidth} onClick={handleClick}>
      {label}
    </Button>
  );
}
