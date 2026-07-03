import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import type { SecretQuestion } from '../api/postgrest';

type SecretQuestionCarouselProps = {
  questions: SecretQuestion[];
  selectedQuestionId: number | '';
  excludedQuestionIds: number[];
  onQuestionChange: (questionId: number) => void;
};

function sortQuestions(questions: SecretQuestion[]): SecretQuestion[] {
  return [...questions].sort(
    (left, right) => left.secret_question_id - right.secret_question_id,
  );
}

function availableQuestions(
  questions: SecretQuestion[],
  excludedQuestionIds: number[],
  selectedQuestionId: number | '',
): SecretQuestion[] {
  return sortQuestions(questions).filter(
    (question) =>
      question.secret_question_id === selectedQuestionId ||
      !excludedQuestionIds.includes(question.secret_question_id),
  );
}

export function initialQuestionIdsForSlots(
  questions: SecretQuestion[],
  savedQuestionIds: number[],
): number[] {
  if (savedQuestionIds.length === 3) {
    return savedQuestionIds;
  }

  return sortQuestions(questions)
    .slice(0, 3)
    .map((question) => question.secret_question_id);
}

export default function SecretQuestionCarousel({
  questions,
  selectedQuestionId,
  excludedQuestionIds,
  onQuestionChange,
}: SecretQuestionCarouselProps) {
  const choices = useMemo(
    () => availableQuestions(questions, excludedQuestionIds, selectedQuestionId),
    [questions, excludedQuestionIds, selectedQuestionId],
  );

  const currentIndex = choices.findIndex(
    (question) => question.secret_question_id === selectedQuestionId,
  );
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const activeQuestion = choices[activeIndex];

  const cycle = (direction: -1 | 1) => {
    if (choices.length === 0) {
      return;
    }

    const nextIndex = (activeIndex + direction + choices.length) % choices.length;
    onQuestionChange(choices[nextIndex].secret_question_id);
  };

  if (!activeQuestion) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        No secret questions available.
      </Typography>
    );
  }

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ width: '100%' }}>
        <IconButton
          aria-label="Previous secret question"
          onClick={() => cycle(-1)}
          disabled={choices.length <= 1}
          size="large"
          sx={{ flexShrink: 0 }}
        >
          <Typography component="span" aria-hidden="true" sx={{ fontSize: 28, lineHeight: 1 }}>
            ‹
          </Typography>
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" align="center" sx={{ px: 0.5, lineHeight: 1.35 }}>
            {activeQuestion.question}
          </Typography>
        </Box>

        <IconButton
          aria-label="Next secret question"
          onClick={() => cycle(1)}
          disabled={choices.length <= 1}
          size="large"
          sx={{ flexShrink: 0 }}
        >
          <Typography component="span" aria-hidden="true" sx={{ fontSize: 28, lineHeight: 1 }}>
            ›
          </Typography>
        </IconButton>
      </Stack>
    </Stack>
  );
}
