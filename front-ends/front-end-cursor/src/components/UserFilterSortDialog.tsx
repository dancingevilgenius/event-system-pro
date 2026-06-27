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
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchUsStateCodes, type UserFilters, type UserSort } from '../api/postgrest';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

export type { UserFilters, UserSort };

export const EMPTY_USER_FILTERS: UserFilters = {
  firstName: '',
  lastName: '',
  city: '',
  state: '',
  primaryRole: null,
};

export const DEFAULT_USER_SORT: UserSort = {
  column: 'lastName',
  direction: 'asc',
};

const SORT_COLUMN_OPTIONS: { value: UserSort['column']; label: string }[] = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'city', label: 'City' },
  { value: 'state', label: 'State' },
  { value: 'primaryRole', label: 'Primary Role' },
];

const PRIMARY_ROLE_NO_SELECTION = 'no-selection';

const PRIMARY_ROLE_OPTIONS = [
  { value: PRIMARY_ROLE_NO_SELECTION, label: 'no selection' },
  { value: 'leader', label: 'leader' },
  { value: 'follower', label: 'follower' },
] as const;

type UserFilterSortDialogProps = {
  open: boolean;
  initialFilters: UserFilters;
  initialSort: UserSort;
  onClose: () => void;
  onApply: (filters: UserFilters, sort: UserSort) => void;
};

export default function UserFilterSortDialog({
  open,
  initialFilters,
  initialSort,
  onClose,
  onApply,
}: UserFilterSortDialogProps) {
  const [filters, setFilters] = useState<UserFilters>({
    ...initialFilters,
    primaryRole: null,
  });
  const [sort, setSort] = useState<UserSort>(initialSort);
  const [stateCodes, setStateCodes] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFilters({ ...initialFilters, primaryRole: null });
    setSort(initialSort);
    setLoadError(null);
    setLoadingStates(true);

    fetchUsStateCodes()
      .then((codes) => setStateCodes(codes))
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : 'Unable to load state codes.');
      })
      .finally(() => setLoadingStates(false));
  }, [open, initialFilters, initialSort]);

  const updateFilter = <K extends keyof UserFilters>(field: K, value: UserFilters[K]) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleClear = () => {
    setFilters(EMPTY_USER_FILTERS);
    setSort(DEFAULT_USER_SORT);
  };

  const handleApply = () => {
    onApply(filters, sort);
    onClose();
  };

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
        Filter and Sort
        <IconButton
          aria-label="Close filter and sort dialog"
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
        {loadingStates && (
          <Stack sx={{ py: 3, alignItems: 'center' }}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!loadingStates && loadError && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {loadError}
          </Typography>
        )}

        {!loadingStates && (
          <Stack spacing={2.5} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Filter
            </Typography>

            <AppTextField
              label="First Name"
              value={filters.firstName}
              onChange={(event) => updateFilter('firstName', event.target.value)}
              fullWidth
            />
            <AppTextField
              label="Last Name"
              value={filters.lastName}
              onChange={(event) => updateFilter('lastName', event.target.value)}
              fullWidth
            />
            <AppTextField
              label="City"
              value={filters.city}
              onChange={(event) => updateFilter('city', event.target.value)}
              fullWidth
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
              {stateCodes.map((code) => (
                <MenuItem key={code} value={code}>
                  {code}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Primary Role"
              value={filters.primaryRole ?? PRIMARY_ROLE_NO_SELECTION}
              onChange={(event) => {
                const value = event.target.value;
                updateFilter(
                  'primaryRole',
                  value === PRIMARY_ROLE_NO_SELECTION ? null : (value as 'leader' | 'follower'),
                );
              }}
              fullWidth
            >
              {PRIMARY_ROLE_OPTIONS.map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="subtitle2" color="text.secondary" sx={{ pt: 1 }}>
              Sort
            </Typography>

            <TextField
              select
              label="Sort by"
              value={sort.column}
              onChange={(event) =>
                setSort((current) => ({
                  ...current,
                  column: event.target.value as UserSort['column'],
                }))
              }
              fullWidth
            >
              {SORT_COLUMN_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Order"
              value={sort.direction}
              onChange={(event) =>
                setSort((current) => ({
                  ...current,
                  direction: event.target.value as UserSort['direction'],
                }))
              }
              fullWidth
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </TextField>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3, pt: 0 }}>
        <Stack
          spacing={1}
          sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}
        >
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleClear} fullWidth disabled={loadingStates}>
              Clear
            </Button>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Cancel
            </Button>
          </Stack>
          <Button variant="contained" onClick={handleApply} fullWidth disabled={loadingStates}>
            Apply
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
