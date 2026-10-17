import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type FocusEvent, type MouseEvent, useEffect, useRef, useState } from 'react';
import {
  fetchAppRoles,
  fetchEventMoreJson,
  lookupStaffRegistration,
  parseEventRoleAssignments,
  parseEventStaff,
  previewQuickRegisterUsernames,
  quickRegisterUser,
  type AppRoleRow,
  type EventRoleAssignment,
  type EventStaffMember,
  type EventStaffState,
  type StaffRegistrationMatch,
} from '../api/postgrest';
import { ACCORDION_TABLE_ROW_GAP, mobileColumnSx } from '../constants/layout';
import { useAppliedEventImport, useReportEventFormSection } from '../context/EventFormExportContext';
import { registerEventFormSyncFlush } from '../lib/eventFormFlush';
import { trimSavedText } from '../utils/trimSavedText';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import {
  quickRegistrationBatchSummary,
  quickRegistrationRegisteredMessage,
  quickRegistrationUsernameHint,
} from '../utils/quickRegistration';
import AppTextField from './AppTextField';
import DeleteIcon from './DeleteIcon';
import QuickRegisterAllDialog, { type QuickRegisterAllPerson } from './QuickRegisterAllDialog';
import QuickRegisterDialog from './QuickRegisterDialog';
import StaffRegistrationMark from './StaffRegistrationMark';

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

const STAFF_COLUMNS = [
  'First Name',
  'Last Name',
  'Primary Role',
  'Secondary Role',
  'Registered',
] as const;

function staffRowHasEntry(member: EventStaffMember): boolean {
  return (
    member.firstName.trim() !== ''
    || member.lastName.trim() !== ''
    || member.primaryRoleCode !== ''
    || member.secondaryRoleCode !== ''
  );
}

function staffNameReady(member: EventStaffMember): boolean {
  return member.firstName.trim() !== '' && member.lastName.trim() !== '';
}

function staffReadyForLookup(member: EventStaffMember): boolean {
  return staffNameReady(member) && member.primaryRoleCode !== '';
}

const ADMIN_ONLY_STAFF_ROLES = new Set(['EVENT_DIRECTOR', 'EVENT_MANAGER']);

function rolesVisibleToViewer(options: StaffRoleOption[], viewerIsAdmin: boolean): StaffRoleOption[] {
  if (viewerIsAdmin) {
    return options;
  }

  return options.filter((option) => !ADMIN_ONLY_STAFF_ROLES.has(option.roleCode));
}

function staffMemberValueKey(member: EventStaffMember): string {
  return [
    member.firstName.trim(),
    member.lastName.trim(),
    member.primaryRoleCode,
    member.secondaryRoleCode,
  ].join('\u0000');
}

function completeStaffChanged(
  current: EventStaffMember[],
  saved: EventStaffMember[],
): boolean {
  const savedById = new Map(saved.map((member) => [member.id, member]));
  const currentIds = new Set(current.map((member) => member.id));

  for (const member of current) {
    if (!staffReadyForLookup(member)) {
      continue;
    }
    const previous = savedById.get(member.id);
    if (!previous || staffMemberValueKey(previous) !== staffMemberValueKey(member)) {
      return true;
    }
  }

  for (const previous of saved) {
    if (staffReadyForLookup(previous) && !currentIds.has(previous.id)) {
      return true;
    }
  }

  return false;
}

type StaffSortKey = 'primaryRole' | 'firstName' | 'lastName' | 'registration';

function compareStaffText(left: string, right: string): number {
  const normalizedLeft = left.trim();
  const normalizedRight = right.trim();
  if (normalizedLeft === '' && normalizedRight === '') {
    return 0;
  }
  if (normalizedLeft === '') {
    return 1;
  }
  if (normalizedRight === '') {
    return -1;
  }
  return normalizedLeft.localeCompare(normalizedRight, undefined, { sensitivity: 'base' });
}

