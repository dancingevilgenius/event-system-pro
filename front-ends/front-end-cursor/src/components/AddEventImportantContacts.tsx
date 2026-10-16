import { Box, Stack, Typography } from '@mui/material';
import { useLayoutTier } from '../hooks/useLayoutTier';

type AddEventImportantContactsProps = {
  onFieldEdit?: () => void;
};

const DEFAULT_CONTACT = {
  name: 'Carlos Garcia',
  email: 'swingcarlos@alum.mit.edu',
  phone: '6302201111',
};

const CONTACT_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
] as const;

function ContactValue({ value }: { value: string }) {
  return (
    <Typography variant="body2" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
      {value}
    </Typography>
  );
}

export default function AddEventImportantContacts(_props: AddEventImportantContactsProps) {
  const { showXsLayout } = useLayoutTier();

  if (showXsLayout) {
    return (
      <Stack spacing={1}>
        {CONTACT_COLUMNS.map((column) => (
          <Box key={column.key}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              {column.label}
            </Typography>
            <ContactValue value={DEFAULT_CONTACT[column.key]} />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.6fr) max-content',
        columnGap: 2,
        rowGap: 1,
        alignItems: 'center',
        justifyContent: 'start',
        justifyItems: 'start',
        width: '100%',
      }}
    >
      {CONTACT_COLUMNS.map((column) => (
        <Typography
          key={column.key}
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 700 }}
        >
          {column.label}
        </Typography>
      ))}
      <ContactValue value={DEFAULT_CONTACT.name} />
      <ContactValue value={DEFAULT_CONTACT.email} />
      <ContactValue value={DEFAULT_CONTACT.phone} />
    </Box>
  );
}
