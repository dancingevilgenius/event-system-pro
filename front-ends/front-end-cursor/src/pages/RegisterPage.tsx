import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { type ChangeEvent, type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RegisterForm = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phoneArea: string;
  phonePrefix: string;
  phoneLine: string;
};

const initialForm: RegisterForm = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  country: '',
  phoneArea: '',
  phonePrefix: '',
  phoneLine: '',
};

function digitsOnly(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(initialForm);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Registration API will be wired up later.
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Create your account with contact information.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="First Name"
              value={form.firstName}
              onChange={updateField('firstName')}
              fullWidth
              autoComplete="given-name"
            />
            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={updateField('lastName')}
              fullWidth
              autoComplete="family-name"
            />
            <TextField
              label="Street"
              value={form.street}
              onChange={updateField('street')}
              fullWidth
              autoComplete="street-address"
            />
            <TextField
              label="City"
              value={form.city}
              onChange={updateField('city')}
              fullWidth
              autoComplete="address-level2"
            />
            <TextField
              label="State"
              value={form.state}
              onChange={updateField('state')}
              fullWidth
              autoComplete="address-level1"
            />
            <TextField
              label="Country"
              value={form.country}
              onChange={updateField('country')}
              fullWidth
              autoComplete="country-name"
            />

            <Typography variant="subtitle2" color="text.secondary">
              Phone (US)
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Area"
                value={form.phoneArea}
                onChange={updatePhoneField('phoneArea', 3)}
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 3 } }}
                fullWidth
                autoComplete="tel-area-code"
              />
              <TextField
                label="Prefix"
                value={form.phonePrefix}
                onChange={updatePhoneField('phonePrefix', 3)}
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 3 } }}
                fullWidth
              />
              <TextField
                label="Line"
                value={form.phoneLine}
                onChange={updatePhoneField('phoneLine', 4)}
                slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 4 } }}
                fullWidth
              />
            </Stack>

            <Button type="submit" variant="contained" size="large" fullWidth>
              Create Account
            </Button>
            <Button variant="text" fullWidth onClick={() => navigate('/')}>
              Back to Login
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
