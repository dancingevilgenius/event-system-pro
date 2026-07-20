import {
  Button,
  Container,
  Paper,
  Stack,
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
import { type SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchEventById, fetchEventGroupByCode } from '../api/postgrest';
import AddEventDates from '../components/AddEventDates';
import AddEventLocation from '../components/AddEventLocation';
import AddEventOnlineLinks from '../components/AddEventOnlineLinks';
import AddEventEarlyBirdDates from '../components/AddEventEarlyBirdDates';
import AddEventPasses from '../components/AddEventPasses';
import AddEventScheduleDays from '../components/AddEventScheduleDays';
import AddEventRoles from '../components/AddEventRoles';
import AddEventImportantContacts from '../components/AddEventImportantContacts';
import AddEventContests from '../components/AddEventContests';
import AddEventStaff from '../components/AddEventStaff';
import AddEventVolunteers from '../components/AddEventVolunteers';
import AddEventSortableSectionAccordion from '../components/AddEventSortableSectionAccordion';
import { type AddEventSectionStatus } from '../components/AddEventSectionStatusToggle';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';
import {
  EVENT_GROUPS_PATH,
  eventDetailPath,
  eventGroupDetailPath,
} from '../constants/eventRoutes';
import {
  EMPTY_EVENT_DATES,
  eventDatesFromApiTimestamps,
  type EventDatesFormState,
  getScheduleTimeBlockDays,
  hasEventDatesForSchedule,
} from '../lib/eventDates';
import { resolveEventGroupCode } from '../lib/eventGroupSession';

type AddEventLocationState = {
  eventGroupCode?: string;
  eventId?: number;
};

type AddEventSectionId =
  | 'dates'
  | 'passes'
  | 'roles'
  | 'early_bird_dates'
  | 'location'
  | 'online_links'
  | 'important_contacts'
  | 'contests'
  | 'schedule'
  | 'staff'
  | 'volunteers';

type AddEventSection = {
  id: AddEventSectionId;
  title: string;
  description: string;
};

const ADD_EVENT_SECTIONS: AddEventSection[] = [
  { id: 'dates', title: 'Date(s)', description: '' },
  { id: 'passes', title: 'Passes', description: '' },
  { id: 'roles', title: 'Roles', description: '' },
  { id: 'early_bird_dates', title: 'Early Bird Dates', description: '' },
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

const ADD_EVENT_SECTIONS_BY_ID = Object.fromEntries(
  ADD_EVENT_SECTIONS.map((section) => [section.id, section]),
) as Record<AddEventSectionId, AddEventSection>;

const DEFAULT_SECTION_STATUS: AddEventSectionStatus = 'not_started';

function createInitialSectionStatuses(): Record<AddEventSectionId, AddEventSectionStatus> {
  return {
    dates: DEFAULT_SECTION_STATUS,
    passes: DEFAULT_SECTION_STATUS,
    roles: DEFAULT_SECTION_STATUS,
    early_bird_dates: DEFAULT_SECTION_STATUS,
    location: DEFAULT_SECTION_STATUS,
    online_links: DEFAULT_SECTION_STATUS,
    important_contacts: DEFAULT_SECTION_STATUS,
    contests: DEFAULT_SECTION_STATUS,
    schedule: DEFAULT_SECTION_STATUS,
    staff: DEFAULT_SECTION_STATUS,
    volunteers: DEFAULT_SECTION_STATUS,
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
  eventDates: EventDatesFormState,
  onEventDatesChange: (dates: EventDatesFormState) => void,
  scheduleSectionStatus: AddEventSectionStatus,
  onScheduleSectionStatusChange: (status: AddEventSectionStatus) => void,
  scheduleDatesSelected: boolean,
) {
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
    return <AddEventLocation onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'passes') {
    return <AddEventPasses onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'roles') {
    return <AddEventRoles onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'early_bird_dates') {
    return <AddEventEarlyBirdDates onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'online_links') {
    return <AddEventOnlineLinks onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'important_contacts') {
    return <AddEventImportantContacts onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'contests') {
    return <AddEventContests onFieldEdit={onFieldEdit} />;
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
    return <AddEventStaff onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'volunteers') {
    return <AddEventVolunteers onFieldEdit={onFieldEdit} />;
  }

  return null;
}

export default function AdminAddEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const locationState = (location.state as AddEventLocationState | null) ?? null;
  const eventGroupCode = resolveEventGroupCode(locationState) ?? '';
  const rawEventId = locationState?.eventId;
  const eventId =
    typeof rawEventId === 'number' && Number.isFinite(rawEventId) ? rawEventId : null;
  const isEditingEvent = eventId !== null;
  const [eventGroupName, setEventGroupName] = useState('');
  const [expandedSection, setExpandedSection] = useState<AddEventSectionId | false>('dates');
  const [sectionStatuses, setSectionStatuses] = useState(createInitialSectionStatuses);
  const [sectionOrder, setSectionOrder] = useState<AddEventSectionId[]>(DEFAULT_SECTION_ORDER);
  const [eventDates, setEventDates] = useState<EventDatesFormState>(EMPTY_EVENT_DATES);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const orderedSections = useMemo(
    () => sectionOrder.map((sectionId) => ADD_EVENT_SECTIONS_BY_ID[sectionId]),
    [sectionOrder],
  );

  const scheduleDatesSelected = hasEventDatesForSchedule(eventDates);

  const backPath =
    isEditingEvent && eventGroupCode
      ? eventDetailPath(eventGroupCode, eventId)
      : eventGroupCode
        ? eventGroupDetailPath(eventGroupCode)
        : EVENT_GROUPS_PATH;
  const backLabel =
    isEditingEvent && eventGroupCode
      ? 'Back to Event'
      : eventGroupCode
        ? 'Back to Event Group'
        : 'Back to Event Groups';
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
      return;
    }

    let cancelled = false;

    void fetchEventGroupByCode(eventGroupCode)
      .then((group) => {
        if (!cancelled) {
          setEventGroupName(group?.fullName ?? '');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEventGroupName('');
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

    void fetchEventById(eventId)
      .then((event) => {
        if (cancelled) {
          return;
        }

        if (!event || (eventGroupCode && event.eventGroupCode !== eventGroupCode)) {
          return;
        }

        const nextDates = eventDatesFromApiTimestamps(event.startDate, event.endDate);
        setEventDates(nextDates);

        if (nextDates.startDateTime || nextDates.endDateTime) {
          setSectionStatuses((current) =>
            current.dates === 'in_progress' ? current : { ...current, dates: 'in_progress' },
          );
        }
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

  const handleSectionStatusChange =
    (sectionId: AddEventSectionId) => (status: AddEventSectionStatus) => {
      setSectionStatuses((current) => ({ ...current, [sectionId]: status }));
    };

  const handleSectionFieldEdit = (sectionId: AddEventSectionId) => {
    setSectionStatuses((current) => promoteSectionToInProgress(current, sectionId));
  };

  const handleAccordionChange =
    (sectionId: AddEventSectionId) =>
    (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpandedSection(isExpanded ? sectionId : false);
    };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setSectionOrder((current) => {
      const oldIndex = current.indexOf(active.id as AddEventSectionId);
      const newIndex = current.indexOf(over.id as AddEventSectionId);
      return arrayMove(current, oldIndex, newIndex);
    });
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          {pageTitle}
        </Typography>
        {eventGroupName && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: 'center' }}
          >
            {eventGroupName}
          </Typography>
        )}

        <Stack spacing={1.5} sx={{ mb: 3, width: '100%', ...(showXsLayout ? {} : { maxWidth: 960, mx: 'auto' }) }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
              <Stack spacing={1.5}>
                {orderedSections.map((section) => {
                  const sectionContent = renderSectionContent(
                    section.id,
                    () => handleSectionFieldEdit(section.id),
                    eventDates,
                    setEventDates,
                    sectionStatuses.schedule,
                    handleSectionStatusChange('schedule'),
                    scheduleDatesSelected,
                  );
                  const sectionStatus = sectionStatuses[section.id];

                  return (
                    <AddEventSortableSectionAccordion
                      key={section.id}
                      sectionId={section.id}
                      sectionTitle={section.title}
                      sectionDescription={section.description}
                      expanded={expandedSection === section.id}
                      onAccordionChange={handleAccordionChange(section.id)}
                      sectionContent={sectionContent}
                      sectionStatus={sectionStatus}
                      onStatusChange={handleSectionStatusChange(section.id)}
                      showStatusToggle={section.id !== 'schedule'}
                      disabledStatuses={
                        section.id === 'schedule' && !scheduleDatesSelected
                          ? ['in_progress', 'finalized']
                          : undefined
                      }
                    />
                  );
                })}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>

        <Stack spacing={2} sx={showXsLayout ? centeredContentStackSx : { maxWidth: 480, mx: 'auto', width: '100%' }}>
          <Button variant="outlined" fullWidth onClick={() => navigate(backPath)}>
            {backLabel}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
