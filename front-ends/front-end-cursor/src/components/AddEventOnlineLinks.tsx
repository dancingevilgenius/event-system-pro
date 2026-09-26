import { Box, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  contactVenueSummaryFromContact,
  EMPTY_EVENT_VENUE_CONTACT,
  type ContactVenueSummary,
  type EventVenueContactJson,
} from '../lib/eventLocation';
import { mobileColumnSx } from '../constants/layout';
import AppPhoneNumberField from './AppPhoneNumberField';
import AppTextField from './AppTextField';

const contactFieldRowSx = {
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
} as const;

const contactFieldsColumnSx = mobileColumnSx;

const contactFieldsInnerStackSx = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  rowGap: 2,
  width: '100%',
} as const;

type AddEventOnlineLinksProps = {
  onFieldEdit?: () => void;
  onSummaryChange?: (summary: ContactVenueSummary) => void;
};

export default function AddEventOnlineLinks({
  onFieldEdit,
  onSummaryChange,
}: AddEventOnlineLinksProps) {
  const [contact, setContact] = useState(EMPTY_EVENT_VENUE_CONTACT);

  useEffect(() => {
    onSummaryChange?.(contactVenueSummaryFromContact(contact));
  }, [contact, onSummaryChange]);

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
