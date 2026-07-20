import CloseIcon from '../components/CloseIcon';
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchStaticListByCode,
  updateStaticListJson,
  type StaticListEntry,
  type StaticListRecord,
} from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import AuditTrailCard from '../components/AuditTrailCard';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import {
  NOT_APPLICABLE_INT,
  formatStaticListAge,
  staticListFieldLabel,
  staticListHasJsonField,
  truncateStaticListDescription,
  type StaticListJsonField,
} from '../lib/staticList';

type EditField = 'label' | StaticListJsonField;

type EditTarget = {
  index: number;
  field: EditField;
};

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function valueButtonWidth(entries: StaticListEntry[]): string {
  const longestLabel = entries.reduce((longest, entry) => {
    const label = displayValue(entry.label);
    return label.length > longest.length ? label : longest;
  }, '—');

  return `${Math.max(longestLabel.length + 4, 8)}ch`;
}

function editDialogTitle(field: EditField): string {
  if (field === 'label') {
    return 'Edit value';
  }

  return `Edit ${staticListFieldLabel(field).toLowerCase()}`;
}

function editDialogLabel(field: EditField): string {
  if (field === 'label') {
    return 'Value';
  }

  return staticListFieldLabel(field);
}

function StaticListEntryMobileCard({
  entry,
  index,
  isAdmin,
  showMinAgeColumn,
  showMaxAgeColumn,
  showDescriptionColumn,
  onOpenEdit,
  renderAgeCell,
  renderDescriptionCell,
}: {
  entry: StaticListEntry;
  index: number;
  isAdmin: boolean;
  showMinAgeColumn: boolean;
  showMaxAgeColumn: boolean;
  showDescriptionColumn: boolean;
  onOpenEdit: (index: number, field: EditField) => void;
  renderAgeCell: (
    index: number,
    field: StaticListJsonField,
    ageValue: number | undefined,
  ) => ReactNode;
  renderDescriptionCell: (index: number, description: string | undefined) => ReactNode;
}) {
  const fields: Parameters<typeof AuditTrailCard>[0]['fields'] = [
    { key: 'key', label: 'Key', value: displayValue(entry.key) },
    {
      key: 'value',
      label: 'Value',
      value: isAdmin ? (
        <Button
          variant="outlined"
          size="small"
          onClick={() => onOpenEdit(index, 'label')}
          sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
        >
          {displayValue(entry.label)}
        </Button>
      ) : (
        displayValue(entry.label)
      ),
      columnSpan: 2,
    },
  ];

  if (showMinAgeColumn) {
    fields.push({
      key: 'min-age',
      label: staticListFieldLabel('min-age'),
      value: renderAgeCell(index, 'min-age', entry.minAge),
    });
  }

  if (showMaxAgeColumn) {
    fields.push({
      key: 'max-age',
      label: staticListFieldLabel('max-age'),
      value: renderAgeCell(index, 'max-age', entry.maxAge),
    });
  }

  if (showDescriptionColumn) {
    fields.push({
      key: 'description',
      label: staticListFieldLabel('description'),
      value: renderDescriptionCell(index, entry.description),
      columnSpan: 2,
    });
  }

  return <AuditTrailCard columns={2} fields={fields} />;
}

