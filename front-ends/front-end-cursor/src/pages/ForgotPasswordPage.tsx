import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordResetEmail } from '../api/mailer';
import {
  forgotPasswordComplete,
  forgotPasswordVerify,
} from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';

const STEPS = [
  'Find your account',
  'Verify code',
  'New password',
  'Done',
];

const FORGOT_PASSWORD_EMAIL_KEY = 'forgotPasswordEmail';

function normalizeVerificationCodeInput(code: string): string {
  const digits = code.replace(/\D/g, '');
  if (digits.length === 0 || digits.length > 6) {
    return digits;
  }

  return digits.padStart(6, '0');
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { clearMessages, showProblem, showSuccess } = useMessages();
  const [activeStep, setActiveStep] = useState(0);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState(
    () => sessionStorage.getItem(FORGOT_PASSWORD_EMAIL_KEY) ?? '',
  );
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await requestPasswordResetEmail(identifier.trim());
      if (!result.email) {
        showProblem(
          'No account was found for that email or username. Check the spelling and try again.',
        );
        return;
      }

      setEmail(result.email);
      sessionStorage.setItem(FORGOT_PASSWORD_EMAIL_KEY, result.email);
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
    if (!email) {
      showProblem('Your reset session expired. Start again from step 1.');
      return;
    }

    const normalizedCode = normalizeVerificationCodeInput(code.trim());
    if (normalizedCode.length !== 6) {
      showProblem('Enter the same 6-digit verification code from step 2.');
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
      const result = await forgotPasswordComplete(email, normalizedCode, password);
      if (!result.ok) {
        showProblem(result.message);
        return;
      }
      showSuccess(result.message);
      sessionStorage.removeItem(FORGOT_PASSWORD_EMAIL_KEY);
      setActiveStep(3);
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Password reset failed.');
    } finally {
      setBusy(false);
    }
  };

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
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box component="form" onSubmit={handleRequest} noValidate>
            <Stack spacing={2} sx={centeredContentStackSx}>
              <AppTextField
                label="Email or username"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                fullWidth
                autoComplete="username"
                required
              />
              <Button type="submit" variant="contained" size="large" fullWidth disabled={busy}>
                Send verification code
              </Button>
              <Button variant="text" fullWidth onClick={() => navigate('/')}>
                Back to Login
              </Button>
            </Stack>
          </Box>
        )}

        {activeStep === 1 && (
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

        {activeStep === 2 && (
          <Box component="form" onSubmit={handleReset} noValidate>
            <Stack spacing={2} sx={centeredContentStackSx}>
              <AppTextField
                label="New password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                autoComplete="new-password"
                required
              />
              <AppTextField
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
                autoComplete="new-password"
                required
              />
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
