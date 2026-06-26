import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchSecretQuestions, type SecretQuestion } from '../api/postgrest';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

export type PasswordRecoveryAnswer = {
  secretQuestionId: number;
  answer: string;
};

type PasswordRecoverySlot = {
  secretQuestionId: number | '';
  answer: string;
};

type PasswordRecoveryDialogProps = {
  open: boolean;
  initialQuestionIds: number[];
  onClose: () => void;
  onSave: (answers: PasswordRecoveryAnswer[]) => Promise<void>;
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

export default function PasswordRecoveryDialog({
  open,
  initialQuestionIds,
  onClose,
  onSave,
}: PasswordRecoveryDialogProps) {
  const [questions, setQuestions] = useState<SecretQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [slots, setSlots] = useState<PasswordRecoverySlot[]>(EMPTY_SLOTS);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSlots(slotsFromQuestionIds(initialQuestionIds));
    setValidationError(null);
    setLoadError(null);
    setLoading(true);

    fetchSecretQuestions()
      .then((items) => setQuestions(items))
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : 'Unable to load secret questions.');
      })
      .finally(() => setLoading(false));
  }, [open, initialQuestionIds]);

  const updateSlot = (index: number, patch: Partial<PasswordRecoverySlot>) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot,
      ),
    );
    setValidationError(null);
  };

  const handleSave = async () => {
    const incomplete = slots.some(
      (slot) => slot.secretQuestionId === '' || isBlankAnswer(slot.answer),
    );
    if (incomplete) {
      setValidationError('Each answer must contain non-whitespace characters.');
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

    setSaving(true);
    setValidationError(null);
    try {
      await onSave(answers);
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Unable to save password recovery answers.',
      );
    } finally {
      setSaving(false);
    }
  };

  const availableQuestionsForSlot = (slotIndex: number) => {
    const usedElsewhere = new Set(
      slots
        .map((slot, index) => (index === slotIndex ? null : slot.secretQuestionId))
        .filter((id): id is number => id !== '' && id !== null),
    );

    return questions.filter((question) => !usedElsewhere.has(question.secret_question_id));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 0.5,
          pl: 4,
          pr: 4,
          position: 'relative',
        }}
      >
        Password Recovery
        <IconButton
          aria-label="Close password recovery dialog"
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Choose three secret questions and answers. You can use these later to reset your
          password.
        </Typography>

        {loading && (
          <Stack alignItems="center" sx={{ py: 3 }}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!loading && loadError && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
            {loadError}
          </Typography>
        )}

        {!loading && !loadError && (
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
                  <TextField
                    select
                    label="Secret question"
                    value={slot.secretQuestionId}
                    onChange={(event) =>
                      updateSlot(index, {
                        secretQuestionId:
                          event.target.value === '' ? '' : Number(event.target.value),
                      })
                    }
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>Select a question</em>
                    </MenuItem>
                    {availableQuestionsForSlot(index).map((question) => (
                      <MenuItem
                        key={question.secret_question_id}
                        value={question.secret_question_id}
                      >
                        {question.question}
                      </MenuItem>
                    ))}
                  </TextField>
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
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3, pt: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}
        >
          <Button variant="outlined" onClick={onClose} fullWidth disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => void handleSave()}
            fullWidth
            disabled={loading || Boolean(loadError) || saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
