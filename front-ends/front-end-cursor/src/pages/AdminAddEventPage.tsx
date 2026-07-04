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
import { fetchEventGroupByCode } from '../api/postgrest';
import EventDatesForm from '../components/EventDatesForm';
import AddEventLocationSection from '../components/AddEventLocationSection';
import AddEventOnlineLinksSection from '../components/AddEventOnlineLinksSection';
import EventScheduleDays from '../components/EventScheduleDays';
import AddEventSortableSectionAccordion from '../components/AddEventSortableSectionAccordion';
import { type AddEventSectionStatus } from '../components/AddEventSectionStatusToggle';
import { centeredContentStackSx } from '../constants/layout';
import { EVENT_GROUPS_PATH, eventGroupDetailPath } from '../constants/eventRoutes';
import {
  EMPTY_EVENT_DATES,
  type EventDatesFormState,
  getScheduleTimeBlockDays,
  hasEventDatesForSchedule,
} from '../lib/eventDates';
import { resolveEventGroupCode } from '../lib/eventGroupSession';

type AddEventLocationState = {
  eventGroupCode?: string;
};

type AddEventSectionId =
  | 'dates'
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
    description: 'Key event contacts and roles will be configured here.',
  },
  {
    id: 'contests',
    title: 'Contests',
    description: 'Contest divisions, skill levels, and contest names will be configured here.',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: '',
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'Event staff roles and assignments will be configured here.',
  },
  {
    id: 'volunteers',
    title: 'Volunteers',
    description: 'Volunteer roles and signup details will be configured here.',
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
      <EventDatesForm
        dates={eventDates}
        onDatesChange={onEventDatesChange}
        onFieldEdit={onFieldEdit}
      />
    );
  }

  if (sectionId === 'location') {
    return <AddEventLocationSection onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'online_links') {
    return <AddEventOnlineLinksSection onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'schedule') {
    return (
      <EventScheduleDays
        scheduleTimeBlocks={getScheduleTimeBlockDays(eventDates)}
        status={scheduleSectionStatus}
        onStatusChange={onScheduleSectionStatusChange}
        disabledStatuses={
          scheduleDatesSelected ? undefined : ['in_progress', 'finalized']
        }
      />
    );
  }

  return null;
}

export default function AdminAddEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventGroupCode =
    resolveEventGroupCode(location.state as AddEventLocationState | null) ?? '';
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

  const backPath = eventGroupCode ? eventGroupDetailPath(eventGroupCode) : EVENT_GROUPS_PATH;
  const backLabel = eventGroupCode ? 'Back to Event Group' : 'Back to Event Groups';

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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {eventGroupCode ? `Add Event for ${eventGroupCode}` : 'Add Event'}
        </Typography>
        {eventGroupName && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {eventGroupName}
          </Typography>
        )}

        <Stack spacing={1.5} sx={{ mb: 3, width: '100%' }}>
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

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate(backPath)}>
            {backLabel}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
