import {
  Container,
  Paper,
  Stack,
  ToggleButton,
  Typography,
} from '@mui/material';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { type SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  fetchEventById,
  fetchEventGroupByCode,
  fetchEventMoreJson,
  parseEventContests,
  parseEventStaff,
  parseStoredSectionStatuses,
  saveEventContests,
  saveEventDraft,
  saveEventLocation,
  saveEventRoleAssignments,
  saveEventSectionStatuses,
  saveEventStaff,
  type EventContestsState,
  type EventRoleAssignment,
  type EventStaffState,
  type StoredSectionStatus,
} from '../api/postgrest';
import { trimSavedText } from '../utils/trimSavedText';
import {
  registerEventFormSaveQueue,
  registerEventFormSyncFlush,
} from '../lib/eventFormFlush';
import { loadSession } from '../lib/session';
import AddEventDates from '../components/AddEventDates';
import AddEventName, {
  eventNameCanBeFinalized,
  eventNameUnlocksOtherSections,
  MIN_EVENT_NAME_LENGTH_TO_CONTINUE,
} from '../components/AddEventName';
import AddEventLocation from '../components/AddEventLocation';
import { type EventLocationJson } from '../lib/eventLocation';
import AddEventOnlineLinks from '../components/AddEventOnlineLinks';
import AddEventEarlyBirdDates from '../components/AddEventEarlyBirdDates';
import AddEventPasses, { type EventPassesSummary } from '../components/AddEventPasses';
import AddEventScheduleDays from '../components/AddEventScheduleDays';
import AddEventRoles from '../components/AddEventRoles';
import AddEventImportantContacts from '../components/AddEventImportantContacts';
import AddEventContests, { type EventContestsSummary } from '../components/AddEventContests';
import AddEventStaff, { type EventStaffSummary } from '../components/AddEventStaff';
import AddEventVolunteers from '../components/AddEventVolunteers';
import AddEventDiscounts from '../components/AddEventDiscounts';
import AddEventIntensives, { type EventIntensivesSummary } from '../components/AddEventIntensives';
import AddEventExportImport from '../components/AddEventExportImport';
import AddEventSortableSectionAccordion from '../components/AddEventSortableSectionAccordion';
import { type AddEventSectionStatus } from '../components/AddEventSectionStatusToggle';
import PageHeader from '../components/PageHeader';
import { EventFormExportProvider, useAppliedEventImport } from '../context/EventFormExportContext';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { EVENT_GROUPS_PATH, eventGroupDetailPath } from '../constants/eventRoutes';
import { eventIsCancelled } from '../lib/eventCancelled';
import { parseDateTimeLocalValue } from '../lib/eventDuration';
import {
  applyStoredDateMode,
  EMPTY_EVENT_DATES,
  isEventDatesValid,
  eventDatesFromApiTimestamps,
  type EventDateMode,
  type EventDatesFormState,
  formatEventStartDateLabel,
  getScheduleTimeBlockDays,
  hasEventDatesForSchedule,
} from '../lib/eventDates';
import {
  contactVenueTitleLabels,
  EMPTY_CONTACT_VENUE_SUMMARY,
  type ContactVenueSummary,
} from '../lib/eventLocation';
import { resolveEventGroupCode } from '../lib/eventGroupSession';
import { DEFAULT_IMPORTANT_CONTACT } from '../lib/eventFormExport';
import { intensivesAccordionTitle } from '../lib/eventIntensives';
import { passesAccordionTitle } from '../lib/eventPasses';

type AddEventLocationState = {
  eventGroupCode?: string;
  eventId?: number;
};

type AddEventSectionId =
  | 'event_name'
  | 'dates'
  | 'passes'
  | 'roles'
  | 'early_bird_dates'
  | 'discounts'
  | 'intensives'
  | 'location'
  | 'online_links'
  | 'important_contacts'
  | 'contests'
  | 'schedule'
  | 'staff'
  | 'volunteers';

type AddEventPanelId = AddEventSectionId | 'export_import';

const EXPORT_IMPORT_PANEL_ID = 'export_import' as const;

type AddEventSection = {
  id: AddEventSectionId;
  title: string;
  description: string;
};

const ADD_EVENT_SECTIONS: AddEventSection[] = [
  { id: 'event_name', title: 'Event Name', description: '' },
  { id: 'dates', title: 'Date(s)', description: '' },
  { id: 'passes', title: 'Passes', description: '' },
  { id: 'roles', title: 'Roles', description: '' },
  { id: 'early_bird_dates', title: 'Early Bird Dates', description: '' },
  {
    id: 'discounts',
    title: 'Discounts',
    description: '',
  },
  {
    id: 'intensives',
    title: 'Intensive Workshops',
    description: '',
  },
  {
    id: 'location',
    title: 'Location/Venue',
    description: '',
  },
  {
    id: 'online_links',
    title: 'Contact Venue',
    description: '',
  },
  {
    id: 'important_contacts',
    title: 'Important Contacts',
    description: '',
  },
  {
    id: 'contests',
    title: 'Contests',
    description: '',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: '',
  },
  {
    id: 'staff',
    title: 'Staff',
    description: '',
  },
  {
    id: 'volunteers',
    title: 'Volunteers',
    description: '',
  },
];

