import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchAppRoles, updateAppRoleLabels, type AppRoleRow } from '../api/postgrest';
import EditRoleLabelsDialog from '../components/EditRoleLabelsDialog';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';

function selectedLabel(labels: string[], current: string | undefined): string {
  if (current && labels.includes(current)) {
    return current;
  }

  return labels[0] ?? '';
}

function RoleLabelsSelect({
  labels,
  value,
  onChange,
}: {
  labels: string[];
  value: string;
  onChange: (label: string) => void;
}) {
  const current = selectedLabel(labels, value);

  return (
    <FormControl size="small" fullWidth disabled={labels.length === 0}>
      <Select
        value={current}
        displayEmpty
        onChange={(event) => onChange(event.target.value)}
        aria-label="Labels"
      >
        {labels.length === 0 ? (
          <MenuItem value="">—</MenuItem>
        ) : (
          labels.map((label, index) => (
            <MenuItem key={`${label}-${index}`} value={label}>
              {label}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}

function RoleMobileCard({
  row,
  selected,
  onSelect,
  onEdit,
}: {
  row: AppRoleRow;
  selected: string;
  onSelect: (label: string) => void;
  onEdit: () => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        Role Code
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {row.roleCode}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        Labels
      </Typography>
      <RoleLabelsSelect labels={row.labels} value={selected} onChange={onSelect} />
      <Button variant="outlined" fullWidth onClick={onEdit} sx={{ mt: 2 }}>
        Edit Labels
      </Button>
    </Paper>
  );
}

export default function RolesPage() {
  const { showXsLayout, showMdLayout, containerMaxWidth } = useLayoutTier();
  const { showSuccess, showProblem } = useMessages();
  const [rows, setRows] = useState<AppRoleRow[]>([]);
  const [selectedByRole, setSelectedByRole] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<AppRoleRow | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const roles = await fetchAppRoles();
      setRows(roles);
      setSelectedByRole((current) => {
        const next: Record<string, string> = {};
        for (const role of roles) {
          next[role.roleCode] = selectedLabel(role.labels, current[role.roleCode]);
        }
        return next;
      });
    } catch (loadError) {
      setRows([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load roles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRoles();
  }, [loadRoles]);

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setEditRow(null);
  };

  const handleSaveLabels = async (roleCode: string, labels: string[]) => {
    if (labels.length === 0) {
      showProblem('Enter at least one label.');
      return;
    }

    setSaving(true);

    try {
      const updated = await updateAppRoleLabels(roleCode, labels);
      setRows((current) =>
        current.map((row) => (row.roleCode === updated.roleCode ? updated : row)),
      );
      setSelectedByRole((current) => ({
        ...current,
        [updated.roleCode]: selectedLabel(updated.labels, current[updated.roleCode]),
      }));
      setEditRow(null);
      showSuccess('Role labels saved.');
    } catch (saveError) {
      showProblem(saveError instanceof Error ? saveError.message : 'Unable to save role labels.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Roles" backTo="/adminhome" backLabel="Back to Admin" />

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" align="center" sx={{ py: 4 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && showXsLayout && (
          <Stack spacing={2} sx={{ my: 3 }}>
            {rows.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                No roles found.
              </Typography>
            ) : (
              rows.map((row) => (
                <RoleMobileCard
                  key={row.roleCode}
                  row={row}
                  selected={selectedByRole[row.roleCode] ?? ''}
                  onSelect={(label) =>
                    setSelectedByRole((current) => ({ ...current, [row.roleCode]: label }))
                  }
                  onEdit={() => setEditRow(row)}
                />
              ))
            )}
          </Stack>
        )}

        {!loading && !error && showMdLayout && (
          <TableContainer sx={{ overflowX: 'auto', my: 3 }}>
            <Table size="small" aria-label="Roles">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Role Code</TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: 180 }}>Labels</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Edit Labels
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No roles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.roleCode} hover>
                      <TableCell>{row.roleCode}</TableCell>
                      <TableCell>
                        <RoleLabelsSelect
                          labels={row.labels}
                          value={selectedByRole[row.roleCode] ?? ''}
                          onChange={(label) =>
                            setSelectedByRole((current) => ({ ...current, [row.roleCode]: label }))
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="outlined" size="small" onClick={() => setEditRow(row)}>
                          Edit Labels
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <EditRoleLabelsDialog
        open={editRow !== null}
        row={editRow}
        saving={saving}
        onClose={handleCloseEdit}
        onSave={(roleCode, labels) => void handleSaveLabels(roleCode, labels)}
      />
    </Container>
  );
}
