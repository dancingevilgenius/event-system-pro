import { Typography } from '@mui/material';

type AddEventContestsProps = {
  onFieldEdit?: () => void;
};

export default function AddEventContests(_props: AddEventContestsProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      Contest divisions, skill levels, and contest names will be configured here.
    </Typography>
  );
}
