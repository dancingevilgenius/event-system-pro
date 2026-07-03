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
import { centeredContentStackSx } from '../constants/layout';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import AppTextField from './AppTextField';
import SecretQuestionAndAnswer from './SecretQuestionAndAnswer';
import SecretQuestionCarousel from './SecretQuestionCarousel';
import SecretQuestionSlot from './SecretQuestionSlot';

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

export type SecretQuestionPickerProps = {
  questions: SecretQuestion[];
  selectedQuestionId: number | '';
  excludedQuestionIds: number[];
  onQuestionChange: (questionId: number) => void;
};

const pickerMobileChromeSx = {
  width: '100%',
} as const;

export function SecretQuestionPicker({
  questions,
  selectedQuestionId,
  excludedQuestionIds,
  onQuestionChange,
}: SecretQuestionPickerProps) {
  const isMobile = useIsMobileDevice();

  if (isMobile) {
    return (
      <Box sx={pickerMobileChromeSx}>
        <SecretQuestionCarousel
          questions={questions}
          selectedQuestionId={selectedQuestionId}
          excludedQuestionIds={excludedQuestionIds}
          onQuestionChange={onQuestionChange}
        />
      </Box>
    );
  }

  return (
    <AppTextField
      select
      value={selectedQuestionId === '' ? '' : String(selectedQuestionId)}
      onChange={(event) => {
        const value = event.target.value;
        if (value === '') {
          return;
        }
        onQuestionChange(Number.parseInt(value, 10));
      }}
      fullWidth
      aria-label="Secret question"
    >
      <MenuItem value="">
        <em>Select a question</em>
      </MenuItem>
      {questions.map((question) => {
        const takenElsewhere =
          excludedQuestionIds.includes(question.secret_question_id) &&
          selectedQuestionId !== question.secret_question_id;

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
  );
}

export type SecretQuestionsSelectorProps = {
  initialQuestionIds?: number[];
  onSave: (answers: PasswordRecoveryAnswer[]) => Promise<void>;
  saving?: boolean;
  saveButtonLabel?: string;
  showSlotLabels?: boolean;
};

export default function SecretQuestionsSelector({
  initialQuestionIds = [],
  onSave,
  saving = false,
  saveButtonLabel = 'Save secret questions',
  showSlotLabels = true,
}: SecretQuestionsSelectorProps) {
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
      <Stack sx={{ py: 3, alignItems: 'center', width: '100%' }}>
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
    <Stack spacing={2.5} sx={{ ...centeredContentStackSx, width: '100%' }}>
      {slots.map((slot, index) => (
        <SecretQuestionSlot
          key={index}
          label={showSlotLabels ? `Question ${index + 1}` : undefined}
        >
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
          />
        </SecretQuestionSlot>
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
        {saving ? 'Saving…' : saveButtonLabel}
      </Button>
    </Stack>
  );
}
