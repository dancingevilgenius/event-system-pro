import { Typography } from '@mui/material';

type AddEventStaffProps = {
  onFieldEdit?: () => void;
};

export default function AddEventStaff(_props: AddEventStaffProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      Event staff roles and assignments will be configured here.
    </Typography>
  );
}