const DEFAULT_SECTION_ORDER = ADD_EVENT_SECTIONS.map((section) => section.id);

/** Keep a saved order, and place any new sections beside their default neighbors. */
function mergeSectionOrder(importedIds: readonly string[]): AddEventSectionId[] {
  const allowed = new Set<string>(DEFAULT_SECTION_ORDER);
  const imported = importedIds.filter(
    (sectionId): sectionId is AddEventSectionId => allowed.has(sectionId),
  );
  const present = new Set(imported);
  const merged = [...imported];

  for (const sectionId of DEFAULT_SECTION_ORDER) {
    if (present.has(sectionId)) {
      continue;
    }

    const defaultIndex = DEFAULT_SECTION_ORDER.indexOf(sectionId);
    let insertAt = merged.length;
    for (let index = defaultIndex - 1; index >= 0; index -= 1) {
      const neighbor = merged.indexOf(DEFAULT_SECTION_ORDER[index]);
      if (neighbor >= 0) {
        insertAt = neighbor + 1;
        break;
      }
    }
    if (insertAt === merged.length) {
      for (let index = defaultIndex + 1; index < DEFAULT_SECTION_ORDER.length; index += 1) {
        const neighbor = merged.indexOf(DEFAULT_SECTION_ORDER[index]);
        if (neighbor >= 0) {
          insertAt = neighbor;
          break;
        }
      }
    }

    merged.splice(insertAt, 0, sectionId);
    present.add(sectionId);
  }

  return merged;
}

const ADD_EVENT_SECTIONS_BY_ID = Object.fromEntries(
  ADD_EVENT_SECTIONS.map((section) => [section.id, section]),
) as Record<AddEventSectionId, AddEventSection>;

const DEFAULT_SECTION_STATUS: AddEventSectionStatus = 'not_started';

const STATUS_TO_STORED: Record<AddEventSectionStatus, StoredSectionStatus> = {
  not_started: 'NOT_STARTED',
  in_progress: 'IN_PROGRESS',
  finalized: 'FINALIZED',
};

const STORED_TO_STATUS: Record<StoredSectionStatus, AddEventSectionStatus> = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  FINALIZED: 'finalized',
};

function applyStoredSectionStatuses(
  current: Record<AddEventSectionId, AddEventSectionStatus>,
  stored: Record<string, StoredSectionStatus>,
): Record<AddEventSectionId, AddEventSectionStatus> {
  const next = { ...current };
  for (const sectionId of DEFAULT_SECTION_ORDER) {
    const saved = stored[sectionId];
    if (saved) {
      next[sectionId] = STORED_TO_STATUS[saved];
    }
  }
  return next;
}

function createInitialSectionStatuses(): Record<AddEventSectionId, AddEventSectionStatus> {
  return {
    event_name: DEFAULT_SECTION_STATUS,
    dates: DEFAULT_SECTION_STATUS,
    passes: DEFAULT_SECTION_STATUS,
    roles: DEFAULT_SECTION_STATUS,
    early_bird_dates: DEFAULT_SECTION_STATUS,
    discounts: DEFAULT_SECTION_STATUS,
    intensives: DEFAULT_SECTION_STATUS,
    location: DEFAULT_SECTION_STATUS,
    online_links: DEFAULT_SECTION_STATUS,
    important_contacts: DEFAULT_SECTION_STATUS,
    contests: DEFAULT_SECTION_STATUS,
    schedule: DEFAULT_SECTION_STATUS,
    staff: DEFAULT_SECTION_STATUS,
    volunteers: DEFAULT_SECTION_STATUS,
  };
}

function sectionDisplayTitle(
  section: AddEventSection,
  status: AddEventSectionStatus,
  eventName: string,
  startDateLabel: string,
  passesSummary: EventPassesSummary,
  noEarlyBirdDates: boolean,
  venueName: string,
  contactVenueSummary: ContactVenueSummary,
  hasContests: boolean,
  contestCount: number,
  hasStaff: boolean,
  intensivesSummary: EventIntensivesSummary,
): string {
  if (section.id === 'event_name' && status === 'finalized') {
    return eventName.trim();
  }

  if (section.id === 'dates' && status === 'finalized' && startDateLabel) {
    return `${section.title} ${startDateLabel}`;
  }

  if (section.id === 'passes' && status !== 'not_started') {
    return passesAccordionTitle(passesSummary.hasPasses, passesSummary.passCount);
  }

  if (section.id === 'intensives' && status !== 'not_started') {
    return intensivesAccordionTitle(
      intensivesSummary.hasIntensives,
      intensivesSummary.intensiveCount,
    );
  }

  if (section.id === 'early_bird_dates' && status !== 'not_started' && noEarlyBirdDates) {
    return `${section.title} - N/A`;
  }

  if (section.id === 'location' && status !== 'not_started') {
    const venue = venueName.trim();
    if (venue) {
      return `${section.title} - ${venue}`;
    }
  }

  if (section.id === 'online_links' && status !== 'not_started') {
    const labels = contactVenueTitleLabels(contactVenueSummary);
    if (labels.length > 0) {
      return `${section.title} - ${labels.join(', ')}`;
    }
  }

  if (section.id === 'contests') {
    if (!hasContests) {
      return `${section.title} - N/A`;
    }

    return `${section.title} - ${contestCount}`;
  }

  if (section.id === 'staff' && status === 'finalized' && !hasStaff) {
    return `${section.title} - N/A`;
  }

  return section.title;
}

