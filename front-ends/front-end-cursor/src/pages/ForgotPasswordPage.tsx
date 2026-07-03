import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { type FormEvent, type MouseEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordResetEmail } from '../api/mailer';
import {
  forgotPasswordComplete,
  forgotPasswordSecretQuestionsComplete,
  forgotPasswordSecretQuestionsStart,
  forgotPasswordSecretQuestionsVerify,
  forgotPasswordVerify,
  type ForgotPasswordSecretQuestionsVerifyResult,
  type SecretQuestionPrompt,
} from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';

type RecoveryMethod = 'verification_code' | 'secret_questions';

const FORGOT_PASSWORD_EMAIL_KEY = 'forgotPasswordEmail';
const FORGOT_PASSWORD_IDENTIFIER_KEY = 'forgotPasswordIdentifier';
const FORGOT_PASSWORD_METHOD_KEY = 'forgotPasswordMethod';

function normalizeVerificationCodeInput(code: string): string {
  const digits = code.replace(/\D/g, '');
  if (digits.length === 0 || digits.length > 6) {
    return digits;
  }

  return digits.padStart(6, '0');
}

function readStoredMethod(): RecoveryMethod {
  const stored = sessionStorage.getItem(FORGOT_PASSWORD_METHOD_KEY);
  return stored === 'secret_questions' ? 'secret_questions' : 'verification_code';
}

function buildSecretAnswersPayload(
  questions: SecretQuestionPrompt[],
  answers: Record<number, string>,
) {
  return questions
    .map((question) => ({
      secret_question_id: question.secret_question_id,
      answer: (answers[question.secret_question_id] ?? '').trim(),
    }))
    .filter((entry) => entry.answer.length > 0);
}

const SECRET_QUESTIONS_REQUIRED_COUNT = 2;

type SecretAnswerFeedback = 'correct' | 'incorrect';

function applySecretAnswerFeedback(
  result: ForgotPasswordSecretQuestionsVerifyResult,
): Record<number, SecretAnswerFeedback> {
  const feedback: Record<number, SecretAnswerFeedback> = {};

  for (const questionId of result.correct_question_ids ?? []) {
    feedback[questionId] = 'correct';
  }
  for (const questionId of result.incorrect_question_ids ?? []) {
    feedback[questionId] = 'incorrect';
  }

  return feedback;
}

