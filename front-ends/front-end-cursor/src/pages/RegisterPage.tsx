import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { type ChangeEvent, type ClipboardEvent, type FormEvent, type KeyboardEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  hashPasswordRecoveryAnswers,
  registerUser,
  fetchCountriesStaticList,
  fetchSecretQuestions,
  fetchUsStatesStaticList,
  type PasswordRecoveryJson,
  type StaticListEntry,
} from '../api/postgrest';
import PasswordRecoveryDialog, {
  type PasswordRecoveryAnswer,
} from '../components/PasswordRecoveryDialog';
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';
import { pickRandomQuestionIds } from '../utils/secretQuestions';

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  country: string;
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
  city: '',
  state: '',
  country: '',
  phoneArea: '',
  phonePrefix: '',
  phoneLine: '',
  passwordRecoveryJson: null,
};

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

function buildAddressesJson(city: string, state: string, country: string) {
  if (!city.trim() && !state.trim() && !country.trim()) {
    return [];
  }

  return [
    {
      label: 'home',
      line1: null,
      line2: null,
      city: city.trim() || null,
      state_or_province: state.trim() || null,
      postal_code: null,
      country_code: country.trim() || null,
    },
  ];
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assignedQuestionIds, setAssignedQuestionIds] = useState<number[]>([]);
  const [countries, setCountries] = useState<StaticListEntry[]>([]);
  const [states, setStates] = useState<StaticListEntry[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchCountriesStaticList(), fetchUsStatesStaticList()])
      .then(([countryItems, stateItems]) => {
        if (cancelled) {
          return;
        }
        setCountries(countryItems);
        setStates(stateItems);
      })
      .catch((error) => {
        if (!cancelled) {
          showProblem(
            error instanceof Error ? error.message : 'Unable to load countries or states.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingCountries(false);
          setLoadingStates(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchSecretQuestions()
      .then((items) => {
        if (cancelled || items.length < 3) {
          return;
        }

        setAssignedQuestionIds(pickRandomQuestionIds(items, 3));
      })
      .catch(() => {
        // Dialog surfaces load errors when opened.
      });

    return () => {
      cancelled = true;
    };
  }, []);

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

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      showProblem('Username, email, and password are required.');
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

    if (!form.passwordRecoveryJson) {
      showProblem('Set up three password recovery secret questions before creating your account.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        nameJson: buildNameJson(form.firstName, form.lastName),
        phoneNumbersJson: buildPhoneNumbersJson(
          form.phoneArea,
          form.phonePrefix,
          form.phoneLine,
        ),
        addressesJson: buildAddressesJson(form.city, form.state, form.country),
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

  const savedQuestionIds =
    form.passwordRecoveryJson?.questions.map((question) => question.secret_question_id) ?? [];

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Create your account with contact information.
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
            <AppTextField
              label="City"
              value={form.city}
              onChange={updateField('city')}
              fullWidth
              autoComplete="address-level2"
            />
            <AppTextField
              select
              label="State"
              value={form.state}
              onChange={updateField('state')}
              fullWidth
              disabled={loadingStates}
              autoComplete="address-level1"
            >
              <MenuItem value="">
                <em>Select a state</em>
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.key} value={state.key}>
                  {state.label}
                </MenuItem>
              ))}
            </AppTextField>
            <AppTextField
              select
              label="Country"
              value={form.country}
              onChange={updateField('country')}
              fullWidth
              disabled={loadingCountries}
              autoComplete="country-name"
            >
              <MenuItem value="">
                <em>Select a country</em>
              </MenuItem>
              <MenuItem value="UNL">Unlisted</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.key} value={country.key}>
                  {country.label}
                </MenuItem>
              ))}
            </AppTextField>

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
              disabled={assignedQuestionIds.length < 3 && savedQuestionIds.length < 3}
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
                disabled={submitting}
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
        assignedQuestionIds={assignedQuestionIds}
        onClose={() => setRecoveryOpen(false)}
        onSave={handleSavePasswordRecovery}
      />
    </Container>
  );
}
