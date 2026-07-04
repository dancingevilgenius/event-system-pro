import { Stack, type SxProps, type Theme } from '@mui/material';
import type { SecretQuestion } from '../api/postgrest';
import { centeredContentStackSx } from '../constants/layout';
import AppTextField from './AppTextField';
import { SecretQuestionPicker } from './SecretQuestionsSelector';

export type SecretQuestionAndAnswerProps = {
  questions: SecretQuestion[];
  selectedQuestionId: number | '';
  excludedQuestionIds: number[];
  answer: string;
  onQuestionChange: (questionId: number) => void;
  onAnswerChange: (answer: string) => void;
  answerLabel?: string;
  answerError?: boolean;
  answerFieldSx?: SxProps<Theme>;
};

export default function SecretQuestionAndAnswer({
  questions,
  selectedQuestionId,
  excludedQuestionIds,
  answer,
  onQuestionChange,
  onAnswerChange,
  answerLabel = 'Your answer',
  answerError = false,
  answerFieldSx,
}: SecretQuestionAndAnswerProps) {
  return (
    <Stack spacing={1.5} sx={{ ...centeredContentStackSx, width: '100%' }}>
      <SecretQuestionPicker
        questions={questions}
        selectedQuestionId={selectedQuestionId}
        excludedQuestionIds={excludedQuestionIds}
        onQuestionChange={onQuestionChange}
      />
      <AppTextField
        label={answerLabel}
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        fullWidth
        autoComplete="off"
        error={answerError}
        sx={{
          width: '100%',
          ...answerFieldSx,
        }}
      />
    </Stack>
  );
}
