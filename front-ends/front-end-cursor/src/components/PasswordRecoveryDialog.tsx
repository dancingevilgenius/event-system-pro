import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { useSecretQuestions } from '../hooks/useSecretQuestions';
import CloseIcon from './CloseIcon';
import InfoMessageBox from './InfoMessageBox';
import SecretQuestionAndAnswer from './SecretQuestionAndAnswer';
import SecretQuestionSlot from './SecretQuestionSlot';
import { initialQuestionIdsForSlots } from './SecretQuestionCarousel';
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

type AnswerFieldFeedback = 'filled' | 'empty';

function buildAnswerValidationMessage(slots: PasswordRecoverySlot[]): string {
  const emptyCount = slots.filter((slot) => isBlankAnswer(slot.answer)).length;
  const filledCount = slots.length - emptyCount;

  if (emptyCount === slots.length) {
    return 'All three answers are required.';
  }

  return `${filledCount} answered. ${emptyCount} empty.`;
}

function applyAnswerFieldFeedback(
  slots: PasswordRecoverySlot[],
): Record<number, AnswerFieldFeedback> {
  const feedback: Record<number, AnswerFieldFeedback> = {};

  slots.forEach((slot, index) => {
    feedback[index] = isBlankAnswer(slot.answer) ? 'empty' : 'filled';
  });

  return feedback;
}

function secretAnswerFieldSx(feedback: AnswerFieldFeedback | undefined) {
  if (feedback === 'filled') {
    return {
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'success.main', borderWidth: 2 },
        '&:hover fieldset': { borderColor: 'success.dark' },
        '&.Mui-focused fieldset': { borderColor: 'success.main' },
      },
    };
  }

  return undefined;
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
  const { clearMessages, showProblem } = useMessages();
  const { questions, loading, error: fetchError } = useSecretQuestions(open);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState<PasswordRecoverySlot[]>(EMPTY_SLOTS);
  const [answerFeedback, setAnswerFeedback] = useState<Record<number, AnswerFieldFeedback>>({});
  const initialQuestionIdsKey = initialQuestionIds.join(',');
  const loadError =
    fetchError ??
    (!loading && open && questions.length > 0 && questions.length < 3
      ? 'At least three secret questions must be configured.'
      : null);

  useEffect(() => {
    if (!open) {
      return;
    }

    clearMessages();
    setSlots(EMPTY_SLOTS);
    setAnswerFeedback({});
  }, [open, clearMessages]);

  useEffect(() => {
    if (!open || loading || loadError || questions.length < 3) {
      return;
    }

    const questionIds = initialQuestionIdsKey
      ? initialQuestionIdsKey.split(',').map((id) => Number.parseInt(id, 10))
      : [];
    setSlots(slotsFromQuestionIds(initialQuestionIdsForSlots(questions, questionIds)));
  }, [open, loading, loadError, questions, initialQuestionIdsKey]);

  const updateSlot = (index: number, patch: Partial<PasswordRecoverySlot>) => {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot,
      ),
    );

    if ('answer' in patch) {
      setAnswerFeedback((current) => {
        if (current[index] === undefined) {
          return current;
        }

        const next = { ...current };
        delete next[index];
        return next;
      });
    }
  };

  const selectedQuestionIds = slots
    .map((slot) => slot.secretQuestionId)
    .filter((id): id is number => id !== '');

  const handleSave = async () => {
    const incomplete = slots.some((slot) => isBlankAnswer(slot.answer));
    if (incomplete) {
      setAnswerFeedback(applyAnswerFieldFeedback(slots));
      showProblem(buildAnswerValidationMessage(slots));
      return;
    }

    const ids = slots.map((slot) => Number(slot.secretQuestionId));
    if (new Set(ids).size !== ids.length) {
      showProblem('Each secret question can only be used once.');
      return;
    }

    const answers = slots.map((slot) => ({
      secretQuestionId: Number(slot.secretQuestionId),
      answer: slot.answer.trim(),
    }));

    setSaving(true);
    setAnswerFeedback({});
    try {
      await onSave(answers);
    } catch (error) {
      showProblem(
        error instanceof Error ? error.message : 'Unable to save password recovery answers.',
      );
    } finally {
      setSaving(false);
    }
  };

  const readyToShowQuestions =
    !loading &&
    !loadError &&
    questions.length >= 3 &&
    slots.every((slot) => slot.secretQuestionId !== '');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { position: 'relative' } } }}
    >
      {open && (
        <InfoMessageBox overlay>
          Choose three secret questions and answers. On mobile, use the arrows to browse questions.
          Answers are encrypted on save.
        </InfoMessageBox>
      )}
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

      <DialogContent sx={{ pt: 1, px: { xs: 2, sm: 3 } }}>
        {loading && (
          <Stack sx={{ py: 3, alignItems: 'center' }}>
            <CircularProgress size={28} />
          </Stack>
        )}

        {!loading && loadError && (
          <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
            {loadError}
          </Typography>
        )}

        {readyToShowQuestions && (
          <Stack spacing={2.5} sx={{ width: '100%' }}>
            {slots.map((slot, index) => (
              <SecretQuestionSlot key={index}>
                <SecretQuestionAndAnswer
                  questions={questions}
                  selectedQuestionId={slot.secretQuestionId}
                  excludedQuestionIds={selectedQuestionIds.filter(
                    (questionId) => questionId !== slot.secretQuestionId,
                  )}
                  answer={slot.answer}
                  onQuestionChange={(questionId) =>
                    updateSlot(index, { secretQuestionId: questionId })
                  }
                  onAnswerChange={(answer) => updateSlot(index, { answer })}
                  answerError={answerFeedback[index] === 'empty'}
                  answerFieldSx={secretAnswerFieldSx(answerFeedback[index])}
                />
              </SecretQuestionSlot>
            ))}
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
            disabled={loading || Boolean(loadError) || saving || !readyToShowQuestions}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
