import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { adminUpdateUser, type UserListRow } from '../api/postgrest';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import {
  buildPhoneNumbersJson,
  hasUsablePhone,
  isPhoneCleared,
  phoneDigitsMatch,
  phoneHasNationalDigits,
} from '../utils/phoneNumbers';
import AppPhoneNumberField from './AppPhoneNumberField';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';

type EditUserDialogProps = {
  open: boolean;
  user: UserListRow | null;
  onClose: () => void;
  onSaved: () => void;
};

type FormState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

function formFromUser(user: UserListRow): FormState {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    password: '',
    confirmPassword: '',
  };
}

export default function EditUserDialog({
  open,
  user,
  onClose,
  onSaved,
}: EditUserDialogProps) {
  const [form, setForm] = useState<FormState>(() => (user ? formFromUser(user) : EMPTY_FORM));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const ignoreDialOnlyPhoneChangeRef = useRef(false);

  useEffect(() => {
    if (!open || !user) {
      return;
    }

    setForm(formFromUser(user));
    setError(null);
    setShowPassword(false);
    setPhoneTouched(false);
    // react-international-phone can emit a dial-code-only value on mount; ignore
    // that so a prefilled demo number is not wiped before Save.
    ignoreDialOnlyPhoneChangeRef.current = true;
    const timer = window.setTimeout(() => {
      ignoreDialOnlyPhoneChangeRef.current = false;
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, user]);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError(null);
  };

  const handlePhoneChange = (phone: string) => {
    if (
      ignoreDialOnlyPhoneChangeRef.current &&
      !phoneHasNationalDigits(phone) &&
      hasUsablePhone(user?.phone ?? '')
    ) {
      return;
    }

    setPhoneTouched(true);
    updateField('phone', phone);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!username) {
      setError('Username is required.');
      return;
    }

    if (email && !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }

    const phoneUnchanged = phoneDigitsMatch(form.phone, user.phone);
    const phoneCleared = isPhoneCleared(form.phone);
    const phoneUsable = hasUsablePhone(form.phone);

    // Incomplete edits only — unchanged / untouched demo 555 numbers pass through.
    if (phoneTouched && !phoneCleared && !phoneUsable && !phoneUnchanged) {
      setError('Enter a complete phone number or clear it.');
      return;
    }

    if (password || confirmPassword) {
      if (password.length < 8) {
        setError('New password must be at least 8 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Password and confirmation do not match.');
        return;
      }
    }

    let phoneNumbersJson: unknown[] = user.phoneNumbersJson;
    if (phoneTouched && phoneCleared) {
      phoneNumbersJson = [];
    } else if (phoneUnchanged && user.phoneNumbersJson.length > 0) {
      phoneNumbersJson = user.phoneNumbersJson;
    } else if (phoneUsable) {
      phoneNumbersJson = buildPhoneNumbersJson(form.phone);
    } else if (!phoneTouched) {
      phoneNumbersJson = user.phoneNumbersJson;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await adminUpdateUser({
        userId: user.userId,
        firstName,
        lastName,
        username,
        email,
        phoneNumbersJson,
        newPassword: password || undefined,
      });

      if (!result.ok) {
        setError(result.message || 'Unable to update user.');
        return;
      }

      onSaved();
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update user.');
    } finally {
      setSaving(false);
    }
  };

  const passwordInputType = showPassword ? 'text' : 'password';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 5, position: 'relative' }}>
        Edit User
        <IconButton
          aria-label="Close edit user dialog"
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={(event) => void handleSubmit(event)} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ maxWidth: CONTENT_MAX_WIDTH, mx: 'auto', width: '100%' }}>
            {error && (
              <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <AppTextField
              label="First Name"
              value={form.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
              fullWidth
              autoComplete="off"
            />
            <AppTextField
              label="Last Name"
              value={form.lastName}
              onChange={(event) => updateField('lastName', event.target.value)}
              fullWidth
              autoComplete="off"
            />
            <AppTextField
              label="Username"
              value={form.username}
              onChange={(event) => updateField('username', event.target.value)}
              fullWidth
              required
              autoComplete="off"
            />
            <AppTextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              fullWidth
              autoComplete="off"
            />
            {user && (
              <AppPhoneNumberField
                key={`edit-user-phone-${user.userId}`}
                label="Phone"
                value={form.phone}
                onChange={handlePhoneChange}
                autoComplete="tel"
              />
            )}
            <AppTextField
              label="Password"
              type={passwordInputType}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              fullWidth
              autoComplete="new-password"
              helperText="Leave blank to keep the current password."
            />
            <AppTextField
              label="Confirm Password"
              type={passwordInputType}
              value={form.confirmPassword}
              onChange={(event) => updateField('confirmPassword', event.target.value)}
              fullWidth
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="text"
              onClick={() => setShowPassword((current) => !current)}
              sx={{ alignSelf: 'flex-start' }}
            >
              {showPassword ? 'Hide passwords' : 'Show passwords'}
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3, pt: 0 }}>
          <Stack spacing={1} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
            <Button type="submit" variant="contained" fullWidth disabled={saving || !user}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button variant="outlined" onClick={onClose} fullWidth disabled={saving}>
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