function secretAnswerFieldSx(feedback: SecretAnswerFeedback | undefined) {
  if (feedback === 'correct') {
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

function stepLabelsForMethod(method: RecoveryMethod): string[] {
  return [
    'Find your account',
    method === 'secret_questions' ? 'Secret questions' : 'Verify code',
    'New password',
    'Done',
  ];
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const [activeStep, setActiveStep] = useState(0);
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>(readStoredMethod);
  const [identifier, setIdentifier] = useState(
    () => sessionStorage.getItem(FORGOT_PASSWORD_IDENTIFIER_KEY) ?? '',
  );
  const [email, setEmail] = useState(
    () => sessionStorage.getItem(FORGOT_PASSWORD_EMAIL_KEY) ?? '',
  );
  const [code, setCode] = useState('');
  const [secretQuestions, setSecretQuestions] = useState<SecretQuestionPrompt[]>([]);
  const [secretAnswers, setSecretAnswers] = useState<Record<number, string>>({});
  const [secretAnswerFeedback, setSecretAnswerFeedback] = useState<
    Record<number, SecretAnswerFeedback>
  >({});
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [busy, setBusy] = useState(false);

  const steps = useMemo(() => stepLabelsForMethod(recoveryMethod), [recoveryMethod]);
  const passwordInputType = showPasswords ? 'text' : 'password';

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const persistRecoverySession = (
    nextIdentifier: string,
    nextEmail: string,
    method: RecoveryMethod,
  ) => {
    sessionStorage.setItem(FORGOT_PASSWORD_IDENTIFIER_KEY, nextIdentifier);
    sessionStorage.setItem(FORGOT_PASSWORD_EMAIL_KEY, nextEmail);
    sessionStorage.setItem(FORGOT_PASSWORD_METHOD_KEY, method);
  };

  const clearRecoverySession = () => {
    sessionStorage.removeItem(FORGOT_PASSWORD_IDENTIFIER_KEY);
    sessionStorage.removeItem(FORGOT_PASSWORD_EMAIL_KEY);
    sessionStorage.removeItem(FORGOT_PASSWORD_METHOD_KEY);
  };

  const handleRecoveryMethodChange = (
    _event: MouseEvent<HTMLElement>,
    nextMethod: RecoveryMethod | null,
  ) => {
    if (!nextMethod) {
      return;
    }

    setRecoveryMethod(nextMethod);
    sessionStorage.setItem(FORGOT_PASSWORD_METHOD_KEY, nextMethod);
    setCode('');
    setSecretQuestions([]);
    setSecretAnswers({});
    setSecretAnswerFeedback({});
  };

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      showProblem('Enter your email or username.');
      return;
    }

    setBusy(true);
    try {
      if (recoveryMethod === 'secret_questions') {
        const result = await forgotPasswordSecretQuestionsStart(trimmedIdentifier);
        if (!result.ok || !result.email || (result.questions?.length ?? 0) < 3) {
          showProblem(result.message);
          return;
        }

        setEmail(result.email);
        setSecretQuestions(result.questions);
        setSecretAnswers({});
        setSecretAnswerFeedback({});
        persistRecoverySession(trimmedIdentifier, result.email, 'secret_questions');
        showSuccess(result.message);
        setActiveStep(1);
        return;
      }

      const result = await requestPasswordResetEmail(trimmedIdentifier);
      if (!result.email) {
        showProblem(
          'No account was found for that email or username. Check the spelling and try again.',
        );
        return;
      }

      setEmail(result.email);
      persistRecoverySession(trimmedIdentifier, result.email, 'verification_code');
      showSuccess(result.message);
      setActiveStep(1);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedIdentifier =
      identifier.trim() || sessionStorage.getItem(FORGOT_PASSWORD_IDENTIFIER_KEY) || '';

    if (!trimmedIdentifier) {
      showProblem('Enter the email or username tied to your account on step 1.');
      return;
    }

    if (recoveryMethod === 'secret_questions') {
      const answers = buildSecretAnswersPayload(secretQuestions, secretAnswers);
      if (answers.length < SECRET_QUESTIONS_REQUIRED_COUNT) {
        showProblem('Answer at least two secret questions.');
        return;
      }

      setBusy(true);
      try {
        const result = await forgotPasswordSecretQuestionsVerify(trimmedIdentifier, answers);
        if (!result.ok) {
          setSecretAnswerFeedback(applySecretAnswerFeedback(result));
          showProblem(result.message);
          return;
        }
        setSecretAnswerFeedback({});
        showSuccess(result.message);
        setActiveStep(2);
      } catch (error) {
        showProblem(error instanceof Error ? error.message : 'Verification failed.');
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!email) {
      showProblem('Enter the email or username tied to your account on step 1.');
      return;
    }

    const normalizedCode = normalizeVerificationCodeInput(code.trim());
    if (normalizedCode.length !== 6) {
      showProblem('Enter the 6-digit verification code from your email.');
      return;
    }

    setBusy(true);
    try {
      const result = await forgotPasswordVerify(email, normalizedCode);
      if (!result.ok) {
        showProblem(result.message);
        return;
      }
      showSuccess(result.message);
      setActiveStep(2);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Verification failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedIdentifier =
      identifier.trim() || sessionStorage.getItem(FORGOT_PASSWORD_IDENTIFIER_KEY) || '';

    if (!trimmedIdentifier && !email) {
      showProblem('Your reset session expired. Start again from step 1.');
      return;
    }

    if (password.length < 8) {
      showProblem('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      showProblem('Passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      if (recoveryMethod === 'secret_questions') {
        const answers = buildSecretAnswersPayload(secretQuestions, secretAnswers);
        if (answers.length < SECRET_QUESTIONS_REQUIRED_COUNT) {
          showProblem('Your secret question session expired. Start again from step 1.');
          return;
        }

        const result = await forgotPasswordSecretQuestionsComplete(
          trimmedIdentifier,
          answers,
          password,
        );
        if (!result.ok) {
          showProblem(result.message);
          return;
        }
        showSuccess(result.message);
        clearRecoverySession();
        setActiveStep(3);
        return;
      }

      if (!email) {
        showProblem('Your reset session expired. Start again from step 1.');
        return;
      }

      const normalizedCode = normalizeVerificationCodeInput(code.trim());
      if (normalizedCode.length !== 6) {
        showProblem('Enter the same 6-digit verification code from step 2.');
        return;
      }

      const result = await forgotPasswordComplete(email, normalizedCode, password);
      if (!result.ok) {
        showProblem(result.message);
        return;
      }
      showSuccess(result.message);
      clearRecoverySession();
      setActiveStep(3);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Password reset failed.');
    } finally {
      setBusy(false);
    }
  };

  const stepOneSubmitLabel =
    recoveryMethod === 'secret_questions' ? 'Continue' : 'Send verification code';

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Forgot Password
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Reset your password in four steps.
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box component="form" onSubmit={handleRequest} noValidate>
            <Stack spacing={2} sx={centeredContentStackSx}>
              <ToggleButtonGroup
                value={recoveryMethod}
                exclusive
                fullWidth
                onChange={handleRecoveryMethodChange}
                aria-label="Password recovery method"
              >
                <ToggleButton value="verification_code" aria-label="Verification code">
                  Verification Code
                </ToggleButton>
                <ToggleButton value="secret_questions" aria-label="Secret questions">
                  Secret Questions
                </ToggleButton>
              </ToggleButtonGroup>
              <AppTextField
                label="Email or username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                fullWidth
                autoComplete="username"
                required
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={busy}>
                {stepOneSubmitLabel}
              </Button>
              <Button variant="text" fullWidth onClick={() => navigate('/')}>
                Back to Login
              </Button>
            </Stack>
          </Box>
        )}

        {activeStep === 1 && recoveryMethod === 'verification_code' && (
          <Box component="form" onSubmit={handleVerify} noValidate>
            <Stack spacing={2} sx={centeredContentStackSx}>
              {email && (
                <Typography variant="body2" color="text.secondary" align="center">
                  A verification code was sent to <strong>{email}</strong>
                </Typography>
              )}
              {import.meta.env.DEV && (
                <Typography variant="body2" color="text.secondary" align="center">
                  Local dev: open <strong>http://localhost:8025</strong> (Mailpit) and use the code
                  from the <strong>latest</strong> message only.
                </Typography>
              )}
              <AppTextField
                label="Verification code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                fullWidth
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 6 } }}
                required
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={busy}>
                Verify code
              </Button>
              <Button variant="text" fullWidth onClick={() => setActiveStep(0)}>
                Back
              </Button>
            </Stack>
          </Box>
        )}

        {activeStep === 1 && recoveryMethod === 'secret_questions' && (
          <Box component="form" onSubmit={handleVerify} noValidate>
            <Stack spacing={2} sx={{ width: '100%' }}>
              {email && (
                <Typography variant="body2" color="text.secondary" align="center">
                  Answer at least two of your saved secret questions for <strong>{email}</strong>
                </Typography>
              )}
              {secretQuestions.map((question) => (
                <Box
                  key={question.secret_question_id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                    width: '100%',
                  }}
                >
                  <Stack spacing={1.5} sx={{ width: '100%' }}>
                    <Typography variant="body1">{question.question}</Typography>
                    <AppTextField
                      label="Your answer"
                      value={secretAnswers[question.secret_question_id] ?? ''}
                      onChange={(event) => {
                        const questionId = question.secret_question_id;
                        setSecretAnswers((current) => ({
                          ...current,
                          [questionId]: event.target.value,
                        }));
                        setSecretAnswerFeedback((current) => {
                          if (!current[questionId]) {
                            return current;
                          }
                          const next = { ...current };
                          delete next[questionId];
                          return next;
                        });
                      }}
                      fullWidth
                      autoComplete="off"
                      error={secretAnswerFeedback[question.secret_question_id] === 'incorrect'}
                      sx={{
                        width: '100%',
                        ...secretAnswerFieldSx(secretAnswerFeedback[question.secret_question_id]),
                      }}
                    />
                  </Stack>
                </Box>
              ))}
              <Button type="submit" variant="contained" size="large" fullWidth disabled={busy}>
                Verify answers
              </Button>
              <Button variant="text" fullWidth onClick={() => setActiveStep(0)}>
                Back
              </Button>
            </Stack>
          </Box>
        )}

        {activeStep === 2 && (
          <Box component="form" onSubmit={handleReset} noValidate>
            <Stack spacing={2} sx={centeredContentStackSx}>
              <AppTextField
                label="New password"
                type={passwordInputType}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                autoComplete="new-password"
                required
              />
              <AppTextField
                label="Confirm new password"
                type={passwordInputType}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
                autoComplete="new-password"
                required
              />
              <Button
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => setShowPasswords((visible) => !visible)}
              >
                {showPasswords ? 'Hide passwords' : 'Show passwords'}
              </Button>
              <Button type="submit" variant="contained" size="large" fullWidth disabled={busy}>
                Update password
              </Button>
              <Button variant="text" fullWidth onClick={() => setActiveStep(1)}>
                Back
              </Button>
            </Stack>
          </Box>
        )}

        {activeStep === 3 && (
          <Stack spacing={2} sx={centeredContentStackSx}>
            <Typography variant="body1" align="center">
              Your password has been updated. You can sign in with your new password.
            </Typography>
            <Button variant="contained" size="large" fullWidth onClick={() => navigate('/')}>
              Back to Login
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}
