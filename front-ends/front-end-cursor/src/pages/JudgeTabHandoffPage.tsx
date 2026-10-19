import { CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { takeJudgeTabHandoff } from '../lib/openJudgeTabs';
import { saveSession } from '../lib/session';

const HANDOFF_WAIT_MS = 20000;

export default function JudgeTabHandoffPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Signing in…');

  useEffect(() => {
    const handoff = searchParams.get('handoff') ?? '';
    const pending = searchParams.get('pending') ?? '';
    let cancelled = false;

    const finish = (key: string): boolean => {
      const session = takeJudgeTabHandoff(key);
      if (!session) {
        return false;
      }
      saveSession(session);
      window.location.replace('/judgingHome');
      return true;
    };

    if (handoff) {
      if (!finish(handoff)) {
        setMessage('This judge tab link has already been used. Open it again from Admin.');
      }
      return;
    }

    if (!pending) {
      setMessage('This judge tab link is missing. Open it again from Admin.');
      return;
    }

    if (finish(pending)) {
      return;
    }

    const started = Date.now();
    const timer = window.setInterval(() => {
      if (cancelled) {
        return;
      }
      if (finish(pending)) {
        window.clearInterval(timer);
        return;
      }
      if (Date.now() - started > HANDOFF_WAIT_MS) {
        window.clearInterval(timer);
        setMessage('Sign-in did not finish. Close this tab and try again from Admin.');
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [searchParams]);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          {message === 'Signing in…' && <CircularProgress />}
          <Typography variant="body1">{message}</Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
