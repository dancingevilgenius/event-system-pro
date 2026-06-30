import { useState } from 'react';
import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { generateDemoAttendees } from '../api/postgrest';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';
import { usePocCounter } from '../hooks/usePocCounter';

const ADMIN_BUTTONS = [
  { label: 'Events', path: '/admin/event-details' },
  { label: 'Contests', path: '/admin/contests' },
  { label: 'Competitors', path: '/admin/competitors' },
  { label: 'Competition Entries', path: '/admin/competition-entries' },
  { label: 'Static Lists', path: '/static-lists' },
  { label: 'Staff', path: '/staff' },
] as const;

export default function AdminHomePage() {
  const navigate = useNavigate();
  const { showSuccess, showWarning, showProblem, clearMessages } = useMessages();
  const { counter, error: counterError } = usePocCounter();
  const [generatingAttendees, setGeneratingAttendees] = useState(false);

  const handleTestMessages = () => {
    clearMessages();
    showSuccess('Your change has been saved.');
    showWarning('Your event starts in less than 15 min.');
    showProblem('Your sign in time has passed.');
  };

  const handleGenerateAttendees = async () => {
    clearMessages();
    setGeneratingAttendees(true);

    try {
      const result = await generateDemoAttendees();

      if (!result.ok) {
        showProblem(result.message);
        return;
      }

      const groups = result.event_groups?.length
        ? ` Groups: ${result.event_groups.join(', ')}.`
        : '';

      showSuccess(`${result.message}${groups}`);
    } catch (error) {
      showProblem(
        error instanceof Error ? error.message : 'Unable to generate demo attendees.',
      );
    } finally {
      setGeneratingAttendees(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          counter:{' '}
          {counterError
            ? 'unavailable'
            : counter === null
              ? '…'
              : counter}
        </Typography>

        <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
          {ADMIN_BUTTONS.map((button) => (
            <Button
              key={button.label}
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate(button.path)}
            >
              {button.label}
            </Button>
          ))}
        </Stack>

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button
            variant="outlined"
            fullWidth
            disabled={generatingAttendees}
            onClick={() => void handleGenerateAttendees()}
          >
            {generatingAttendees ? 'Generating Attendees…' : 'Generate Attendees'}
          </Button>
          <Button variant="outlined" fullWidth onClick={handleTestMessages}>
            Test Messages
          </Button>
          <Button variant="outlined" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
