import { Box, CircularProgress, MenuItem, Stack, Typography } from '@mui/material';
import { type ReactNode, useEffect, useState } from 'react';
import {
  fetchCountries,
  fetchUsStatesStaticList,
  type StaticListEntry,
} from '../api/postgrest';
import { EMPTY_EVENT_LOCATION } from '../lib/eventLocation';
import AppTextField from './AppTextField';

const fieldGroupSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  p: { xs: 1.5, sm: 2 },
  width: '100%',
} as const;

type FieldGroupProps = {
  title: string;
  children: ReactNode;
};

function FieldGroup({ title, children }: FieldGroupProps) {
  return (
    <Box sx={fieldGroupSx}>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Stack spacing={2} sx={{ alignItems: 'stretch' }}>
        {children}
      </Stack>
    </Box>
  );
}

type AddEventLocationSectionProps = {
  onFieldEdit?: () => void;
};

export default function AddEventLocationSection({ onFieldEdit }: AddEventLocationSectionProps) {
  const [location, setLocation] = useState(EMPTY_EVENT_LOCATION);
  const [stateOptions, setStateOptions] = useState<StaticListEntry[]>([]);
  const [countryOptions, setCountryOptions] = useState<StaticListEntry[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoadingLists(true);
    setListError(null);

    Promise.all([fetchUsStatesStaticList(), fetchCountries()])
      .then(([states, countries]) => {
        if (!cancelled) {
          setStateOptions(states);
          setCountryOptions(countries);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setStateOptions([]);
          setCountryOptions([]);
          setListError(
            error instanceof Error ? error.message : 'Unable to load state and country lists.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingLists(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateLocationField = (field: keyof typeof EMPTY_EVENT_LOCATION, value: string) => {
    setLocation((current) => ({ ...current, [field]: value }));
    onFieldEdit?.();
  };

  if (loadingLists) {
    return (
      <Stack sx={{ py: 2, alignItems: 'center' }}>
        <CircularProgress size={28} />
      </Stack>
    );
  }

  if (listError) {
    return (
      <Typography variant="body2" color="error">
        {listError}
      </Typography>
    );
  }

  return (
    <FieldGroup title="Venue & Address">
      <AppTextField
        label="Venue"
        value={location.venue}
        onChange={(event) => updateLocationField('venue', event.target.value)}
        fullWidth
        autoComplete="off"
      />
      <AppTextField
        label="Street"
        value={location.street}
        onChange={(event) => updateLocationField('street', event.target.value)}
        fullWidth
        autoComplete="off"
      />
      <AppTextField
        label="City"
        value={location.city}
        onChange={(event) => updateLocationField('city', event.target.value)}
        fullWidth
        autoComplete="off"
      />
      <AppTextField
        select
        label="State"
        value={location.state}
        onChange={(event) => updateLocationField('state', event.target.value)}
        fullWidth
      >
        <MenuItem value="">
          <em>Select state</em>
        </MenuItem>
        {stateOptions.map((entry) => (
          <MenuItem key={entry.key} value={entry.key}>
            {entry.label}
          </MenuItem>
        ))}
      </AppTextField>
      <AppTextField
        select
        label="Country"
        value={location.country}
        onChange={(event) => updateLocationField('country', event.target.value)}
        fullWidth
      >
        <MenuItem value="">
          <em>Select country</em>
        </MenuItem>
        {countryOptions.map((entry) => (
          <MenuItem key={entry.key} value={entry.key}>
            {entry.label}
          </MenuItem>
        ))}
      </AppTextField>
      <AppTextField
        label="Map URL"
        value={location.map_url}
        onChange={(event) => updateLocationField('map_url', event.target.value)}
        fullWidth
        autoComplete="url"
      />
    </FieldGroup>
  );
}
