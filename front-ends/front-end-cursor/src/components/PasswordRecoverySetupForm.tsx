import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchSecretQuestions, type SecretQuestion } from '../api/postgrest';
import AppTextField from './AppTextField';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

export type PasswordRecoveryAnswer = {
  secretQuestionId: number;
  answer: string;
};

type PasswordRecoverySlot = {
  secretQuestionId: number | '';
  answer: string;
};

const EMPTY_SLOTS: PasswordRecoverySlot[] = [
  { secretQuestionId: '', answer: '' },
  { secretQuestionId: '', answer: '' },
  { secretQuestionId: '', answer: '' },
];

function isBlankAnswer(value: string): boolean {
  return value.trim().length === 0;
}

function slotsFromQuestionIds(questionIds: number[]): PasswordRecoverySlot[] {
  const slots = EMPTY_SLOTS.map((slot) => ({ ...slot }));
  questionIds.slice(0, 3).forEach((questionId, index) => {
    slots[index] = {
      secretQuestionId: questionId,
      answer: '',
    };
  });
  return slots;
}

type PasswordRecoverySetupFormProps = {
  initialQuestionIds?: number[];
  onSave: (answers: PasswordRecoveryAnswer[]) => Promise<void>;
  saving?: boolean;
};

export default function PasswordRecoverySetupForm({
  initialQuestionIds = [],
  onSave,
  saving = false,
}: PasswordRecoverySetupFormProps) {
  const [questions, setQuestions] = useState<SecretQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [slots, setSlots] = useState<PasswordRecoverySlot[]>(() =>
    slotsFromQuestionIds(initialQuestionIds),
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setSlots(slotsFromQuestionIds(initialQuestionIds));
  }, [initialQuestionIds]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    void fetchSecretQuestions()
      .then((items) => {
        if (!cancelled) {
          setQuestions(items);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'Unable to load secret questions.',
          );
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
  }, []);

  const updateSlot = (index: number, patch: Partial<PasswordRecoverySlot>) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot,
      ),
    );
    setValidationError(null);
  };

  const selectedQuestionIds = slots
    .map((slot) => slot.secretQuestionId)
    .filter((id): id is number => id !== '');

  const handleSave = async () => {
    const incomplete = slots.some(
      (slot) => slot.secretQuestionId === '' || isBlankAnswer(slot.answer),
    );
    if (incomplete) {
      setValidationError('Choose a question and enter an answer for each slot.');
      return;
    }

    const ids = slots.map((slot) => Number(slot.secretQuestionId));
    if (new Set(ids).size !== ids.length) {
      setValidationError('Each secret question can only be used once.');
      return;
    }

    const answers = slots.map((slot) => ({
      secretQuestionId: Number(slot.secretQuestionId),
      answer: slot.answer.trim(),
    }));

    setValidationError(null);
    try {
      await onSave(answers);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Unable to save password recovery answers.',
      );
    }
  };

  if (loading) {
    return (
      <Stack sx={{ py: 3, alignItems: 'center' }}>
        <CircularProgress size={28} />
      </Stack>
    );
  }

  if (loadError) {
    return (
      <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
        {loadError}
      </Typography>
    );
  }

  return (
    <Stack spacing={2.5} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
      {slots.map((slot, index) => (
        <Box
          key={index}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Question {index + 1}
          </Typography>
          <Stack spacing={1.5}>
            <AppTextField
              select
              label="Secret question"
              value={slot.secretQuestionId === '' ? '' : String(slot.secretQuestionId)}
              onChange={(event) =>
                updateSlot(index, {
                  secretQuestionId:
                    event.target.value === '' ? '' : Number.parseInt(event.target.value, 10),
                })
              }
              fullWidth
            >
              <MenuItem value="">
                <em>Select a question</em>
              </MenuItem>
              {questions.map((question) => {
                const takenElsewhere =
                  selectedQuestionIds.includes(question.secret_question_id) &&
                  slot.secretQuestionId !== question.secret_question_id;

                return (
                  <MenuItem
                    key={question.secret_question_id}
                    value={String(question.secret_question_id)}
                    disabled={takenElsewhere}
                  >
                    {question.question}
                  </MenuItem>
                );
              })}
            </AppTextField>
            <AppTextField
              label="Your answer"
              value={slot.answer}
              onChange={(event) => updateSlot(index, { answer: event.target.value })}
              fullWidth
              autoComplete="off"
            />
          </Stack>
        </Box>
      ))}

      {validationError && (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
          {validationError}
        </Typography>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={saving}
        onClick={() => void handleSave()}
      >
        {saving ? 'Saving…' : 'Save secret questions'}
      </Button>
    </Stack>
  );
}
