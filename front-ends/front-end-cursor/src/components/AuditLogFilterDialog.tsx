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
import {
  EMPTY_AUDIT_LOG_FILTERS,
  fetchAuditLogFilterOptions,
  type AuditLogFilters,
} from '../api/postgrest';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';
import { isAuditLogDateRangeValid } from '../lib/auditLogDisplay';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';

export type { AuditLogFilters };

export { EMPTY_AUDIT_LOG_FILTERS };

const ANY_OPTION_VALUE = '';

type AuditLogFilterDialogProps = {
  open: boolean;
  initialFilters: AuditLogFilters;
  onClose: () => void;
  onApply: (filters: AuditLogFilters) => void;
};

export default function AuditLogFilterDialog({
  open,
  initialFilters,
  onClose,
  onApply,
}: AuditLogFilterDialogProps) {
  const { showProblem } = useMessages();
  const [filters, setFilters] = useState<AuditLogFilters>(initialFilters);
  const [tableOptions, setTableOptions] = useState<string[]>([]);
  const [actionOptions, setActionOptions] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setFilters(initialFilters);
    setLoadError(null);
    setLoadingOptions(true);

    fetchAuditLogFilterOptions()
      .then((options) => {
        setTableOptions(options.tables);
        setActionOptions(options.actions);
      })
      .catch((error) => {
        setTableOptions([]);
        setActionOptions([]);
        setLoadError(error instanceof Error ? error.message : 'Unable to load filter options.');
      })
      .finally(() => setLoadingOptions(false));
  }, [open, initialFilters]);

  const updateFilter = <K extends keyof AuditLogFilters>(field: K, value: AuditLogFilters[K]) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const validateDateRange = (fromDateTime: string, toDateTime: string): boolean => {
    if (!isAuditLogDateRangeValid(fromDateTime, toDateTime)) {
      showProblem('The To date and time must be on or after the From date and time.');
      return false;
    }

    return true;
  };

  const handleToDateTimeChange = (value: string) => {
    updateFilter('toDateTime', value);

    if (filters.fromDateTime.trim() && value.trim() && !isAuditLogDateRangeValid(filters.fromDateTime, value)) {
      showProblem('The To date and time must be on or after the From date and time.');
    }
  };

  const handleFilter = () => {
    if (!validateDateRange(filters.fromDateTime, filters.toDateTime)) {
      return;
    }

    onApply(filters);
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
        Filter
        <IconButton
          aria-label="Close audit log filter dialog"
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
        {loadingOptions && (
          <Stack sx={{ py: 3, alignItems: 'center' }}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!loadingOptions && loadError && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {loadError}
          </Typography>
        )}

        {!loadingOptions && (
          <Stack spacing={2.5} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
            <AppTextField
              label="From"
              type="datetime-local"
              value={filters.fromDateTime}
              onChange={(event) => updateFilter('fromDateTime', event.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <AppTextField
              label="To"
              type="datetime-local"
              value={filters.toDateTime}
              onChange={(event) => handleToDateTimeChange(event.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              select
              label="Table"
              value={filters.tableName}
              onChange={(event) => updateFilter('tableName', event.target.value)}
              fullWidth
            >
              <MenuItem value={ANY_OPTION_VALUE}>
                <em>Any</em>
              </MenuItem>
              {tableOptions.map((tableName) => (
                <MenuItem key={tableName} value={tableName}>
                  {tableName}
                </MenuItem>
              ))}
            </TextField>

            <AppTextField
              label="Actor"
              value={filters.actorSearch}
              onChange={(event) => updateFilter('actorSearch', event.target.value)}
              fullWidth
              helperText="Matches username, first name, or last name"
            />

            <TextField
              select
              label="Action"
              value={filters.action}
              onChange={(event) => updateFilter('action', event.target.value)}
              fullWidth
            >
              <MenuItem value={ANY_OPTION_VALUE}>
                <em>Any</em>
              </MenuItem>
              {actionOptions.map((action) => (
                <MenuItem key={action} value={action}>
                  {action}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3, pt: 0 }}>
        <Stack spacing={1} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleFilter} fullWidth disabled={loadingOptions}>
              Filter
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