function registrationSortRank(
  member: EventStaffMember,
  registrationById: Record<string, StaffRegistrationMatch>,
): number {
  if (!staffReadyForLookup(member)) {
    return 3;
  }
  const status = registrationById[member.id]?.status;
  if (status === 'registered') {
    return 0;
  }
  if (status === 'partial') {
    return 1;
  }
  if (status === 'none') {
    return 2;
  }
  return 3;
}

function sortStaffMembers(
  members: EventStaffMember[],
  sortKey: StaffSortKey,
  roleOptions: StaffRoleOption[],
  registrationById: Record<string, StaffRegistrationMatch>,
): EventStaffMember[] {
  const roleLabel = (roleCode: string) =>
    roleOptions.find((option) => option.roleCode === roleCode)?.label || roleCode;

  return [...members].sort((left, right) => {
    let compared = 0;
    if (sortKey === 'primaryRole') {
      compared = compareStaffText(roleLabel(left.primaryRoleCode), roleLabel(right.primaryRoleCode));
    } else if (sortKey === 'firstName') {
      compared = compareStaffText(left.firstName, right.firstName);
    } else if (sortKey === 'lastName') {
      compared = compareStaffText(left.lastName, right.lastName);
    } else {
      compared = registrationSortRank(left, registrationById) - registrationSortRank(right, registrationById);
    }

    if (compared !== 0) {
      return compared;
    }
    compared = compareStaffText(left.lastName, right.lastName);
    if (compared !== 0) {
      return compared;
    }
    compared = compareStaffText(left.firstName, right.firstName);
    if (compared !== 0) {
      return compared;
    }
    return left.id.localeCompare(right.id);
  });
}

function staffOrderChanged(current: EventStaffMember[], saved: EventStaffMember[]): boolean {
  if (current.length !== saved.length) {
    return false;
  }
  return current.some((member, index) => member.id !== saved[index]?.id);
}

