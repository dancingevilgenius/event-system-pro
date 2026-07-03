import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  hashPasswordRecoveryAnswers,
  registerUser,
  type PasswordRecoveryJson,
} from '../api/postgrest';
import PasswordRecoveryDialog, {
  type PasswordRecoveryAnswer,
} from '../components/PasswordRecoveryDialog';
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneArea: string;
  phonePrefix: string;
  phoneLine: string;
  passwordRecoveryJson: PasswordRecoveryJson | null;
};

const initialForm: RegisterForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phoneArea: '',
  phonePrefix: '',
  phoneLine: '',
  passwordRecoveryJson: null,
};

const RECOVERY_HELP_MESSAGE =
  'For password recovery help, provide at least two of: email, phone number, and secret question answers.';

const SAVED_QUESTION_IDS_EMPTY: number[] = [];

function digitsOnly(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

function isPhoneControlKey(key: string): boolean {
  return (
    key === 'Backspace' ||
    key === 'Delete' ||
    key === 'Tab' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'Home' ||
    key === 'End'
  );
}

function phoneInputSlotProps(maxLength: number) {
  return {
    htmlInput: {
      inputMode: 'numeric' as const,
      maxLength,
      pattern: '[0-9]*',
      onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.ctrlKey || event.metaKey || isPhoneControlKey(event.key)) {
          return;
        }

        if (!/^\d$/.test(event.key)) {
          event.preventDefault();
        }
      },
    },
  };
}

function buildNameJson(firstName: string, lastName: string) {
  const first = firstName.trim();
  const last = lastName.trim();
  const display = [first, last].filter(Boolean).join(' ');

  return {
    prefix: null,
    first: first || null,
    middle: null,
    last: last || null,
    suffix: null,
    display: display || null,
  };
}

function buildPhoneNumbersJson(phoneArea: string, phonePrefix: string, phoneLine: string) {
  const number = `${phoneArea}${phonePrefix}${phoneLine}`;
  if (number.length !== 10) {
    return [];
  }

  return [
    {
      type: 'mobile',
      country_code: '1',
      number,
      primary: true,
    },
  ];
}

function hasEmail(email: string): boolean {
  return email.trim().length > 0;
}

function hasCompletePhone(phoneArea: string, phonePrefix: string, phoneLine: string): boolean {
  return `${phoneArea}${phonePrefix}${phoneLine}`.length === 10;
}

function hasSecretQuestions(passwordRecoveryJson: PasswordRecoveryJson | null): boolean {
  return (
    passwordRecoveryJson?.method === 'secret_questions' &&
    passwordRecoveryJson.questions.length === 3
  );
}

function countRecoveryMethods(form: RegisterForm): number {
  let count = 0;

  if (hasEmail(form.email)) {
    count += 1;
  }
  if (hasCompletePhone(form.phoneArea, form.phonePrefix, form.phoneLine)) {
    count += 1;
  }
  if (hasSecretQuestions(form.passwordRecoveryJson)) {
    count += 1;
  }

  return count;
}