function sectionIsFinalizedNotApplicable(
  sectionId: AddEventPanelId,
  status: AddEventSectionStatus,
  passesSummary: EventPassesSummary,
  noEarlyBirdDates: boolean,
  hasContests: boolean,
  hasStaff: boolean,
  intensivesSummary: EventIntensivesSummary,
): boolean {
  if (sectionId === EXPORT_IMPORT_PANEL_ID || status !== 'finalized') {
    return false;
  }

  if (sectionId === 'passes') {
    return !passesSummary.hasPasses;
  }

  if (sectionId === 'intensives') {
    return !intensivesSummary.hasIntensives;
  }

  if (sectionId === 'early_bird_dates') {
    return noEarlyBirdDates;
  }

  if (sectionId === 'contests') {
    return !hasContests;
  }

  if (sectionId === 'staff') {
    return !hasStaff;
  }

  return false;
}

function withFinalizedNotApplicableAtEnd(
  order: AddEventPanelId[],
  statuses: Record<AddEventSectionId, AddEventSectionStatus>,
  passesSummary: EventPassesSummary,
  noEarlyBirdDates: boolean,
  hasContests: boolean,
  hasStaff: boolean,
  intensivesSummary: EventIntensivesSummary,
): AddEventPanelId[] {
  const remaining: AddEventPanelId[] = [];
  const sunk: AddEventPanelId[] = [];

  for (const sectionId of order) {
    if (
      sectionId !== EXPORT_IMPORT_PANEL_ID
      && sectionIsFinalizedNotApplicable(
        sectionId,
        statuses[sectionId],
        passesSummary,
        noEarlyBirdDates,
        hasContests,
        hasStaff,
        intensivesSummary,
      )
    ) {
      sunk.push(sectionId);
    } else {
      remaining.push(sectionId);
    }
  }

  return [...remaining, ...sunk];
}

function disabledStatusesForSection(
  sectionId: AddEventSectionId,
  eventNameReadyToFinalize: boolean,
  scheduleDatesSelected: boolean,
): AddEventSectionStatus[] | undefined {
  if (sectionId === 'event_name' && !eventNameReadyToFinalize) {
    return ['finalized'];
  }

  if (sectionId === 'schedule' && !scheduleDatesSelected) {
    return ['in_progress', 'finalized'];
  }

  return undefined;
}

function draftDateFields(dates: EventDatesFormState): {
  startDate: string | null;
  endDate: string | null;
  updateEndDate: boolean;
  dateMode: EventDateMode;
} | null {
  const startEmpty = dates.startDateTime.trim() === '';
  const endEmpty = dates.endDateTime.trim() === '';
  if (startEmpty && endEmpty) {
    return {
      startDate: null,
      endDate: null,
      updateEndDate: dates.mode !== 'single_day',
      dateMode: dates.mode,
    };
  }

  if (!isEventDatesValid(dates)) {
    return null;
  }

  const start = parseDateTimeLocalValue(dates.startDateTime);
  if (!start) {
    return null;
  }

  if (dates.mode === 'single_day') {
    return {
      startDate: start.toISOString(),
      endDate: null,
      updateEndDate: false,
      dateMode: 'single_day',
    };
  }

  const end = parseDateTimeLocalValue(dates.endDateTime);
  if (!end) {
    return null;
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    updateEndDate: true,
    dateMode: 'multi_day',
  };
}

function promoteSectionToInProgress(
  current: Record<AddEventSectionId, AddEventSectionStatus>,
  sectionId: AddEventSectionId,
): Record<AddEventSectionId, AddEventSectionStatus> {
  if (current[sectionId] === 'in_progress') {
    return current;
  }

  return { ...current, [sectionId]: 'in_progress' };
}

