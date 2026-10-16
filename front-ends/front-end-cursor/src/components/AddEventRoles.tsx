import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  clampEventRoleCount,
  fetchAppRoles,
  fetchEventMoreJson,
  parseEventRoleAssignments,
  type AppRoleRow,
  type EventRoleAssignment,
} from '../api/postgrest';
import { ACCORDION_TABLE_ROW_GAP } from '../constants/layout';

type AddEventRolesProps = {
  eventId: number | null;
  onSaveRoles: (roles: EventRoleAssignment[]) => void;
  onFieldEdit?: () => void;
};

type RoleSelection = {
  used: boolean;
  label: string;
  count: number;
};

const ROLE_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const SELECT_CHROME_PX = 14 + 32 + 12;

function defaultLabel(labels: string[]): string {
  return labels[0] ?? '';
}

function selectedLabel(labels: string[], current: string | undefined): string {
  if (current && labels.includes(current)) {
    return current;
  }

  return defaultLabel(labels);
}

function measureTextWidth(text: string, font = '16px Roboto, Helvetica, Arial, sans-serif'): number {
  if (typeof document === 'undefined') {
    return text.length * 8;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return text.length * 8;
  }

  context.font = font;
  return context.measureText(text).width;
}

function roleCountIsApplicable(roleCode: string): boolean {
  return roleCode !== 'COMPETITOR';
}

function listedEventRoles(roles: AppRoleRow[]): AppRoleRow[] {
  return roles.filter((role) => role.roleCode !== 'ADMIN');
}

function selectWidthForOptions(options: string[]): number {
  const longest = options.reduce((max, option) => Math.max(max, measureTextWidth(option)), 0);
  return Math.ceil(longest + SELECT_CHROME_PX);
}

function selectionFromRoles(
  roles: AppRoleRow[],
  saved: EventRoleAssignment[],
  current: Record<string, RoleSelection>,
): Record<string, RoleSelection> {
  const savedByCode = new Map(saved.map((role) => [role.roleCode, role]));
  const next: Record<string, RoleSelection> = {};

  for (const role of roles) {
    const existing = current[role.roleCode];
    const stored = savedByCode.get(role.roleCode);
    next[role.roleCode] = {
      used: existing?.used ?? stored?.used ?? false,
      label: selectedLabel(role.labels, existing?.label ?? stored?.label),
      count: clampEventRoleCount(existing?.count ?? stored?.count ?? 1),
    };
  }

  return next;
}

function toAssignments(
  roles: AppRoleRow[],
  selection: Record<string, RoleSelection>,
): EventRoleAssignment[] {
  return roles.map((role) => {
    const row = selection[role.roleCode];
    return {
      roleCode: role.roleCode,
      used: row?.used ?? false,
      label: selectedLabel(role.labels, row?.label),
      count: roleCountIsApplicable(role.roleCode) ? clampEventRoleCount(row?.count ?? 1) : null,
    };
  });
}

