import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchEventGroupByCode } from '../api/postgrest';
import AddEventDatesSection from '../components/AddEventDatesSection';
import AddEventLocationSection from '../components/AddEventLocationSection';
import AddEventOnlineLinksSection from '../components/AddEventOnlineLinksSection';
import AddEventSectionStatusIcon from '../components/AddEventSectionStatusIcon';
import AddEventSectionStatusToggle, {
  type AddEventSectionStatus,
} from '../components/AddEventSectionStatusToggle';
import { centeredContentStackSx } from '../constants/layout';
import { EVENT_GROUPS_PATH, eventGroupDetailPath } from '../constants/eventRoutes';

type AddEventLocationState = {
  eventGroupCode?: string;
};

type AddEventSectionId =
  | 'dates'
  | 'location'
  | 'online_links'
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
    id: 'contests',
    title: 'Contests',
    description: 'Contest divisions, skill levels, and contest names will be configured here.',
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: 'Daily schedule blocks and session timing will be configured here.',
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

const accordionSummarySx = {
  px: 2,
  minHeight: 48,
  '& .MuiAccordionSummary-content': {
    my: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    minWidth: 0,
  },
} as const;

const DEFAULT_SECTION_STATUS: AddEventSectionStatus = 'not_started';

function createInitialSectionStatuses(): Record<AddEventSectionId, AddEventSectionStatus> {
  return {
    dates: DEFAULT_SECTION_STATUS,
    location: DEFAULT_SECTION_STATUS,
    online_links: DEFAULT_SECTION_STATUS,
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

function renderSectionContent(sectionId: AddEventSectionId, onFieldEdit: () => void) {
  if (sectionId === 'dates') {
    return <AddEventDatesSection onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'location') {
    return <AddEventLocationSection onFieldEdit={onFieldEdit} />;
  }

  if (sectionId === 'online_links') {
    return <AddEventOnlineLinksSection onFieldEdit={onFieldEdit} />;
  }

  return null;
}

export default function AdminAddEventPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventGroupCode = (location.state as AddEventLocationState | null)?.eventGroupCode?.trim();
  const [eventGroupName, setEventGroupName] = useState('');
  const [expandedSection, setExpandedSection] = useState<AddEventSectionId | false>('dates');
  const [sectionStatuses, setSectionStatuses] = useState(createInitialSectionStatuses);

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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add Event
        </Typography>
        {eventGroupName && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {eventGroupName}
          </Typography>
        )}

        <Stack spacing={1.5} sx={{ mb: 3, width: '100%' }}>
          {ADD_EVENT_SECTIONS.map((section) => {
            const sectionContent = renderSectionContent(section.id, () =>
              handleSectionFieldEdit(section.id),
            );
            const sectionStatus = sectionStatuses[section.id];

            return (
              <Accordion
                key={section.id}
                expanded={expandedSection === section.id}
                onChange={handleAccordionChange(section.id)}
                disableGutters
                elevation={0}
                variant="outlined"
                sx={{ width: '100%', overflow: 'hidden' }}
              >
                <AccordionSummary
                  aria-controls={`${section.id}-content`}
                  id={`${section.id}-header`}
                  sx={accordionSummarySx}
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{ fontWeight: 600, minWidth: 0 }}
                  >
                    {section.title}
                  </Typography>
                  <AddEventSectionStatusIcon
                    status={sectionStatus}
                    sectionTitle={section.title}
                  />
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Stack spacing={2}>
                    {sectionContent ?? (
                      <Typography variant="body2" color="text.secondary">
                        {section.description}
                      </Typography>
                    )}
                    <AddEventSectionStatusToggle
                      value={sectionStatuses[section.id]}
                      onChange={handleSectionStatusChange(section.id)}
                      aria-label={`${section.title} status`}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
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