function renderSectionContent(
  sectionId: AddEventSectionId,
  onFieldEdit: () => void,
  eventName: string,
  onEventNameChange: (name: string) => void,
  eventDates: EventDatesFormState,
  onEventDatesChange: (dates: EventDatesFormState) => void,
  scheduleSectionStatus: AddEventSectionStatus,
  onScheduleSectionStatusChange: (status: AddEventSectionStatus) => void,
  scheduleDatesSelected: boolean,
  onPassesSummaryChange: (summary: EventPassesSummary) => void,
  onNoEarlyBirdDatesChange: (noEarlyBirdDates: boolean) => void,
  onVenueChange: (venue: string) => void,
  locationExpanded: boolean,
  onSaveLocation: (location: EventLocationJson) => void,
  onContactVenueSummaryChange: (summary: ContactVenueSummary) => void,
  eventId: number | null,
  onSaveRoles: (roles: EventRoleAssignment[]) => void,
  eventTypeCode: string | null,
  onContestsSummaryChange: (summary: EventContestsSummary) => void,
  onSaveContests: (contests: EventContestsState) => void,
  staffExpanded: boolean,
  onStaffSummaryChange: (summary: EventStaffSummary) => void,
  onSaveStaff: (staff: EventStaffState) => void,
  onIntensivesSummaryChange: (summary: EventIntensivesSummary) => void,
) {
  if (sectionId === 'event_name') {
    return (
      <AddEventName
        name={eventName}
        onNameChange={onEventNameChange}
        onFieldEdit={onFieldEdit}
      />
    );
  }

  if (sectionId === 'dates') {
    return (
      <AddEventDates
        dates={eventDates}
        onDatesChange={onEventDatesChange}
        onFieldEdit={onFieldEdit}
      />
    );
  }

  if (sectionId === 'location') {
    return (
      <AddEventLocation
        eventId={eventId}
        expanded={locationExpanded}
        onFieldEdit={onFieldEdit}
        onVenueChange={onVenueChange}
        onSaveLocation={onSaveLocation}
      />
    );
  }

  if (sectionId === 'passes') {
    return (
      <AddEventPasses onFieldEdit={onFieldEdit} onSummaryChange={onPassesSummaryChange} />
    );
  }

  if (sectionId === 'roles') {
    return (
      <AddEventRoles
        eventId={eventId}
        onSaveRoles={onSaveRoles}
        onFieldEdit={onFieldEdit}
      />
    );
  }

  if (sectionId === 'early_bird_dates') {
    return (
      <AddEventEarlyBirdDates
        onFieldEdit={onFieldEdit}
        onNoEarlyBirdDatesChange={onNoEarlyBirdDatesChange}
      />
    );
  }

  if (sectionId === 'discounts') {
    return <AddEventDiscounts onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'intensives') {
    return (
      <AddEventIntensives
        onFieldEdit={onFieldEdit}
        onSummaryChange={onIntensivesSummaryChange}
      />
    );
  }

  if (sectionId === 'online_links') {
    return (
      <AddEventOnlineLinks
        onFieldEdit={onFieldEdit}
        onSummaryChange={onContactVenueSummaryChange}
      />
    );
  }

  if (sectionId === 'important_contacts') {
    return <AddEventImportantContacts onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'contests') {
    return (
      <AddEventContests
        eventId={eventId}
        eventTypeCode={eventTypeCode}
        onFieldEdit={onFieldEdit}
        onSummaryChange={onContestsSummaryChange}
        onSaveContests={onSaveContests}
      />
    );
  }

  if (sectionId === 'schedule') {
    return (
      <AddEventScheduleDays
        scheduleTimeBlocks={getScheduleTimeBlockDays(eventDates)}
        status={scheduleSectionStatus}
        onStatusChange={onScheduleSectionStatusChange}
        disabledStatuses={
          scheduleDatesSelected ? undefined : ['in_progress', 'finalized']
        }
      />
    );
  }

  if (sectionId === 'staff') {
    return (
      <AddEventStaff
        eventId={eventId}
        expanded={staffExpanded}
        onFieldEdit={onFieldEdit}
        onSummaryChange={onStaffSummaryChange}
        onSaveStaff={onSaveStaff}
      />
    );
  }

  if (sectionId === 'volunteers') {
    return <AddEventVolunteers onFieldEdit={onFieldEdit} />;
  }

  return null;
}

