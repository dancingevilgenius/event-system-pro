import { Typography } from '@mui/material';

type AddEventVolunteersProps = {
  onFieldEdit?: () => void;
};

export default function AddEventVolunteers(_props: AddEventVolunteersProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      Volunteer roles and signup details will be configured here.
    </Typography>
  );
}