function isRegisterFormComplete(form: RegisterForm): boolean {
  if (!form.username.trim() || !form.firstName.trim() || !form.lastName.trim()) {
    return false;
  }

  if (form.password.length < 8 || form.password !== form.confirmPassword) {
    return false;
  }

  return countRecoveryMethods(form) >= 2;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canCreateAccount = useMemo(() => isRegisterFormComplete(form), [form]);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const updateField =
    (field: keyof RegisterForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };

  const updatePhoneField =
    (field: 'phoneArea' | 'phonePrefix' | 'phoneLine', maxLength: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: digitsOnly(event.target.value, maxLength),
      }));
    };

  const pastePhoneField =
    (field: 'phoneArea' | 'phonePrefix' | 'phoneLine', maxLength: number) =>
    (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      setForm((current) => ({
        ...current,
        [field]: digitsOnly(event.clipboardData.getData('text'), maxLength),
      }));
    };

  const handleSavePasswordRecovery = async (answers: PasswordRecoveryAnswer[]) => {
    if (
      answers.length !== 3 ||
      answers.some((answer) => answer.answer.trim().length === 0)
    ) {
      throw new Error('Each answer must contain non-whitespace characters.');
    }

    const result = await hashPasswordRecoveryAnswers(
      answers.map((answer) => ({
        secret_question_id: answer.secretQuestionId,
        answer: answer.answer,
      })),
    );

    if (!result.ok || !result.password_recovery_json) {
      throw new Error(result.message);
    }

    setForm((current) => ({
      ...current,
      passwordRecoveryJson: result.password_recovery_json ?? null,
    }));
    setRecoveryOpen(false);
    showSuccess(result.message);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.username.trim()) {
      showProblem('Username is required.');
      return;
    }

    if (!form.firstName.trim() || !form.lastName.trim()) {
      showProblem('First name and last name are required.');
      return;
    }

    if (form.password.length < 8) {
      showProblem('Password must be at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      showProblem('Passwords do not match.');
      return;
    }

    if (countRecoveryMethods(form) < 2) {
      showProblem(RECOVERY_HELP_MESSAGE);
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerUser({
        username: form.username.trim(),
        email: hasEmail(form.email) ? form.email.trim() : undefined,
        password: form.password,
        nameJson: buildNameJson(form.firstName, form.lastName),
        phoneNumbersJson: buildPhoneNumbersJson(
          form.phoneArea,
          form.phonePrefix,
          form.phoneLine,
        ),
        addressesJson: [],
        passwordRecoveryJson: form.passwordRecoveryJson,
      });

      if (!result.ok) {
        showProblem(result.message);
        return;
      }

      showSuccess(result.message);
      navigate('/');
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const savedQuestionIds = useMemo(
    () =>
      form.passwordRecoveryJson?.questions.map(
        (question) => question.secret_question_id,
      ) ?? SAVED_QUESTION_IDS_EMPTY,
    [form.passwordRecoveryJson],
  );

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Provide at least two recovery options: email, phone, or secret questions.
        </Typography>

        <Box component="form" onSubmit={(event) => void handleSubmit(event)} noValidate>
          <Stack spacing={2} sx={centeredContentStackSx}>
            <AppTextField
              label="Username"
              value={form.username}
              onChange={updateField('username')}
              fullWidth
              required
              autoComplete="username"
            />
            <AppTextField
              label="Email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              fullWidth
              autoComplete="email"
            />
            <AppTextField
              label="Password"
              type="password"
              value={form.password}
              onChange={updateField('password')}
              fullWidth
              required
              autoComplete="new-password"
            />
            <AppTextField
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={updateField('confirmPassword')}
              fullWidth
              required
              autoComplete="new-password"
            />
            <AppTextField
              label="First Name"
              value={form.firstName}
              onChange={updateField('firstName')}
              fullWidth
              required
              autoComplete="given-name"
            />
            <AppTextField
              label="Last Name"
              value={form.lastName}
              onChange={updateField('lastName')}
              fullWidth
              required
              autoComplete="family-name"
            />

            <Typography variant="subtitle2" color="text.secondary">
              Phone (US)
            </Typography>
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
              <AppTextField
                placeholder="Area"
                value={form.phoneArea}
                onChange={updatePhoneField('phoneArea', 3)}
                onPaste={pastePhoneField('phoneArea', 3)}
                slotProps={phoneInputSlotProps(3)}
                fullWidth
                autoComplete="tel-area-code"
              />
              <AppTextField
                placeholder="Middle part"
                value={form.phonePrefix}
                onChange={updatePhoneField('phonePrefix', 3)}
                onPaste={pastePhoneField('phonePrefix', 3)}
                slotProps={phoneInputSlotProps(3)}
                fullWidth
              />
              <AppTextField
                placeholder="Last part"
                value={form.phoneLine}
                onChange={updatePhoneField('phoneLine', 4)}
                onPaste={pastePhoneField('phoneLine', 4)}
                slotProps={phoneInputSlotProps(4)}
                fullWidth
              />
            </Stack>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => setRecoveryOpen(true)}
            >
              Password Recovery
            </Button>
            {savedQuestionIds.length === 3 && (
              <Typography variant="body2" color="text.secondary" align="center">
                3 secret questions saved for password recovery.
              </Typography>
            )}

            <Stack spacing={2} sx={centeredContentStackSx}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting || !canCreateAccount}
              >
                {submitting ? 'Creating Account…' : 'Create Account'}
              </Button>
              <Button variant="text" fullWidth onClick={() => navigate('/')}>
                Back to Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <PasswordRecoveryDialog
        open={recoveryOpen}
        initialQuestionIds={savedQuestionIds}
        onClose={() => setRecoveryOpen(false)}
        onSave={handleSavePasswordRecovery}
      />
    </Container>
  );
}
