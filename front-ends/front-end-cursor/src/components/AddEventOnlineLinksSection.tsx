import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import {
  EMPTY_EVENT_VENUE_CONTACT,
  type EventVenueContactJson,
} from '../lib/eventLocation';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import AppPhoneNumberField from './AppPhoneNumberField';
import AppTextField from './AppTextField';

const contactFieldRowSx = {
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
} as const;

const contactFieldsColumnSx = {
  width: '100%',
  maxWidth: CONTENT_MAX_WIDTH,
  boxSizing: 'border-box',
} as const;

const contactFieldsInnerStackSx = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  rowGap: 2,
  width: '100%',
} as const;

type AddEventOnlineLinksSectionProps = {
  onFieldEdit?: () => void;
};

export default function AddEventOnlineLinksSection({
  onFieldEdit,
}: AddEventOnlineLinksSectionProps) {
  const [contact, setContact] = useState(EMPTY_EVENT_VENUE_CONTACT);

  const updateContactField = (field: keyof EventVenueContactJson, value: string) => {
    setContact((current) => ({ ...current, [field]: value }));
    onFieldEdit?.();
  };

  return (
    <Box sx={contactFieldsColumnSx}>
      <Stack spacing={2} sx={contactFieldsInnerStackSx}>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Web Page"
            value={contact.website}
            onChange={(event) => updateContactField('website', event.target.value)}
            fullWidth
            autoComplete="url"
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppPhoneNumberField
            label="Phone Number"
            value={contact.phone}
            onChange={(phone) => updateContactField('phone', phone)}
            fullWidth
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Social Media 1"
            value={contact.social_media_1}
            onChange={(event) => updateContactField('social_media_1', event.target.value)}
            fullWidth
            autoComplete="url"
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Social Media 2"
            value={contact.social_media_2}
            onChange={(event) => updateContactField('social_media_2', event.target.value)}
            fullWidth
            autoComplete="url"
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Social Media 3"
            value={contact.social_media_3}
            onChange={(event) => updateContactField('social_media_3', event.target.value)}
            fullWidth
            autoComplete="url"
          />
        </Box>
      </Stack>
    </Box>
  );
}