export default function AddEventRoles({
  eventId,
  onSaveRoles,
  onFieldEdit,
}: AddEventRolesProps) {
  const [roles, setRoles] = useState<AppRoleRow[]>([]);
  const [selection, setSelection] = useState<Record<string, RoleSelection>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const eventIdRef = useRef(eventId);
  const rolesRef = useRef(roles);
  const selectionRef = useRef(selection);
  const onSaveRolesRef = useRef(onSaveRoles);
  const loadedEventIdRef = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (eventId !== null) {
      eventIdRef.current = eventId;
    }
  }, [eventId]);

  useEffect(() => {
    rolesRef.current = roles;
  }, [roles]);

  useEffect(() => {
    selectionRef.current = selection;
  }, [selection]);

  useEffect(() => {
    onSaveRolesRef.current = onSaveRoles;
  }, [onSaveRoles]);

  const labelWidth = useMemo(
    () => selectWidthForOptions(roles.flatMap((role) => (role.labels.length > 0 ? role.labels : ['—']))),
    [roles],
  );
  const countWidth = useMemo(
    () => selectWidthForOptions(ROLE_COUNTS.map((count) => String(count))),
    [],
  );

  const loadRoles = useCallback(async (existingEventId: number | null) => {
    setLoading(true);
    setError(null);

    try {
      const [rows, moreJson] = await Promise.all([
        fetchAppRoles(),
        existingEventId === null ? Promise.resolve(null) : fetchEventMoreJson(existingEventId),
      ]);
      const saved = moreJson === null ? [] : parseEventRoleAssignments(moreJson);
      const listed = listedEventRoles(rows);
      setRoles(listed);
      setSelection((current) => selectionFromRoles(listed, saved, current));
    } catch (loadError) {
      setRoles([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load roles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loadedEventIdRef.current === eventId) {
      return;
    }

    // A new event id assigned while creating should not reload over the roles just saved.
    if (loadedEventIdRef.current === null && eventId !== null) {
      loadedEventIdRef.current = eventId;
      eventIdRef.current = eventId;
      return;
    }

    loadedEventIdRef.current = eventId;
    eventIdRef.current = eventId;
    void loadRoles(eventId);
  }, [eventId, loadRoles]);

  const persistSelection = (next: Record<string, RoleSelection>) => {
    onSaveRolesRef.current(toAssignments(rolesRef.current, next));
  };

  const updateRole = (roleCode: string, patch: Partial<RoleSelection>) => {
    const existing = selectionRef.current[roleCode] ?? {
      used: false,
      label: '',
      count: 1,
    };
    const next = {
      ...selectionRef.current,
      [roleCode]: {
        ...existing,
        ...patch,
      },
    };
    selectionRef.current = next;
    setSelection(next);
    persistSelection(next);
    onFieldEdit?.();
  };

  if (loading) {
    return (
      <Stack sx={{ py: 3, alignItems: 'center' }}>
        <CircularProgress size={28} />
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  if (roles.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        No roles found.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `auto auto ${labelWidth}px max-content`,
        columnGap: { xs: 1, md: 2 },
        rowGap: ACCORDION_TABLE_ROW_GAP,
        alignItems: 'center',
        justifyContent: 'start',
        justifyItems: 'start',
        width: '100%',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        Use
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        Role Code
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        Label
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
        Target Count
      </Typography>

      {roles.map((role) => {
        const row = selection[role.roleCode] ?? {
          used: false,
          label: defaultLabel(role.labels),
          count: 1,
        };
        const labelValue = selectedLabel(role.labels, row.label);

        return (
          <Box key={role.roleCode} sx={{ display: 'contents' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Checkbox
                checked={row.used}
                onChange={(event) => updateRole(role.roleCode, { used: event.target.checked })}
                slotProps={{ input: { 'aria-label': `Use ${role.roleCode}` } }}
                sx={{ p: 0.5 }}
              />
            </Box>
            <Typography variant="body2" sx={{ minWidth: 0, wordBreak: 'break-word' }}>
              {role.roleCode}
            </Typography>
            <FormControl size="small" disabled={!row.used || role.labels.length === 0} sx={{ width: labelWidth }}>
              <Select
                value={labelValue}
                displayEmpty
                onChange={(event) => updateRole(role.roleCode, { label: event.target.value })}
                aria-label={`Label for ${role.roleCode}`}
              >
                {role.labels.length === 0 ? (
                  <MenuItem value="">—</MenuItem>
                ) : (
                  role.labels.map((label, index) => (
                    <MenuItem key={`${label}-${index}`} value={label}>
                      {label}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            {roleCountIsApplicable(role.roleCode) ? (
              <FormControl size="small" disabled={!row.used} sx={{ width: countWidth }}>
                <Select
                  value={row.count}
                  onChange={(event) =>
                    updateRole(role.roleCode, { count: clampEventRoleCount(event.target.value) })
                  }
                  aria-label={`Target count for ${role.roleCode}`}
                >
                  {ROLE_COUNTS.map((count) => (
                    <MenuItem key={count} value={count}>
                      {count}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography variant="body2">N/A</Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