function staffRoleOptions(
  roles: AppRoleRow[],
  assignments: EventRoleAssignment[],
): StaffRoleOption[] {
  const listed = roles.filter(
    (role) => role.roleCode !== 'ADMIN' && role.roleCode !== 'COMPETITOR',
  );
  const assignmentByCode = new Map(assignments.map((role) => [role.roleCode, role]));
  const usedCodes = new Set(assignments.filter((role) => role.used).map((role) => role.roleCode));
  const source = usedCodes.size > 0
    ? listed.filter(
      (role) => usedCodes.has(role.roleCode) || ADMIN_ONLY_STAFF_ROLES.has(role.roleCode),
    )
    : listed;

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
  if (
    roleCode === ''
    || roleCode === 'COMPETITOR'
    || visible.some((option) => option.roleCode === roleCode)
  ) {
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
  const { showProblem, showSuccess, showWarning } = useMessages();
  const { hasAnyRole } = useAuth();
  const viewerIsAdmin = hasAnyRole(['ADMIN']);
  const [hasStaff, setHasStaff] = useState(false);
  const [members, setMembers] = useState<EventStaffMember[]>([]);
  const [roleOptions, setRoleOptions] = useState<StaffRoleOption[]>([]);
  const [registrationById, setRegistrationById] = useState<
    Record<string, StaffRegistrationMatch>
  >({});
  const [sortBy, setSortBy] = useState<StaffSortKey | ''>('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingQuickRegisterId, setPendingQuickRegisterId] = useState<string | null>(null);
  const [quickRegisterBusy, setQuickRegisterBusy] = useState(false);
  const [singleQuickRegisterHint, setSingleQuickRegisterHint] = useState<string | null>(null);
  const [quickRegisterAllOpen, setQuickRegisterAllOpen] = useState(false);
  const [quickRegisterAllBusy, setQuickRegisterAllBusy] = useState(false);
  const [quickRegisterAllPeople, setQuickRegisterAllPeople] = useState<QuickRegisterAllPerson[]>([]);
  const [quickRegisterAllSkipped, setQuickRegisterAllSkipped] = useState<string[]>([]);
  const [loading, setLoading] = useState(eventId !== null);
  const eventIdRef = useRef(eventId);
  const hasStaffRef = useRef(hasStaff);
  const membersRef = useRef(members);
  const dirtyRef = useRef(false);
  const expandedRef = useRef(expanded);
  const onSaveStaffRef = useRef(onSaveStaff);
  const onSummaryChangeRef = useRef(onSummaryChange);
  const lookupSeqRef = useRef(0);
  const lookupTimerRef = useRef<number | null>(null);
  const savedMembersRef = useRef<EventStaffMember[]>([]);
  const savedHasStaffRef = useRef(false);
  const textFocusValueRef = useRef('');
  const reportExport = useReportEventFormSection();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);
  const hydratedImportTokenRef = useRef(0);

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
    if (loading) {
      return;
    }

    reportExport('staff', { hasStaff, members, registrationById });
  }, [hasStaff, loading, members, registrationById, reportExport]);

  useEffect(() => {
    if (eventId === null) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchEventMoreJson(eventId)
      .then((moreJson) => {
        if (cancelled || dirtyRef.current || hydratedImportTokenRef.current !== 0) {
          return;
        }

        const staff = parseEventStaff(moreJson);
        hasStaffRef.current = staff.hasStaff;
        membersRef.current = staff.members;
        savedHasStaffRef.current = staff.hasStaff;
        savedMembersRef.current = staff.members.map((member) => ({ ...member }));
        setHasStaff(staff.hasStaff);
        setMembers(staff.members);
      })
      .catch(() => {
        if (!cancelled && !dirtyRef.current) {
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

  const cancelScheduledLookup = () => {
    if (lookupTimerRef.current !== null) {
      window.clearTimeout(lookupTimerRef.current);
      lookupTimerRef.current = null;
    }
  };

  const runRegistrationLookup = (staffMembers: EventStaffMember[]) => {
    cancelScheduledLookup();
    const seq = lookupSeqRef.current + 1;
    lookupSeqRef.current = seq;
    const people = staffMembers.filter(staffNameReady).map((member) => ({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
    }));

    void lookupStaffRegistration(people)
      .then((matches) => {
        if (lookupSeqRef.current === seq) {
          setRegistrationById(matches);
        }
      })
      .catch(() => {
        if (lookupSeqRef.current === seq) {
          setRegistrationById({});
        }
      });
  };

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    hydratedImportTokenRef.current = appliedImport.token;
    hasStaffRef.current = appliedImport.staff.hasStaff;
    membersRef.current = appliedImport.staff.members;
    dirtyRef.current = true;
    setLoading(false);
    setHasStaff(appliedImport.staff.hasStaff);
    setMembers(appliedImport.staff.members);
    onSaveStaffRef.current(appliedImport.staff);
    runRegistrationLookup(appliedImport.staff.members);

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport]);

  const scheduleRegistrationLookup = (staffMembers: EventStaffMember[]) => {
    cancelScheduledLookup();
    lookupTimerRef.current = window.setTimeout(() => {
      lookupTimerRef.current = null;
      runRegistrationLookup(staffMembers);
    }, 300);
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    runRegistrationLookup(membersRef.current);

    return () => {
      lookupSeqRef.current += 1;
      cancelScheduledLookup();
    };
  }, [loading, eventId]);

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

  const commitStaffSave = () => {
    const trimmedMembers = membersRef.current.map((member) => ({
      ...member,
      firstName: trimSavedText(member.firstName),
      lastName: trimSavedText(member.lastName),
    }));
    const namesChanged = trimmedMembers.some(
      (member, index) =>
        member.firstName !== membersRef.current[index]?.firstName
        || member.lastName !== membersRef.current[index]?.lastName,
    );
    if (namesChanged) {
      membersRef.current = trimmedMembers;
      setMembers(trimmedMembers);
    }

    const membersChanged = completeStaffChanged(membersRef.current, savedMembersRef.current)
      || staffOrderChanged(membersRef.current, savedMembersRef.current);
    const hasStaffChanged = hasStaffRef.current !== savedHasStaffRef.current;
    if (!membersChanged && !hasStaffChanged) {
      return;
    }

    savedMembersRef.current = membersRef.current.map((member) => ({ ...member }));
    savedHasStaffRef.current = hasStaffRef.current;
    dirtyRef.current = false;
    onSaveStaffRef.current({
      hasStaff: hasStaffRef.current,
      members: membersRef.current,
    });
  };

  const commitStaffSaveRef = useRef(commitStaffSave);
  commitStaffSaveRef.current = commitStaffSave;

  useEffect(() => {
    const wasExpanded = expandedRef.current;
    expandedRef.current = expanded;
    if (wasExpanded && !expanded) {
      commitStaffSaveRef.current();
    }
  }, [expanded]);

  useEffect(() => {
    return () => {
      commitStaffSaveRef.current();
    };
  }, []);

  useEffect(() => {
    return registerEventFormSyncFlush(() => {
      commitStaffSaveRef.current();
    });
  }, []);

  const rememberTextFocus = (value: string) => {
    textFocusValueRef.current = value;
  };

  const handleTextBlur = (memberId: string, field: 'firstName' | 'lastName') => {
    const member = membersRef.current.find((item) => item.id === memberId);
    if (!member) {
      return;
    }

    const trimmed = trimSavedText(member[field]);
    const edited = member[field] !== textFocusValueRef.current || trimmed !== member[field];
    if (trimmed !== member[field]) {
      updateMember(memberId, { [field]: trimmed });
    }

    const current = membersRef.current.find((item) => item.id === memberId);
    if (!edited || !current || !staffReadyForLookup(current)) {
      return;
    }
    commitStaffSave();
  };

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
    runRegistrationLookup(next);
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

    const affectsRegistration =
      'firstName' in patch || 'lastName' in patch || 'primaryRoleCode' in patch;

    if (affectsRegistration) {
      const updatedMember = next.find((member) => member.id === memberId);
      if (updatedMember && !staffNameReady(updatedMember)) {
        setRegistrationById((current) => {
          if (!(memberId in current)) {
            return current;
          }
          const remaining = { ...current };
          delete remaining[memberId];
          return remaining;
        });
      }

      if ('primaryRoleCode' in patch) {
        runRegistrationLookup(next);
      } else {
        scheduleRegistrationLookup(next);
      }
    }

    if ('primaryRoleCode' in patch || 'secondaryRoleCode' in patch) {
      commitStaffSave();
    }
  };

  const removeMember = (memberId: string) => {
    const next = membersRef.current.filter((member) => member.id !== memberId);
    membersRef.current = next;
    setMembers(next);
    markEdited();
    commitStaffSave();
  };

  const handleDeleteMember = (memberId: string) => {
    const member = membersRef.current.find((row) => row.id === memberId);
    if (member && staffRowHasEntry(member)) {
      setPendingDeleteId(memberId);
      return;
    }
    removeMember(memberId);
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      removeMember(pendingDeleteId);
    }
    setPendingDeleteId(null);
  };

  useEffect(() => {
    if (!pendingQuickRegisterId) {
      setSingleQuickRegisterHint(null);
      return;
    }

    const member = membersRef.current.find((row) => row.id === pendingQuickRegisterId);
    if (!member) {
      setSingleQuickRegisterHint(null);
      return;
    }

    let cancelled = false;
    void previewQuickRegisterUsernames([
      { id: member.id, firstName: member.firstName, lastName: member.lastName },
    ])
      .then((people) => {
        if (cancelled) {
          return;
        }
        const person = people[0];
        if (!person?.ok || !person.incremented) {
          setSingleQuickRegisterHint(null);
          return;
        }
        setSingleQuickRegisterHint(
          quickRegistrationUsernameHint(
            `${person.firstName} ${person.lastName}`,
            person.baseUsername,
            person.username,
            'will',
          ),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setSingleQuickRegisterHint(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pendingQuickRegisterId]);

  const cancelQuickRegister = () => {
    if (quickRegisterBusy) {
      return;
    }
    setPendingQuickRegisterId(null);
  };

  const confirmQuickRegister = () => {
    const member = membersRef.current.find((row) => row.id === pendingQuickRegisterId);
    if (!member || quickRegisterBusy) {
      return;
    }

    const firstName = member.firstName.trim();
    const lastName = member.lastName.trim();
    setQuickRegisterBusy(true);

    void quickRegisterUser(firstName, lastName)
      .then(async (result) => {
        if (!result.ok || !result.username || !result.password) {
          showProblem(result.message || 'Unable to quick register.');
          return;
        }

        const hint = quickRegistrationUsernameHint(
          `${firstName} ${lastName}`,
          result.base_username?.trim() || result.password,
          result.username,
          'uses',
        );
        showSuccess(
          [quickRegistrationRegisteredMessage(firstName, lastName), hint].filter(Boolean).join(' '),
        );
        setRegistrationById((current) => ({
          ...current,
          [member.id]: {
            status: 'partial',
            username: result.username ?? null,
            isAdmin: false,
            quickReg: true,
          },
        }));
        setPendingQuickRegisterId(null);
        cancelScheduledLookup();
        const seq = lookupSeqRef.current + 1;
        lookupSeqRef.current = seq;
        const people = membersRef.current.filter(staffNameReady).map((row) => ({
          id: row.id,
          firstName: row.firstName,
          lastName: row.lastName,
        }));

        try {
          const matches = await lookupStaffRegistration(people);
          if (lookupSeqRef.current !== seq) {
            return;
          }
          const lookedUp = matches[member.id];
          setRegistrationById({
            ...matches,
            [member.id]: lookedUp && lookedUp.status !== 'none'
              ? lookedUp
              : {
                  status: 'partial',
                  username: result.username ?? null,
                  isAdmin: false,
                  quickReg: true,
                },
          });
        } catch {
          if (lookupSeqRef.current !== seq) {
            return;
          }
          setRegistrationById((current) => ({
            ...current,
            [member.id]: {
              status: 'partial',
              username: result.username ?? null,
              isAdmin: false,
              quickReg: true,
            },
          }));
        }
      })
      .catch((error: unknown) => {
        showProblem(error instanceof Error ? error.message : 'Unable to quick register.');
      })
      .finally(() => {
        setQuickRegisterBusy(false);
      });
  };

  const reportQuickRegisterBatch = (successCount: number, failures: string[], hints: string[]) => {
    const message = quickRegistrationBatchSummary(successCount, failures, hints);
    if (failures.length === 0) {
      showSuccess(message);
      return;
    }
    if (successCount === 0) {
      showProblem(message);
      return;
    }
    showWarning(message);
  };

  const openQuickRegisterAll = () => {
    if (quickRegisterAllBusy || quickRegisterBusy) {
      return;
    }

    const candidates = membersRef.current.filter(
      (member) => staffReadyForLookup(member) && registrationById[member.id]?.status === 'none',
    );
    if (candidates.length === 0) {
      showProblem('No staff need Quick Registration.');
      return;
    }

    setQuickRegisterAllBusy(true);
    void previewQuickRegisterUsernames(
      candidates.map((member) => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
      })),
    )
      .then((people) => {
        const ready: QuickRegisterAllPerson[] = [];
        const skipped: string[] = [];
        for (const person of people) {
          const name = `${person.firstName} ${person.lastName}`.trim();
          if (!person.ok) {
            skipped.push(person.message || `${name} cannot be Quick Registered.`);
            continue;
          }
          ready.push({
            id: person.id,
            name,
            hint: person.incremented
              ? quickRegistrationUsernameHint(name, person.baseUsername, person.username, 'will')
              : null,
          });
        }

        if (ready.length === 0) {
          reportQuickRegisterBatch(0, skipped, []);
          return;
        }

        setQuickRegisterAllPeople(ready);
        setQuickRegisterAllSkipped(skipped);
        setQuickRegisterAllOpen(true);
      })
      .catch((error: unknown) => {
        showProblem(error instanceof Error ? error.message : 'Unable to preview Quick Registration.');
      })
      .finally(() => {
        setQuickRegisterAllBusy(false);
      });
  };

  const cancelQuickRegisterAll = () => {
    if (quickRegisterAllBusy) {
      return;
    }
    setQuickRegisterAllOpen(false);
  };

  const confirmQuickRegisterAll = () => {
    if (quickRegisterAllBusy || quickRegisterAllPeople.length === 0) {
      return;
    }

    const planned = quickRegisterAllPeople;
    setQuickRegisterAllBusy(true);

    void (async () => {
      const failures: string[] = [];
      const hints: string[] = [];
      const succeeded = new Map<string, string>();

      for (const person of planned) {
        const member = membersRef.current.find((row) => row.id === person.id);
        const name = person.name;
        if (!member) {
          failures.push(`${name} is no longer on the staff list.`);
          continue;
        }

        try {
          const result = await quickRegisterUser(member.firstName, member.lastName);
          if (!result.ok || !result.username || !result.password) {
            failures.push(result.message || `${name} was not registered.`);
            continue;
          }

          succeeded.set(member.id, result.username);
          const hint = quickRegistrationUsernameHint(
            name,
            result.base_username?.trim() || result.password,
            result.username,
            'uses',
          );
          if (hint) {
            hints.push(hint);
          }
        } catch (error: unknown) {
          failures.push(error instanceof Error ? error.message : `${name} was not registered.`);
        }
      }

      setRegistrationById((current) => {
        const next = { ...current };
        for (const [id, username] of succeeded) {
          next[id] = {
            status: 'partial',
            username,
            isAdmin: false,
            quickReg: true,
          };
        }
        return next;
      });

      try {
        const seq = lookupSeqRef.current + 1;
        lookupSeqRef.current = seq;
        const matches = await lookupStaffRegistration(
          membersRef.current.filter(staffNameReady).map((row) => ({
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
          })),
        );
        if (lookupSeqRef.current === seq) {
          const next = { ...matches };
          for (const [id, username] of succeeded) {
            const lookedUp = next[id];
            if (!lookedUp || lookedUp.status === 'none') {
              next[id] = {
                status: 'partial',
                username,
                isAdmin: false,
                quickReg: true,
              };
            }
          }
          setRegistrationById(next);
        }
      } catch {
        // The optimistic yellow icons stay when the refresh fails.
      }

      reportQuickRegisterBatch(succeeded.size, failures, hints);
      setQuickRegisterAllOpen(false);
    })().finally(() => {
      setQuickRegisterAllBusy(false);
    });
  };

  const pendingQuickRegister = members.find((member) => member.id === pendingQuickRegisterId) ?? null;

  const registeredMark = (member: EventStaffMember) => (
    <StaffRegistrationMark
      firstName={member.firstName}
      match={staffReadyForLookup(member) ? registrationById[member.id] : undefined}
      onQuickRegister={
        staffReadyForLookup(member) && registrationById[member.id]?.status === 'none'
          ? () => setPendingQuickRegisterId(member.id)
          : undefined
      }
    />
  );

  const visibleStaff = members
    .map((member, index) => ({ member, index }))
    .filter(
      ({ member }) =>
        roleFilter === ''
        || member.primaryRoleCode === roleFilter
        || member.secondaryRoleCode === roleFilter,
    );

  const selectableRoles = rolesVisibleToViewer(
    roleOptions.filter((option) => option.roleCode !== 'COMPETITOR'),
    viewerIsAdmin,
  );
  const filterRoleOptions = optionsIncluding(selectableRoles, roleFilter, '');

  const handleSortChange = (event: { target: { value: string } }) => {
    const nextSort = event.target.value;
    if (
      nextSort !== 'primaryRole'
      && nextSort !== 'firstName'
      && nextSort !== 'lastName'
      && nextSort !== 'registration'
    ) {
      return;
    }

    const next = sortStaffMembers(
      membersRef.current,
      nextSort,
      selectableRoles,
      registrationById,
    );
    membersRef.current = next;
    setMembers(next);
    setSortBy(nextSort);
    commitStaffSave();
  };

  const roleMenu = (
    member: EventStaffMember,
    field: 'primaryRoleCode' | 'secondaryRoleCode',
    label: string,
  ) => {
    const excludeRoleCode =
      field === 'primaryRoleCode' ? member.secondaryRoleCode : member.primaryRoleCode;
    const options = optionsIncluding(selectableRoles, member[field], excludeRoleCode);

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
          <Stack
            direction={showXsLayout ? 'column' : 'row'}
            sx={{
              justifyContent: 'center',
              alignItems: showXsLayout ? 'stretch' : 'center',
              columnGap: 8,
              rowGap: 1.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                Filter By
              </Typography>
              <AppTextField
                select
                size="small"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                sx={{
                  width: showXsLayout ? 'auto' : 220,
                  flex: showXsLayout ? '1 1 auto' : '0 0 auto',
                  minWidth: showXsLayout ? 0 : undefined,
                }}
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Filter staff by role' },
                }}
              >
                <MenuItem value="">
                  <em>Filter by</em>
                </MenuItem>
                {filterRoleOptions.map((option) => (
                  <MenuItem key={option.roleCode} value={option.roleCode}>
                    {option.label}
                  </MenuItem>
                ))}
              </AppTextField>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <Typography
                component="span"
                variant="body2"
                sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
              >
                Sort By
              </Typography>
              <AppTextField
                select
                size="small"
                value={sortBy}
                onChange={handleSortChange}
                sx={{
                  width: showXsLayout ? 'auto' : 280,
                  flex: showXsLayout ? '1 1 auto' : '0 0 auto',
                  minWidth: showXsLayout ? 0 : undefined,
                }}
                slotProps={{
                  select: { displayEmpty: true },
                  htmlInput: { 'aria-label': 'Sort staff' },
                }}
              >
                <MenuItem value="">
                  <em>Sort by</em>
                </MenuItem>
                <MenuItem value="primaryRole">Sort by Primary Role</MenuItem>
                <MenuItem value="firstName">Sort by First Name</MenuItem>
                <MenuItem value="lastName">Sort by Last Name</MenuItem>
                <MenuItem value="registration">Sort by Registration Status</MenuItem>
              </AppTextField>
            </Stack>
          </Stack>
        ) : null}

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
                visibleStaff.map(({ member, index }) => (
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
                      slotProps={{
                        inputLabel: { sx: { fontWeight: 700 } },
                        htmlInput: {
                          onFocus: (event: FocusEvent<HTMLInputElement>) => rememberTextFocus(event.currentTarget.value),
                          onBlur: () => handleTextBlur(member.id, 'firstName'),
                        },
                      }}
                    />
                    <AppTextField
                      size="small"
                      label="Last Name"
                      value={member.lastName}
                      onChange={(event) => updateMember(member.id, { lastName: event.target.value })}
                      fullWidth
                      slotProps={{
                        inputLabel: { sx: { fontWeight: 700 } },
                        htmlInput: {
                          onFocus: (event: FocusEvent<HTMLInputElement>) => rememberTextFocus(event.currentTarget.value),
                          onBlur: () => handleTextBlur(member.id, 'lastName'),
                        },
                      }}
                    />
                    {roleMenu(member, 'primaryRoleCode', 'Primary Role')}
                    {roleMenu(member, 'secondaryRoleCode', 'Secondary Role')}
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        Registered
                      </Typography>
                      {registeredMark(member)}
                    </Stack>
                  </Stack>
                ))
              )}
            </Stack>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(0, 1fr) minmax(0, 1fr) minmax(140px, 1fr) minmax(140px, 1fr) 96px auto',
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
              {visibleStaff.map(({ member, index }) => (
                <Box key={member.id} sx={{ display: 'contents' }}>
                  <AppTextField
                    size="small"
                    value={member.firstName}
                    onChange={(event) => updateMember(member.id, { firstName: event.target.value })}
                    fullWidth
                    slotProps={{
                      htmlInput: {
                        'aria-label': `First name for staff ${index + 1}`,
                        onFocus: (event: FocusEvent<HTMLInputElement>) => rememberTextFocus(event.currentTarget.value),
                        onBlur: () => handleTextBlur(member.id, 'firstName'),
                      },
                    }}
                  />
                  <AppTextField
                    size="small"
                    value={member.lastName}
                    onChange={(event) => updateMember(member.id, { lastName: event.target.value })}
                    fullWidth
                    slotProps={{
                      htmlInput: {
                        'aria-label': `Last name for staff ${index + 1}`,
                        onFocus: (event: FocusEvent<HTMLInputElement>) => rememberTextFocus(event.currentTarget.value),
                        onBlur: () => handleTextBlur(member.id, 'lastName'),
                      },
                    }}
                  />
                  {roleMenu(member, 'primaryRoleCode', `Primary role for staff ${index + 1}`)}
                  {roleMenu(member, 'secondaryRoleCode', `Secondary role for staff ${index + 1}`)}
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {registeredMark(member)}
                  </Box>
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
              alignItems: 'center',
              columnGap: 2,
              rowGap: 1,
            }}
          >
            <Box sx={{ display: { xs: 'none', md: 'block' } }} />
            <Button variant="outlined" onClick={handleAddStaff} sx={{ justifySelf: 'center' }}>
              Add Staff
            </Button>
            <Button
              variant="outlined"
              onClick={openQuickRegisterAll}
              disabled={quickRegisterBusy || quickRegisterAllBusy}
              sx={{ justifySelf: { xs: 'end', md: 'end' } }}
            >
              Quick Register All
            </Button>
          </Box>
        ) : null}
      </Stack>

      <Dialog
        open={pendingDeleteId !== null}
        onClose={cancelDelete}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-staff-title"
      >
        <DialogTitle sx={{ position: 'relative', minHeight: 40, p: 1 }}>
          <IconButton
            aria-label="Close"
            onClick={cancelDelete}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-staff-title">
            Are you sure you want to delete this Staff entry.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 4, pt: 1, pb: 3 }}>
          <Button onClick={cancelDelete} sx={{ minWidth: 96 }}>
            No
          </Button>
          <Button variant="contained" onClick={confirmDelete} sx={{ minWidth: 96 }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <QuickRegisterDialog
        open={pendingQuickRegister !== null}
        firstName={pendingQuickRegister?.firstName ?? ''}
        detail={singleQuickRegisterHint}
        busy={quickRegisterBusy}
        onClose={cancelQuickRegister}
        onConfirm={confirmQuickRegister}
      />
      <QuickRegisterAllDialog
        open={quickRegisterAllOpen}
        people={quickRegisterAllPeople}
        skipped={quickRegisterAllSkipped}
        busy={quickRegisterAllBusy}
        onClose={cancelQuickRegisterAll}
        onConfirm={confirmQuickRegisterAll}
      />
    </Box>
  );
}
