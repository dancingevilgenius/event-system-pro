import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type MouseEvent, useEffect, useState } from 'react';
import {
  EMPTY_ADVANCED_USER_FILTERS,
  fetchCountries,
  fetchUsStatesStaticList,
  type StaticListEntry,
  type UserAdvancedSearchFilters,
} from '../api/postgrest';
import { CONTENT_MAX_WIDTH, mobileColumnSx } from '../constants/layout';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';

export type { UserAdvancedSearchFilters };
export { EMPTY_ADVANCED_USER_FILTERS };

const toggleGroupSx = {
  ...mobileColumnSx,
  '& .MuiToggleButton-root': {
    flex: 1,
    py: 1,
    px: { xs: 0.5, sm: 1.5 },
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    lineHeight: 1.2,
    whiteSpace: 'normal',
  },
} as const;

type UserAdvancedSearchDialogProps = {
  open: boolean;
  initialFilters: UserAdvancedSearchFilters;
  onClose: () => void;
  onSearch: (filters: UserAdvancedSearchFilters) => void;
};

export default function UserAdvancedSearchDialog({
  open,
  initialFilters,
  onClose,
  onSearch,
}: UserAdvancedSearchDialogProps) {
  const [filters, setFilters] = useState<UserAdvancedSearchFilters>(initialFilters);
  const [stateOptions, setStateOptions] = useState<StaticListEntry[]>([]);
  const [countryOptions, setCountryOptions] = useState<StaticListEntry[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFilters(initialFilters);
    setLoadError(null);
    setLoadingLists(true);

    let cancelled = false;

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
          setLoadError(
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
  }, [open, initialFilters]);

  const updateFilter = <K extends keyof UserAdvancedSearchFilters>(
    field: K,
    value: UserAdvancedSearchFilters[K],
  ) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handlePrimaryRoleChange = (
    _event: MouseEvent<HTMLElement>,
    nextValue: 'leader' | 'follower' | null,
  ) => {
    updateFilter('primaryRole', nextValue);
  };

  const handleDemoChange = (
    _event: MouseEvent<HTMLElement>,
    nextValue: 'true' | 'false' | null,
  ) => {
    if (nextValue === null) {
      updateFilter('isDemo', null);
      return;
    }
    updateFilter('isDemo', nextValue === 'true');
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const demoToggleValue =
    filters.isDemo === null ? null : filters.isDemo ? 'true' : 'false';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 0.5,
          pl: 4,
          pr: 4,
          position: 'relative',
        }}
      >
        Advanced Search
        <IconButton
          aria-label="Close advanced search dialog"
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {loadingLists && (
          <Stack sx={{ py: 3, alignItems: 'center' }}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!loadingLists && loadError && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {loadError}
          </Typography>
        )}

        {!loadingLists && !loadError && (
          <Stack spacing={2.5} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
            <AppTextField
              label="Username"
              value={filters.username}
              onChange={(event) => updateFilter('username', event.target.value)}
              fullWidth
              autoComplete="off"
            />

            <TextField
              select
              label="State"
              value={filters.state}
              onChange={(event) => updateFilter('state', event.target.value)}
              fullWidth
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {stateOptions.map((entry) => (
                <MenuItem key={entry.key} value={entry.key}>
                  {entry.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Country"
              value={filters.country}
              onChange={(event) => updateFilter('country', event.target.value)}
              fullWidth
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {countryOptions.map((entry) => (
                <MenuItem key={entry.key} value={entry.key}>
                  {entry.label}
                </MenuItem>
              ))}
            </TextField>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Demo user
              </Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={demoToggleValue}
                onChange={handleDemoChange}
                aria-label="Demo user filter"
                sx={toggleGroupSx}
              >
                <ToggleButton value="true" aria-label="Demo users only">
                  Demo
                </ToggleButton>
                <ToggleButton value="false" aria-label="Non-demo users only">
                  Not Demo
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Primary role
              </Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={filters.primaryRole}
                onChange={handlePrimaryRoleChange}
                aria-label="Primary role filter"
                sx={toggleGroupSx}
              >
                <ToggleButton value="leader" aria-label="Leader">
                  Leader
                </ToggleButton>
                <ToggleButton value="follower" aria-label="Follower">
                  Follower
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3, pt: 0 }}>
        <Stack spacing={1} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            fullWidth
            disabled={loadingLists || Boolean(loadError)}
          >
            Search
          </Button>
          <Button variant="outlined" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