export default function StaticListDetailsPage() {
  const navigate = useNavigate();
  const { listCode = '' } = useParams<{ listCode: string }>();
  const decodedListCode = decodeURIComponent(listCode);
  const { hasAnyRole } = useAuth();
  const { showSuccess, showProblem } = useMessages();
  const { showXsLayout, showMdLayout, showLgLayout, containerMaxWidth } = useLayoutTier();
  const isAdmin = hasAnyRole(['ADMIN']);

  const [record, setRecord] = useState<StaticListRecord | null>(null);
  const [entries, setEntries] = useState<StaticListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const showMinAgeColumn = useMemo(
    () => staticListHasJsonField(entries, 'min-age'),
    [entries],
  );
  const showMaxAgeColumn = useMemo(
    () => staticListHasJsonField(entries, 'max-age'),
    [entries],
  );
  const showDescriptionColumn = useMemo(
    () => staticListHasJsonField(entries, 'description'),
    [entries],
  );
  const mdTableColumnCount =
    2 +
    (showMinAgeColumn ? 1 : 0) +
    (showMaxAgeColumn ? 1 : 0) +
    (showLgLayout && showDescriptionColumn ? 1 : 0);

  const valueColumnWidth = useMemo(() => valueButtonWidth(entries), [entries]);
  const valueColumnSx = useMemo(
    () => ({
      minWidth: valueColumnWidth,
      width: valueColumnWidth,
      boxSizing: 'border-box' as const,
    }),
    [valueColumnWidth],
  );

  const loadStaticList = useCallback(async () => {
    if (!decodedListCode) {
      setError('Static list not specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const list = await fetchStaticListByCode(decodedListCode);
      if (!list) {
        setRecord(null);
        setEntries([]);
        setError('Static list not found.');
        return;
      }

      setRecord(list);
      setEntries(list.listJson);
    } catch (loadError) {
      setRecord(null);
      setEntries([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load static list.');
    } finally {
      setLoading(false);
    }
  }, [decodedListCode]);

  useEffect(() => {
    void loadStaticList();
  }, [loadStaticList]);

  const handleOpenEdit = (index: number, field: EditField) => {
    const entry = entries[index];
    if (!entry) {
      return;
    }

    if (field === 'label') {
      setEditValue(entry.label);
    } else if (field === 'description') {
      setEditValue(entry.description ?? '');
    } else if (field === 'min-age') {
      setEditValue(entry.minAge === undefined ? '' : String(entry.minAge));
    } else {
      setEditValue(entry.maxAge === undefined ? '' : String(entry.maxAge));
    }

    setEditTarget({ index, field });
  };

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setEditTarget(null);
    setEditValue('');
  };

  const handleSaveEdit = async () => {
    if (editTarget === null || !record) {
      return;
    }

    const { index, field } = editTarget;
    const entry = entries[index];
    if (!entry) {
      return;
    }

    let nextEntries: StaticListEntry[];

    if (field === 'label') {
      const trimmedValue = editValue.trim();
      if (trimmedValue === '') {
        showProblem('Value cannot be empty.');
        return;
      }

      nextEntries = entries.map((row, rowIndex) =>
        rowIndex === index ? { ...row, label: trimmedValue } : row,
      );
    } else if (field === 'description') {
      const trimmedValue = editValue.trim();
      if (trimmedValue === '') {
        showProblem('Description cannot be empty.');
        return;
      }

      nextEntries = entries.map((row, rowIndex) =>
        rowIndex === index ? { ...row, description: trimmedValue } : row,
      );
    } else {
      const trimmedValue = editValue.trim();
      if (trimmedValue === '') {
        showProblem(`${editDialogLabel(field)} cannot be empty.`);
        return;
      }

      const parsed = Number.parseInt(trimmedValue, 10);
      if (!Number.isFinite(parsed)) {
        showProblem(`${editDialogLabel(field)} must be a whole number.`);
        return;
      }

      nextEntries = entries.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }

        if (field === 'min-age') {
          return { ...row, minAge: parsed };
        }

        return { ...row, maxAge: parsed };
      });
    }

    setSaving(true);

    try {
      const updated = await updateStaticListJson(record.listCode, nextEntries);
      setRecord(updated);
      setEntries(updated.listJson);
      setEditTarget(null);
      setEditValue('');
      showSuccess('Static list updated.');
    } catch (saveError) {
      showProblem(saveError instanceof Error ? saveError.message : 'Unable to save static list.');
    } finally {
      setSaving(false);
    }
  };

  const renderAgeCell = (
    index: number,
    field: StaticListJsonField,
    ageValue: number | undefined,
  ) => {
    if (ageValue === undefined) {
      return displayValue('');
    }

    if (ageValue === NOT_APPLICABLE_INT) {
      return formatStaticListAge(ageValue);
    }

    const displayText = formatStaticListAge(ageValue);

    if (isAdmin) {
      return (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleOpenEdit(index, field)}
          sx={{ textTransform: 'none', minWidth: 48 }}
        >
          {displayText}
        </Button>
      );
    }

    return displayText;
  };

  const renderDescriptionCell = (index: number, description: string | undefined) => {
    const displayText = description?.trim() ? truncateStaticListDescription(description) : '—';

    if (!isAdmin || description === undefined) {
      return displayValue(description ?? '');
    }

    return (
      <Button
        variant="outlined"
        size="small"
        onClick={() => handleOpenEdit(index, 'description')}
        sx={{
          textTransform: 'none',
          justifyContent: 'flex-start',
          textAlign: 'left',
          whiteSpace: 'normal',
          maxWidth: 360,
        }}
      >
        {displayText}
      </Button>
    );
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {record?.listCode || decodedListCode || 'Static List'}
        </Typography>

        {record?.shortDesc && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
            {record.shortDesc}
          </Typography>
        )}

        {record?.governingBodyCode && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
            Governing body: {record.governingBodyCode}
          </Typography>
        )}

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
          <Stack spacing={2}>
            {entries.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                No entries in this list.
              </Typography>
            ) : (
              entries.map((entry, index) => (
                <StaticListEntryMobileCard
                  key={entry.key}
                  entry={entry}
                  index={index}
                  isAdmin={isAdmin}
                  showMinAgeColumn={showMinAgeColumn}
                  showMaxAgeColumn={showMaxAgeColumn}
                  showDescriptionColumn={showDescriptionColumn}
                  onOpenEdit={handleOpenEdit}
                  renderAgeCell={renderAgeCell}
                  renderDescriptionCell={renderDescriptionCell}
                />
              ))
            )}
          </Stack>
        )}

        {!loading && !error && showMdLayout && (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" aria-label="Static list entries">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Key</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Value</TableCell>
                  {showMinAgeColumn && (
                    <TableCell sx={{ fontWeight: 700 }}>{staticListFieldLabel('min-age')}</TableCell>
                  )}
                  {showMaxAgeColumn && (
                    <TableCell sx={{ fontWeight: 700 }}>{staticListFieldLabel('max-age')}</TableCell>
                  )}
                  {showLgLayout && showDescriptionColumn && (
                    <TableCell sx={{ fontWeight: 700 }}>
                      {staticListFieldLabel('description')}
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={mdTableColumnCount} align="center">
                      No entries in this list.
                    </TableCell>
                  </TableRow>
                ) : (
                  entries.map((entry, index) => (
                    <TableRow key={entry.key} hover>
                      <TableCell>{displayValue(entry.key)}</TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenEdit(index, 'label')}
                            sx={{
                              ...valueColumnSx,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {displayValue(entry.label)}
                          </Button>
                        ) : (
                          <Typography component="span" sx={valueColumnSx}>
                            {displayValue(entry.label)}
                          </Typography>
                        )}
                      </TableCell>
                      {showMinAgeColumn && (
                        <TableCell>{renderAgeCell(index, 'min-age', entry.minAge)}</TableCell>
                      )}
                      {showMaxAgeColumn && (
                        <TableCell>{renderAgeCell(index, 'max-age', entry.maxAge)}</TableCell>
                      )}
                      {showLgLayout && showDescriptionColumn && (
                        <TableCell>{renderDescriptionCell(index, entry.description)}</TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/static-lists')}
            fullWidth={showXsLayout}
            sx={{ minWidth: { xs: '100%', md: 200 } }}
          >
            Back to Static Lists
          </Button>
        </Stack>
      </Paper>

      <Dialog
        open={editTarget !== null}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth={showLgLayout ? 'sm' : 'xs'}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
          }}
        >
          {editTarget ? editDialogTitle(editTarget.field) : 'Edit value'}
          <IconButton
            aria-label="Close"
            onClick={handleCloseEdit}
            disabled={saving}
            size="small"
            edge="end"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <AppTextField
            label={editTarget ? editDialogLabel(editTarget.field) : 'Value'}
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            fullWidth
            autoFocus
            disabled={saving}
            multiline={editTarget?.field === 'description'}
            minRows={editTarget?.field === 'description' ? 6 : undefined}
            type={
              editTarget?.field === 'label' || editTarget?.field === 'description'
                ? 'text'
                : 'number'
            }
            slotProps={
              editTarget?.field === 'label' || editTarget?.field === 'description'
                ? undefined
                : { htmlInput: { inputMode: 'numeric', min: 0, step: 1 } }
            }
            helperText={
              editTarget !== null && entries[editTarget.index]
                ? `Key: ${entries[editTarget.index].key}`
                : undefined
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEdit} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => void handleSaveEdit()} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
