import { Box, CircularProgress, MenuItem, Stack, Typography } from '@mui/material';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  fetchCountries,
  fetchEventLocation,
  fetchUsStatesStaticList,
  type StaticListEntry,
} from '../api/postgrest';
import { registerEventFormSyncFlush } from '../lib/eventFormFlush';
import {
  EMPTY_EVENT_LOCATION,
  eventLocationToJson,
  type EventLocationJson,
} from '../lib/eventLocation';
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import { trimSavedText } from '../utils/trimSavedText';
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

function locationSaveKey(location: EventLocationJson): string {
  return JSON.stringify(eventLocationToJson(location));
}

type AddEventLocationProps = {
  eventId: number | null;
  expanded: boolean;
  onFieldEdit?: () => void;
  onVenueChange?: (venue: string) => void;
  onSaveLocation: (location: EventLocationJson) => void;
};

export default function AddEventLocation({
  eventId,
  expanded,
  onFieldEdit,
  onVenueChange,
  onSaveLocation,
}: AddEventLocationProps) {
  const [location, setLocation] = useState(EMPTY_EVENT_LOCATION);
  const [stateOptions, setStateOptions] = useState<StaticListEntry[]>([]);
  const [countryOptions, setCountryOptions] = useState<StaticListEntry[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const locationRef = useRef(location);
  const savedKeyRef = useRef(locationSaveKey(EMPTY_EVENT_LOCATION));
  const readyRef = useRef(eventId === null);
  const dirtyRef = useRef(false);
  const saveSeqRef = useRef(0);
  const expandedRef = useRef(expanded);
  const onSaveLocationRef = useRef(onSaveLocation);
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);
  const hydratedImportTokenRef = useRef(0);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    onSaveLocationRef.current = onSaveLocation;
  }, [onSaveLocation]);

  useEffect(() => {
    onVenueChange?.(location.venue);
  }, [location.venue, onVenueChange]);

  useEffect(() => {
    reportExport('location', location);
  }, [location, reportExport]);

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    hydratedImportTokenRef.current = appliedImport.token;
    const next = eventLocationToJson(appliedImport.location);
    locationRef.current = next;
    dirtyRef.current = true;
    savedKeyRef.current = '';
    setLocation(next);
    onSaveLocationRef.current(next);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

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

  const commitLocationSave = () => {
    const trimmed = eventLocationToJson(locationRef.current);
    locationRef.current = trimmed;
    setLocation(trimmed);

    if (!readyRef.current && !dirtyRef.current) {
      return;
    }

    const nextKey = locationSaveKey(trimmed);
    if (nextKey === savedKeyRef.current) {
      dirtyRef.current = false;
      return;
    }

    savedKeyRef.current = nextKey;
    dirtyRef.current = false;
    saveSeqRef.current += 1;
    onSaveLocationRef.current(trimmed);
  };

  const commitLocationSaveRef = useRef(commitLocationSave);
  commitLocationSaveRef.current = commitLocationSave;

  useEffect(() => {
    if (eventId === null) {
      readyRef.current = true;
      return;
    }

    let cancelled = false;
    const startedSeq = saveSeqRef.current;
    readyRef.current = false;

    void fetchEventLocation(eventId)
      .then((stored) => {
        if (cancelled || saveSeqRef.current !== startedSeq) {
          if (!cancelled) {
            readyRef.current = true;
          }
          return;
        }

        if (!dirtyRef.current && hydratedImportTokenRef.current === 0) {
          locationRef.current = stored;
          savedKeyRef.current = locationSaveKey(stored);
          setLocation(stored);
        }
        readyRef.current = true;
      })
      .catch(() => {
        if (!cancelled) {
          readyRef.current = true;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    const wasExpanded = expandedRef.current;
    expandedRef.current = expanded;
    if (wasExpanded && !expanded) {
      commitLocationSaveRef.current();
    }
  }, [expanded]);

  useEffect(() => {
    return () => {
      commitLocationSaveRef.current();
    };
  }, []);

  useEffect(() => {
    return registerEventFormSyncFlush(() => {
      commitLocationSaveRef.current();
    });
  }, []);

  const updateLocationField = (field: keyof typeof EMPTY_EVENT_LOCATION, value: string) => {
    const next = { ...locationRef.current, [field]: value };
    locationRef.current = next;
    setLocation(next);
    dirtyRef.current = true;
    onFieldEdit?.();
  };

  const trimLocationField = (field: 'venue' | 'street' | 'city' | 'map_url') => {
    setLocation((current) => {
      const trimmed = trimSavedText(current[field]);
      if (trimmed === current[field]) {
        return current;
      }
      return { ...current, [field]: trimmed };
    });
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
        onBlur={() => trimLocationField('venue')}
        fullWidth
        autoComplete="off"
      />
      <AppTextField
        label="Street"
        value={location.street}
        onChange={(event) => updateLocationField('street', event.target.value)}
        onBlur={() => trimLocationField('street')}
        fullWidth
        autoComplete="off"
      />
      <AppTextField
        label="City"
        value={location.city}
        onChange={(event) => updateLocationField('city', event.target.value)}
        onBlur={() => trimLocationField('city')}
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
        onBlur={() => trimLocationField('map_url')}
        fullWidth
        autoComplete="url"
      />
    </FieldGroup>
  );
}
