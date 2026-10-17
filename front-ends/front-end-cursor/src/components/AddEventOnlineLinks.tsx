import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import {
  contactVenueSummaryFromContact,
  EMPTY_EVENT_VENUE_CONTACT,
  type ContactVenueSummary,
  type EventVenueContactJson,
} from '../lib/eventLocation';
import { ACCORDION_TABLE_ROW_GAP, mobileColumnSx } from '../constants/layout';
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import { trimSavedText } from '../utils/trimSavedText';
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
  rowGap: ACCORDION_TABLE_ROW_GAP,
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
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);

  useEffect(() => {
    onSummaryChange?.(contactVenueSummaryFromContact(contact));
  }, [contact, onSummaryChange]);

  useEffect(() => {
    reportExport('contactVenue', contact);
  }, [contact, reportExport]);

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    setContact(appliedImport.contactVenue);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

  const updateContactField = (field: keyof EventVenueContactJson, value: string) => {
    setContact((current) => ({ ...current, [field]: value }));
    onFieldEdit?.();
  };

  const trimContactField = (field: keyof EventVenueContactJson) => {
    setContact((current) => {
      const trimmed = trimSavedText(current[field]);
      if (trimmed === current[field]) {
        return current;
      }
      return { ...current, [field]: trimmed };
    });
  };

  return (
    <Box sx={contactFieldsColumnSx}>
      <Stack spacing={2} sx={contactFieldsInnerStackSx}>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Web Page"
            value={contact.website}
            onChange={(event) => updateContactField('website', event.target.value)}
            onBlur={() => trimContactField('website')}
            fullWidth
            autoComplete="url"
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppPhoneNumberField
            label="Phone Number"
            value={contact.phone}
            onChange={(phone) => updateContactField('phone', phone)}
            onBlur={() => trimContactField('phone')}
            fullWidth
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Social Media 1"
            value={contact.social_media_1}
            onChange={(event) => updateContactField('social_media_1', event.target.value)}
            onBlur={() => trimContactField('social_media_1')}
            fullWidth
            autoComplete="url"
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Social Media 2"
            value={contact.social_media_2}
            onChange={(event) => updateContactField('social_media_2', event.target.value)}
            onBlur={() => trimContactField('social_media_2')}
            fullWidth
            autoComplete="url"
          />
        </Box>
        <Box sx={contactFieldRowSx}>
          <AppTextField
            label="Social Media 3"
            value={contact.social_media_3}
            onChange={(event) => updateContactField('social_media_3', event.target.value)}
            onBlur={() => trimContactField('social_media_3')}
            fullWidth
            autoComplete="url"
          />
        </Box>
      </Stack>
    </Box>
  );
}
