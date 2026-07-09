import { Typography } from '@mui/material';

type AddEventRolesProps = {
  onFieldEdit?: () => void;
};

export default function AddEventRoles(_props: AddEventRolesProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      Event roles and assignments will be configured here.
    </Typography>
  );
}
