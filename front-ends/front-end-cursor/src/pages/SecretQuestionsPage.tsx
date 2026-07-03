import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPasswordRecoverySetup,
  updatePasswordRecovery,
} from '../api/postgrest';
import PasswordRecoverySetupForm, {
  type PasswordRecoveryAnswer,
} from '../components/PasswordRecoverySetupForm';
import { centeredContentStackSx } from '../constants/layout';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';

export default function SecretQuestionsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const [initialQuestionIds, setInitialQuestionIds] = useState<number[]>([]);
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;
    setLoadingSetup(true);

    void getPasswordRecoverySetup(session.user_id)
      .then((result) => {
        if (cancelled) {
          return;
        }

        if (!result.ok) {
          showProblem(result.message ?? 'Unable to load password recovery settings.');
          return;
        }

        setInitialQuestionIds(result.secret_question_ids ?? []);
      })
      .catch((error) => {
        if (!cancelled) {
          showProblem(
            error instanceof Error ? error.message : 'Unable to load password recovery settings.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSetup(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!session) {
    return null;
  }

  const handleSave = async (answers: PasswordRecoveryAnswer[]) => {
    setSaving(true);
    try {
      const result = await updatePasswordRecovery(
        answers.map((answer) => ({
          secret_question_id: answer.secretQuestionId,
          answer: answer.answer,
        })),
        session.user_id,
      );

      if (!result.ok) {
        showProblem(result.message);
        return;
      }

      showSuccess(result.message);
      navigate('/account');
    } catch (error) {
      showProblem(
        error instanceof Error ? error.message : 'Unable to save password recovery answers.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Password Recovery
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Choose three secret questions and answers. You can use two of them later on the forgot-password
          page. Answers are encrypted on save.
        </Typography>

        <Stack spacing={2} sx={centeredContentStackSx}>
          {!loadingSetup && (
            <PasswordRecoverySetupForm
              initialQuestionIds={initialQuestionIds}
              onSave={handleSave}
              saving={saving}
            />
          )}
          {loadingSetup && (
            <Typography variant="body2" color="text.secondary" align="center">
              Loading your password recovery settings…
            </Typography>
          )}
          <Button variant="text" fullWidth onClick={() => navigate('/account')}>
            Back to Account
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
