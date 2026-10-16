import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type MouseEvent, useEffect, useRef, useState } from 'react';
import {
  fetchAppRoles,
  fetchEventMoreJson,
  parseEventRoleAssignments,
  parseEventStaff,
  type AppRoleRow,
  type EventRoleAssignment,
  type EventStaffMember,
  type EventStaffState,
} from '../api/postgrest';
import { ACCORDION_TABLE_ROW_GAP, mobileColumnSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';
import AppTextField from './AppTextField';
import DeleteIcon from './DeleteIcon';

export type EventStaffSummary = {
  hasStaff: boolean;
  staffCount: number;
};

type AddEventStaffProps = {
  eventId: number | null;
  expanded: boolean;
  onFieldEdit?: () => void;
  onSummaryChange?: (summary: EventStaffSummary) => void;
  onSaveStaff: (staff: EventStaffState) => void;
};

type HasStaffValue = 'yes' | 'no';

type StaffRoleOption = {
  roleCode: string;
  label: string;
};

const STAFF_COLUMNS = ['First Name', 'Last Name', 'Primary Role', 'Secondary Role'] as const;

function staffRoleOptions(
  roles: AppRoleRow[],
  assignments: EventRoleAssignment[],
): StaffRoleOption[] {
  const listed = roles.filter((role) => role.roleCode !== 'ADMIN');
  const assignmentByCode = new Map(assignments.map((role) => [role.roleCode, role]));
  const usedCodes = new Set(assignments.filter((role) => role.used).map((role) => role.roleCode));
  const source = usedCodes.size > 0 ? listed.filter((role) => usedCodes.has(role.roleCode)) : listed;

  return source.map((role) => {
    const assignedLabel = assignmentByCode.get(role.roleCode)?.label.trim() ?? '';
    return {
      roleCode: role.roleCode,
      label: assignedLabel || role.labels[0] || role.roleCode,
    };
  });
}

function optionsIncluding(
  options: StaffRoleOption[],
  roleCode: string,
  excludeRoleCode: string,
): StaffRoleOption[] {
  const visible = options.filter((option) => option.roleCode !== excludeRoleCode);
  if (roleCode === '' || visible.some((option) => option.roleCode === roleCode)) {
    return visible;
  }

  return [...visible, { roleCode, label: roleCode }];
}

function emptyMember(): EventStaffMember {
  return {
    id: crypto.randomUUID(),
    firstName: '',
    lastName: '',
    primaryRoleCode: '',
    secondaryRoleCode: '',
  };
}

export default function AddEventStaff({
  eventId,
  expanded,
  onFieldEdit,
  onSummaryChange,
  onSaveStaff,
}: AddEventStaffProps) {
  const { showXsLayout } = useLayoutTier();
  const [hasStaff, setHasStaff] = useState(false);
  const [members, setMembers] = useState<EventStaffMember[]>([]);
  const [roleOptions, setRoleOptions] = useState<StaffRoleOption[]>([]);
  const [loading, setLoading] = useState(eventId !== null);
  const eventIdRef = useRef(eventId);
  const hasStaffRef = useRef(hasStaff);
  const membersRef = useRef(members);
  const dirtyRef = useRef(false);
  const expandedRef = useRef(expanded);
  const loadedEventIdRef = useRef<number | null | undefined>(undefined);
  const onSaveStaffRef = useRef(onSaveStaff);
  const onSummaryChangeRef = useRef(onSummaryChange);

  useEffect(() => {
    if (eventId !== null) {
      eventIdRef.current = eventId;
    }
  }, [eventId]);

  useEffect(() => {
    hasStaffRef.current = hasStaff;
  }, [hasStaff]);

  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  useEffect(() => {
    onSaveStaffRef.current = onSaveStaff;
  }, [onSaveStaff]);

  useEffect(() => {
    onSummaryChangeRef.current = onSummaryChange;
  }, [onSummaryChange]);

  useEffect(() => {
    onSummaryChangeRef.current?.({
      hasStaff,
      staffCount: members.filter(
        (member) =>
          member.firstName.trim() !== ''
          || member.lastName.trim() !== ''
          || member.primaryRoleCode !== ''
          || member.secondaryRoleCode !== '',
      ).length,
    });
  }, [hasStaff, members]);

  useEffect(() => {
    if (loadedEventIdRef.current === eventId) {
      return;
    }

    if (loadedEventIdRef.current === null && eventId !== null) {
      loadedEventIdRef.current = eventId;
      eventIdRef.current = eventId;
      return;
    }

    loadedEventIdRef.current = eventId;
    if (eventId === null) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchEventMoreJson(eventId)
      .then((moreJson) => {
        if (cancelled || dirtyRef.current) {
          return;
        }

        const staff = parseEventStaff(moreJson);
        hasStaffRef.current = staff.hasStaff;
        membersRef.current = staff.members;
        setHasStaff(staff.hasStaff);
        setMembers(staff.members);
      })
      .catch(() => {
        if (!cancelled) {
          setHasStaff(false);
          setMembers([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    let cancelled = false;
    const existingEventId = eventIdRef.current;

    void Promise.all([
      fetchAppRoles(),
      existingEventId === null ? Promise.resolve(null) : fetchEventMoreJson(existingEventId),
    ])
      .then(([roles, moreJson]) => {
        if (cancelled) {
          return;
        }

        const assignments = moreJson === null ? [] : parseEventRoleAssignments(moreJson);
        setRoleOptions(staffRoleOptions(roles, assignments));
      })
      .catch(() => {
        if (!cancelled) {
          setRoleOptions([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [expanded, eventId]);

  const saveCurrent = () => {
    if (!dirtyRef.current) {
      return;
    }

    dirtyRef.current = false;
    onSaveStaffRef.current({
      hasStaff: hasStaffRef.current,
      members: membersRef.current,
    });
  };

  useEffect(() => {
    const wasExpanded = expandedRef.current;
    expandedRef.current = expanded;
    if (wasExpanded && !expanded) {
      saveCurrent();
    }
  }, [expanded]);

  const markEdited = () => {
    dirtyRef.current = true;
    onFieldEdit?.();
  };

  const handleHasStaffChange = (
    _event: MouseEvent<HTMLElement>,
    nextValue: HasStaffValue | null,
  ) => {
    if (nextValue === null) {
      return;
    }

    const nextHasStaff = nextValue === 'yes';
    hasStaffRef.current = nextHasStaff;
    setHasStaff(nextHasStaff);
    markEdited();
  };

  const handleAddStaff = () => {
    if (!hasStaffRef.current) {
      return;
    }

    const next = [...membersRef.current, emptyMember()];
    membersRef.current = next;
    setMembers(next);
    markEdited();
  };

  const updateMember = (memberId: string, patch: Partial<EventStaffMember>) => {
    const next = membersRef.current.map((member) => {
      if (member.id !== memberId) {
        return member;
      }

      const updated = { ...member, ...patch };
      if (
        updated.secondaryRoleCode !== ''
        && updated.secondaryRoleCode === updated.primaryRoleCode
      ) {
        updated.secondaryRoleCode = '';
      }
      return updated;
    });
    membersRef.current = next;
    setMembers(next);
    markEdited();
  };

  const handleDeleteMember = (memberId: string) => {
    const next = membersRef.current.filter((member) => member.id !== memberId);
    membersRef.current = next;
    setMembers(next);
    markEdited();
  };

  const roleMenu = (
    member: EventStaffMember,
    field: 'primaryRoleCode' | 'secondaryRoleCode',
    label: string,
  ) => {
    const excludeRoleCode =
      field === 'primaryRoleCode' ? member.secondaryRoleCode : member.primaryRoleCode;
    const options = optionsIncluding(roleOptions, member[field], excludeRoleCode);

    return (
      <AppTextField
        select
        size="small"
        label={showXsLayout ? label : undefined}
        value={member[field]}
        onChange={(event) => updateMember(member.id, { [field]: event.target.value })}
        fullWidth
        slotProps={{
          inputLabel: showXsLayout ? { sx: { fontWeight: 700 } } : undefined,
          select: { displayEmpty: true },
          htmlInput: { 'aria-label': label },
        }}
      >
        <MenuItem value="">
          <em>Select role</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.roleCode} value={option.roleCode}>
            {option.label}
          </MenuItem>
        ))}
      </AppTextField>
    );
  };

  return (
    <Box sx={mobileColumnSx}>
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography component="span" variant="body2" sx={{ fontWeight: 700 }}>
            Has Staff
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={hasStaff ? 'yes' : 'no'}
            onChange={handleHasStaffChange}
            aria-label="Has Staff"
            disabled={loading}
          >
            <ToggleButton value="no" aria-label="No">
              No
            </ToggleButton>
            <ToggleButton value="yes" aria-label="Yes">
              Yes
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {hasStaff ? (
          showXsLayout ? (
            <Stack spacing={1.5}>
              {members.length === 0 ? (
                <Stack spacing={0.5}>
                  {STAFF_COLUMNS.map((column) => (
                    <Typography
                      key={column}
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 700 }}
                    >
                      {column}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                members.map((member, index) => (
                  <Stack
                    key={member.id}
                    spacing={1}
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1.5,
                    }}
                  >
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Staff {index + 1}
                      </Typography>
                      <IconButton
                        aria-label={`Remove staff ${index + 1}`}
                        size="small"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <AppTextField
                      size="small"
                      label="First Name"
                      value={member.firstName}
                      onChange={(event) => updateMember(member.id, { firstName: event.target.value })}
                      fullWidth
                      slotProps={{ inputLabel: { sx: { fontWeight: 700 } } }}
                    />
                    <AppTextField
                      size="small"
                      label="Last Name"
                      value={member.lastName}
                      onChange={(event) => updateMember(member.id, { lastName: event.target.value })}
                      fullWidth
                      slotProps={{ inputLabel: { sx: { fontWeight: 700 } } }}
                    />
                    {roleMenu(member, 'primaryRoleCode', 'Primary Role')}
                    {roleMenu(member, 'secondaryRoleCode', 'Secondary Role')}
                  </Stack>
                ))
              )}
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(140px, 1fr) minmax(140px, 1fr) auto',
                columnGap: 2,
                rowGap: ACCORDION_TABLE_ROW_GAP,
                alignItems: 'center',
                width: '100%',
              }}
            >
              {STAFF_COLUMNS.map((column) => (
                <Typography
                  key={column}
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 700 }}
                >
                  {column}
                </Typography>
              ))}
              <Box />
              {members.map((member, index) => (
                <Box key={member.id} sx={{ display: 'contents' }}>
                  <AppTextField
                    size="small"
                    value={member.firstName}
                    onChange={(event) => updateMember(member.id, { firstName: event.target.value })}
                    fullWidth
                    slotProps={{
                      htmlInput: { 'aria-label': `First name for staff ${index + 1}` },
                    }}
                  />
                  <AppTextField
                    size="small"
                    value={member.lastName}
                    onChange={(event) => updateMember(member.id, { lastName: event.target.value })}
                    fullWidth
                    slotProps={{
                      htmlInput: { 'aria-label': `Last name for staff ${index + 1}` },
                    }}
                  />
                  {roleMenu(member, 'primaryRoleCode', `Primary role for staff ${index + 1}`)}
                  {roleMenu(member, 'secondaryRoleCode', `Secondary role for staff ${index + 1}`)}
                  <IconButton
                    aria-label={`Remove staff ${index + 1}`}
                    size="small"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )
        ) : null}

        {hasStaff ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="outlined" onClick={handleAddStaff}>
              Add Staff
            </Button>
          </Box>
        ) : null}
      </Stack>
    </Box>
  );
}