function AdminAddEventForm() {
  const location = useLocation();
  const appliedImport = useAppliedEventImport();
  const appliedTokenRef = useRef(0);
  const { showProblem } = useMessages();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const locationState = (location.state as AddEventLocationState | null) ?? null;
  const eventGroupCode = resolveEventGroupCode(locationState) ?? '';
  const rawEventId = locationState?.eventId;
  const eventId =
    typeof rawEventId === 'number' && Number.isFinite(rawEventId) ? rawEventId : null;
  const isEditingEvent = eventId !== null;
  const [eventGroupName, setEventGroupName] = useState('');
  const [eventTypeCode, setEventTypeCode] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<AddEventPanelId | false>('event_name');
  const [sectionStatuses, setSectionStatuses] = useState(createInitialSectionStatuses);
  const sectionStatusesRef = useRef(sectionStatuses);
  const [sectionOrder, setSectionOrder] = useState<AddEventPanelId[]>(() => [
    ...DEFAULT_SECTION_ORDER,
    EXPORT_IMPORT_PANEL_ID,
  ]);
  const [eventName, setEventName] = useState('');
  const [passesSummary, setPassesSummary] = useState<EventPassesSummary>({
    hasPasses: false,
    passCount: 1,
  });
  const [intensivesSummary, setIntensivesSummary] = useState<EventIntensivesSummary>({
    hasIntensives: false,
    intensiveCount: 0,
  });
  const [noEarlyBirdDates, setNoEarlyBirdDates] = useState(true);
  const [hasContests, setHasContests] = useState(false);
  const [contestCount, setContestCount] = useState(0);
  const [hasStaff, setHasStaff] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [contactVenueSummary, setContactVenueSummary] = useState(EMPTY_CONTACT_VENUE_SUMMARY);
  const [eventDates, setEventDates] = useState<EventDatesFormState>(EMPTY_EVENT_DATES);
  const [eventCancelled, setEventCancelled] = useState(false);
  const [savedEventId, setSavedEventId] = useState<number | null>(eventId);
  const [draftReady, setDraftReady] = useState(eventId === null);
  const savedEventIdRef = useRef<number | null>(eventId);
  const draftReadyRef = useRef(eventId === null);
  const eventNameRef = useRef(eventName);
  const eventDatesRef = useRef(eventDates);
  const eventCancelledRef = useRef(false);
  const eventGroupCodeRef = useRef(eventGroupCode);
  const saveQueueRef = useRef(Promise.resolve());
  const draftDirtyRef = useRef(false);
  const lastDraftKeyRef = useRef<string | null>(null);
  const queueDraftSaveRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    savedEventIdRef.current = eventId;
    setSavedEventId(eventId);
    const ready = eventId === null;
    draftReadyRef.current = ready;
    setDraftReady(ready);
  }, [eventId]);

  useEffect(() => {
    eventNameRef.current = eventName;
  }, [eventName]);

  useEffect(() => {
    eventDatesRef.current = eventDates;
  }, [eventDates]);

  useEffect(() => {
    eventGroupCodeRef.current = eventGroupCode;
  }, [eventGroupCode]);

  useEffect(() => {
    sectionStatusesRef.current = sectionStatuses;
  }, [sectionStatuses]);

  const enqueueEventSave = useCallback(
    (task: (currentEventId: number | null) => Promise<number>) => {
      saveQueueRef.current = saveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          try {
            const nextId = await task(savedEventIdRef.current);
            savedEventIdRef.current = nextId;
            setSavedEventId((current) => (current === nextId ? current : nextId));
          } catch (saveError) {
            showProblem(saveError instanceof Error ? saveError.message : 'Unable to save the event.');
          }
        });
    },
    [showProblem],
  );

  const handleSaveRoles = useCallback(
    (roles: EventRoleAssignment[]) => {
      enqueueEventSave((currentEventId) =>
        saveEventRoleAssignments({
          eventId: currentEventId,
          eventGroupCode: eventGroupCodeRef.current,
          eventName: eventNameRef.current,
          roles,
        }),
      );
    },
    [enqueueEventSave],
  );

  const handleSaveContests = useCallback(
    (contests: EventContestsState) => {
      enqueueEventSave((currentEventId) =>
        saveEventContests({
          eventId: currentEventId,
          eventGroupCode: eventGroupCodeRef.current,
          eventName: eventNameRef.current,
          contests,
        }),
      );
    },
    [enqueueEventSave],
  );

  const handleSaveLocation = useCallback(
    (location: EventLocationJson) => {
      enqueueEventSave((currentEventId) =>
        saveEventLocation({
          eventId: currentEventId,
          eventGroupCode: eventGroupCodeRef.current,
          eventName: eventNameRef.current,
          location,
        }),
      );
    },
    [enqueueEventSave],
  );

  const handleSaveStaff = useCallback(
    (staff: EventStaffState) => {
      enqueueEventSave((currentEventId) =>
        saveEventStaff({
          eventId: currentEventId,
          eventGroupCode: eventGroupCodeRef.current,
          eventName: eventNameRef.current,
          staff,
        }),
      );
    },
    [enqueueEventSave],
  );

  const queueDraftSave = useCallback((options?: { onlyIfDirty?: boolean }) => {
    if (options?.onlyIfDirty && !draftDirtyRef.current) {
      return;
    }

    if (!loadSession()?.username) {
      return;
    }

    if (!eventGroupCodeRef.current || !draftReadyRef.current) {
      return;
    }

    const name = trimSavedText(eventNameRef.current);
    if (name !== eventNameRef.current) {
      eventNameRef.current = name;
      setEventName(name);
    }
    const currentEventId = savedEventIdRef.current;
    if (name.length < MIN_EVENT_NAME_LENGTH_TO_CONTINUE && currentEventId === null) {
      return;
    }

    const dates = draftDateFields(eventDatesRef.current);
    const cancelled = eventCancelledRef.current;
    const key = JSON.stringify({
      eventId: currentEventId,
      name,
      startDate: dates?.startDate ?? null,
      endDate: dates?.endDate ?? null,
      updateDates: dates !== null,
      updateEndDate: dates?.updateEndDate ?? true,
      dateMode: dates?.dateMode ?? null,
      cancelled,
    });
    if (key === lastDraftKeyRef.current) {
      draftDirtyRef.current = false;
      return;
    }

    lastDraftKeyRef.current = key;
    draftDirtyRef.current = false;
    enqueueEventSave((eventIdToSave) =>
      saveEventDraft({
        eventId: eventIdToSave,
        eventGroupCode: eventGroupCodeRef.current,
        name,
        startDate: dates?.startDate ?? null,
        endDate: dates?.endDate ?? null,
        updateDates: dates !== null,
        updateEndDate: dates?.updateEndDate ?? true,
        dateMode: dates?.dateMode ?? null,
        cancelled,
      }),
    );
  }, [enqueueEventSave]);

  queueDraftSaveRef.current = () => {
    queueDraftSave({ onlyIfDirty: true });
  };

  useEffect(() => {
    return registerEventFormSyncFlush(() => {
      queueDraftSaveRef.current();
    });
  }, []);

  useEffect(() => {
    return registerEventFormSaveQueue(() => saveQueueRef.current);
  }, []);

  useEffect(() => {
    return () => {
      queueDraftSaveRef.current();
    };
  }, []);

  useEffect(() => {
    if (!eventGroupCode) {
      return;
    }

    const handle = window.setTimeout(() => {
      queueDraftSave();
    }, 400);

    return () => window.clearTimeout(handle);
  }, [draftReady, eventCancelled, eventDates, eventGroupCode, eventName, queueDraftSave]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const displayedSectionIds = useMemo(() => {
    const panels = sectionOrder.includes(EXPORT_IMPORT_PANEL_ID)
      ? sectionOrder
      : [...sectionOrder, EXPORT_IMPORT_PANEL_ID];
    return withFinalizedNotApplicableAtEnd(
      panels,
      sectionStatuses,
      passesSummary,
      noEarlyBirdDates,
      hasContests,
      hasStaff,
      intensivesSummary,
    );
  }, [
    hasContests,
    hasStaff,
    intensivesSummary,
    noEarlyBirdDates,
    passesSummary,
    sectionOrder,
    sectionStatuses,
  ]);

  const scheduleDatesSelected = hasEventDatesForSchedule(eventDates);
  const eventNameReadyToFinalize = eventNameCanBeFinalized(eventName);
  const otherSectionsEnabled = eventNameUnlocksOtherSections(eventName);

  useEffect(() => {
    if (otherSectionsEnabled) {
      return;
    }

    setExpandedSection((current) =>
      current === 'event_name' || current === EXPORT_IMPORT_PANEL_ID ? current : false,
    );
  }, [otherSectionsEnabled]);

  const backPath = eventGroupCode
    ? eventGroupDetailPath(eventGroupCode)
    : EVENT_GROUPS_PATH;
  const backLabel = eventGroupCode ? 'Back to Event Group' : 'Back to Event Groups';
  const pageTitle = isEditingEvent
    ? eventGroupCode
      ? `Edit Event for ${eventGroupCode}`
      : 'Edit Event'
    : eventGroupCode
      ? `Add Event for ${eventGroupCode}`
      : 'Add Event';

  useEffect(() => {
    if (!eventGroupCode) {
      setEventGroupName('');
      setEventTypeCode(null);
      return;
    }

    let cancelled = false;

    void fetchEventGroupByCode(eventGroupCode)
      .then((group) => {
        if (!cancelled) {
          setEventGroupName(group?.fullName ?? '');
          setEventTypeCode(group?.eventTypeCode ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEventGroupName('');
          setEventTypeCode(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [eventGroupCode]);

  useEffect(() => {
    if (!isEditingEvent || eventId === null) {
      return;
    }

    let cancelled = false;

    void Promise.all([fetchEventById(eventId), fetchEventMoreJson(eventId)])
      .then(([event, moreJson]) => {
        if (cancelled) {
          return;
        }

        if (!event || (eventGroupCode && event.eventGroupCode !== eventGroupCode)) {
          return;
        }

        const nextDates = applyStoredDateMode(
          eventDatesFromApiTimestamps(event.startDate, event.endDate),
          moreJson,
        );
        const nextName = event.name ?? '';
        const nextCancelled = eventIsCancelled(moreJson);
        eventCancelledRef.current = nextCancelled;
        setEventCancelled(nextCancelled);
        const storedStatuses = parseStoredSectionStatuses(moreJson);
        const storedStaff = parseEventStaff(moreJson);
        const storedContests = parseEventContests(moreJson);
        setHasStaff(storedStaff.hasStaff);
        setHasContests(storedContests.hasContests);
        setContestCount(storedContests.contests.length);
        setEventDates(nextDates);
        setEventName(nextName);
        eventNameRef.current = nextName;
        eventDatesRef.current = nextDates;
        draftReadyRef.current = true;
        setDraftReady(true);

        setSectionStatuses((current) => {
          const next = applyStoredSectionStatuses(current, storedStatuses);

          if (!storedStatuses.event_name && nextName.trim() && next.event_name !== 'in_progress') {
            next.event_name = 'in_progress';
          }

          if (
            !storedStatuses.dates
            && (nextDates.startDateTime || nextDates.endDateTime)
            && next.dates !== 'in_progress'
          ) {
            next.dates = 'in_progress';
          }

          sectionStatusesRef.current = next;
          return next;
        });
      })
      .catch(() => {
        // Keep empty dates when the event cannot be loaded.
      });

    return () => {
      cancelled = true;
    };
  }, [eventGroupCode, eventId, isEditingEvent]);

  useEffect(() => {
    if (scheduleDatesSelected) {
      return;
    }

    setSectionStatuses((current) => {
      if (current.schedule === 'not_started') {
        return current;
      }

      return { ...current, schedule: 'not_started' };
    });
  }, [scheduleDatesSelected]);

  const handleIntensivesSummaryChange = useCallback((summary: EventIntensivesSummary) => {
    setIntensivesSummary((current) =>
      current.hasIntensives === summary.hasIntensives
      && current.intensiveCount === summary.intensiveCount
        ? current
        : summary,
    );
  }, []);

  const handlePassesSummaryChange = useCallback((summary: EventPassesSummary) => {
    setPassesSummary((current) =>
      current.hasPasses === summary.hasPasses && current.passCount === summary.passCount
        ? current
        : summary,
    );
  }, []);

  const handleContestsSummaryChange = useCallback((summary: EventContestsSummary) => {
    setHasContests((current) => (current === summary.hasContests ? current : summary.hasContests));
    setContestCount((current) => (current === summary.contestCount ? current : summary.contestCount));
  }, []);

  const handleStaffSummaryChange = useCallback((summary: EventStaffSummary) => {
    setHasStaff((current) => (current === summary.hasStaff ? current : summary.hasStaff));
  }, []);

  const handleNoEarlyBirdDatesChange = useCallback((nextNoEarlyBirdDates: boolean) => {
    setNoEarlyBirdDates((current) =>
      current === nextNoEarlyBirdDates ? current : nextNoEarlyBirdDates,
    );
  }, []);

  const handleVenueChange = useCallback((nextVenue: string) => {
    setVenueName((current) => (current === nextVenue ? current : nextVenue));
  }, []);

  const handleContactVenueSummaryChange = useCallback((summary: ContactVenueSummary) => {
    setContactVenueSummary((current) =>
      current.hasWeb === summary.hasWeb
      && current.hasPhone === summary.hasPhone
      && current.hasSocial === summary.hasSocial
        ? current
        : summary,
    );
  }, []);

  const handleEventDatesChange = (dates: EventDatesFormState) => {
    draftDirtyRef.current = true;
    setEventDates(dates);
  };

  const handleEventNameChange = (name: string) => {
    draftDirtyRef.current = true;
    setEventName(name);

    if (eventNameCanBeFinalized(name)) {
      return;
    }

    setSectionStatuses((current) => {
      if (current.event_name !== 'finalized') {
        return current;
      }

      return { ...current, event_name: 'in_progress' };
    });
  };

  const handleSectionStatusChange =
    (sectionId: AddEventSectionId) => (status: AddEventSectionStatus) => {
      if (
        sectionId === 'event_name'
        && status === 'finalized'
        && !eventNameCanBeFinalized(eventName)
      ) {
        return;
      }

      if (sectionStatusesRef.current[sectionId] === status) {
        return;
      }

      const next = { ...sectionStatusesRef.current, [sectionId]: status };
      sectionStatusesRef.current = next;
      setSectionStatuses(next);
      enqueueEventSave((currentEventId) =>
        saveEventSectionStatuses({
          eventId: currentEventId,
          eventGroupCode: eventGroupCodeRef.current,
          eventName: eventNameRef.current,
          sectionStatuses: {
            [sectionId]: STATUS_TO_STORED[status],
          },
        }),
      );
    };

  const handleSectionFieldEdit = (sectionId: AddEventSectionId) => {
    setSectionStatuses((current) => promoteSectionToInProgress(current, sectionId));
  };

  const handleAccordionChange =
    (sectionId: AddEventPanelId) =>
    (_event: SyntheticEvent, isExpanded: boolean) => {
      if (sectionId !== 'event_name' && sectionId !== EXPORT_IMPORT_PANEL_ID && !otherSectionsEnabled) {
        return;
      }

      const next = isExpanded ? sectionId : false;
      if (
        (expandedSection === 'event_name' || expandedSection === 'dates')
        && next !== expandedSection
      ) {
        queueDraftSaveRef.current();
      }

      setExpandedSection(next);
    };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id as AddEventPanelId;
    const overId = over.id as AddEventPanelId;
    setSectionOrder((current) => {
      const displayed = withFinalizedNotApplicableAtEnd(
        current,
        sectionStatuses,
        passesSummary,
        noEarlyBirdDates,
        hasContests,
        hasStaff,
        intensivesSummary,
      );
      const oldIndex = displayed.indexOf(activeId);
      const newIndex = displayed.indexOf(overId);
      if (oldIndex < 0 || newIndex < 0) {
        return current;
      }

      const sunk = new Set(
        displayed.filter((sectionId) => {
          if (sectionId === EXPORT_IMPORT_PANEL_ID) {
            return false;
          }

          return sectionIsFinalizedNotApplicable(
            sectionId,
            sectionStatuses[sectionId],
            passesSummary,
            noEarlyBirdDates,
            hasContests,
            hasStaff,
            intensivesSummary,
          );
        }),
      );
      const nextNonSunk = arrayMove(displayed, oldIndex, newIndex).filter(
        (sectionId) => !sunk.has(sectionId),
      );
      let cursor = 0;
      return current.map((sectionId) => {
        if (sunk.has(sectionId)) {
          return sectionId;
        }

        const nextId = nextNonSunk[cursor];
        cursor += 1;
        return nextId;
      });
    });
  };

  useEffect(() => {
    if (!appliedImport || appliedImport.token === appliedTokenRef.current) {
      return;
    }

    appliedTokenRef.current = appliedImport.token;
    const nextName = appliedImport.eventName;
    eventNameRef.current = nextName;
    draftDirtyRef.current = true;
    setEventName(nextName);

    eventDatesRef.current = appliedImport.dates;
    setEventDates(appliedImport.dates);

    if (appliedImport.sectionOrder.length > 0) {
      setSectionOrder([...mergeSectionOrder(appliedImport.sectionOrder), EXPORT_IMPORT_PANEL_ID]);
    }

    setSectionStatuses((current) => {
      const next = { ...current };
      for (const sectionId of DEFAULT_SECTION_ORDER) {
        const status = appliedImport.sectionStatuses[sectionId];
        if (status === 'not_started' || status === 'in_progress' || status === 'finalized') {
          next[sectionId] = status;
        }
      }
      sectionStatusesRef.current = next;
      return next;
    });

    const storedStatuses: Record<string, StoredSectionStatus> = {};
    for (const sectionId of DEFAULT_SECTION_ORDER) {
      const status = appliedImport.sectionStatuses[sectionId];
      if (status === 'not_started' || status === 'in_progress' || status === 'finalized') {
        storedStatuses[sectionId] = STATUS_TO_STORED[status];
      }
    }
    enqueueEventSave((currentEventId) =>
      saveEventSectionStatuses({
        eventId: currentEventId,
        eventGroupCode: eventGroupCodeRef.current,
        eventName: nextName,
        sectionStatuses: storedStatuses,
      }),
    );

    return () => {
      appliedTokenRef.current = 0;
    };
  }, [appliedImport, enqueueEventSave]);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title={pageTitle} backTo={backPath} backLabel={backLabel} />
        {eventGroupName && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            {eventGroupName}
          </Typography>
        )}

        <Stack
          spacing={1}
          sx={{
            alignItems: 'center',
            mb: 3,
            width: '100%',
          }}
        >
          <Typography variant="body2" component="div" sx={{ fontWeight: 700 }}>
            {eventCancelled ? 'Cancelled' : 'Not cancelled'}
          </Typography>
          <ToggleButton
            value="cancelled"
            selected={eventCancelled}
            aria-pressed={eventCancelled}
            aria-label={eventCancelled ? 'Uncancel event' : 'Cancel event'}
            onChange={() => {
              const next = !eventCancelledRef.current;
              eventCancelledRef.current = next;
              draftDirtyRef.current = true;
              setEventCancelled(next);
            }}
            sx={{ textTransform: 'none' }}
          >
            {eventCancelled ? 'Uncancel' : 'Cancel'}
          </ToggleButton>
        </Stack>

        <Stack spacing={1.5} sx={{ mb: 3, width: '100%', ...(showXsLayout ? {} : { maxWidth: 960, mx: 'auto' }) }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext items={displayedSectionIds} strategy={verticalListSortingStrategy}>
              <Stack spacing={1.5}>
                {displayedSectionIds.map((panelId) => {
                  if (panelId === EXPORT_IMPORT_PANEL_ID) {
                    return (
                      <AddEventSortableSectionAccordion
                        key={panelId}
                        sectionId={panelId}
                        sectionTitle="Export / Import"
                        sectionDescription=""
                        expanded={expandedSection === panelId}
                        onAccordionChange={handleAccordionChange(panelId)}
                        sectionContent={
                          <AddEventExportImport
                            eventName={eventName}
                            eventGroupCode={eventGroupCode}
                            dates={eventDates}
                            sectionStatuses={sectionStatuses}
                            sectionOrder={sectionOrder}
                            scheduleDays={getScheduleTimeBlockDays(eventDates)}
                            importantContact={DEFAULT_IMPORTANT_CONTACT}
                          />
                        }
                        sectionStatus="not_started"
                        onStatusChange={() => undefined}
                        showStatusToggle={false}
                        showStatusIcon={false}
                      />
                    );
                  }

                  const section = ADD_EVENT_SECTIONS_BY_ID[panelId];
                  const sectionContent = renderSectionContent(
                    section.id,
                    () => handleSectionFieldEdit(section.id),
                    eventName,
                    handleEventNameChange,
                    eventDates,
                    handleEventDatesChange,
                    sectionStatuses.schedule,
                    handleSectionStatusChange('schedule'),
                    scheduleDatesSelected,
                    handlePassesSummaryChange,
                    handleNoEarlyBirdDatesChange,
                    handleVenueChange,
                    expandedSection === 'location',
                    handleSaveLocation,
                    handleContactVenueSummaryChange,
                    savedEventId,
                    handleSaveRoles,
                    eventTypeCode,
                    handleContestsSummaryChange,
                    handleSaveContests,
                    expandedSection === 'staff',
                    handleStaffSummaryChange,
                    handleSaveStaff,
                    handleIntensivesSummaryChange,
                  );
                  const sectionStatus = sectionStatuses[section.id];
                  const sectionTitle = sectionDisplayTitle(
                    section,
                    sectionStatus,
                    eventName,
                    formatEventStartDateLabel(eventDates.startDateTime),
                    passesSummary,
                    noEarlyBirdDates,
                    venueName,
                    contactVenueSummary,
                    hasContests,
                    contestCount,
                    hasStaff,
                    intensivesSummary,
                  );

                  return (
                    <AddEventSortableSectionAccordion
                      key={section.id}
                      sectionId={section.id}
                      sectionTitle={sectionTitle}
                      sectionDescription={section.description}
                      expanded={expandedSection === section.id}
                      onAccordionChange={handleAccordionChange(section.id)}
                      sectionContent={sectionContent}
                      sectionStatus={sectionStatus}
                      onStatusChange={handleSectionStatusChange(section.id)}
                      showStatusToggle={section.id !== 'schedule'}
                      disabledStatuses={disabledStatusesForSection(
                        section.id,
                        eventNameReadyToFinalize,
                        scheduleDatesSelected,
                      )}
                      disabled={section.id !== 'event_name' && !otherSectionsEnabled}
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>

      </Paper>
    </Container>
  );
}

export default function AdminAddEventPage() {
  return (
    <EventFormExportProvider>
      <AdminAddEventForm />
    </EventFormExportProvider>
  );
}
