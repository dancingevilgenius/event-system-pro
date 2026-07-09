import { Typography } from '@mui/material';

type AddEventImportantContactsProps = {
  onFieldEdit?: () => void;
};

export default function AddEventImportantContacts(_props: AddEventImportantContactsProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      Key event contacts and roles will be configured here.
    </Typography>
  );
}
