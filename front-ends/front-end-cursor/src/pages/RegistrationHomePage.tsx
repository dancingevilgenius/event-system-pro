import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { type FormEvent, useState } from 'react';
import { searchRegistrationUsers, type RegistrationSearchUser } from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import PageHeader from '../components/PageHeader';
import RegistrationNewUserForm from '../components/RegistrationNewUserForm';
import { useLayoutTier } from '../hooks/useLayoutTier';
import {
  readRegistrationSelectedUser,
  writeRegistrationSelectedUser,
  type RegistrationSelectedUser,
} from '../lib/registrationSelection';

type RegistrationTab = 'new' | 'registered';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function SelectUserButton({
  user,
  selected,
  onSelect,
}: {
  user: RegistrationSearchUser;
  selected: boolean;
  onSelect: (user: RegistrationSearchUser) => void;
}) {
  return (
    <Button
      type="button"
      variant={selected ? 'contained' : 'outlined'}
      size="small"
      onClick={() => onSelect(user)}
      aria-pressed={selected}
      aria-label={`Select ${user.firstName} ${user.lastName}`.trim()}
      sx={{ flexShrink: 0, minWidth: { xs: 72, md: 88 } }}
    >
      Select
    </Button>
  );
}

export default function RegistrationHomePage() {
  const { containerMaxWidth, showXsLayout } = useLayoutTier();
  const [tab, setTab] = useState<RegistrationTab>('new');
  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [lastNameQuery, setLastNameQuery] = useState('');
  const [results, setResults] = useState<RegistrationSearchUser[]>([]);
  const [searched, setSearched] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<RegistrationSelectedUser | null>(() =>
    readRegistrationSelectedUser(),
  );

  const handleSearch = async () => {
    const firstName = firstNameQuery.trim();
    const lastName = lastNameQuery.trim();

    if (!firstName && !lastName) {
      setResults([]);
      setSearched(false);
      setTruncated(false);
      setSearchError('Enter a first name and/or last name to search.');
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const result = await searchRegistrationUsers(firstName, lastName);
      setResults(result.users);
      setTruncated(result.truncated);
      setSearched(true);
    } catch (error) {
      setResults([]);
      setTruncated(false);
      setSearched(true);
      setSearchError(error instanceof Error ? error.message : 'Unable to search users.');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSearch();
  };

  const handleSelect = (user: RegistrationSearchUser) => {
    if (!user.username) {
      return;
    }

    const next = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    writeRegistrationSelectedUser(next);
    setSelectedUser(next);
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Registration" backTo="/home" backLabel="Back to Home" />

        <Tabs
          key={showXsLayout ? 'xs' : 'wide'}
          value={tab}
          onChange={(_event, value: RegistrationTab) => setTab(value)}
          aria-label="Registration"
          variant="fullWidth"
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              minWidth: 0,
              px: { xs: 1, md: 2 },
              fontSize: { xs: '0.8125rem', md: '0.875rem' },
            },
          }}
        >
          <Tab label="New User" value="new" id="registration-tab-new" aria-controls="registration-panel-new" />
          <Tab
            label="Registered User"
            value="registered"
            id="registration-tab-registered"
            aria-controls="registration-panel-registered"
          />
        </Tabs>

        <div
          role="tabpanel"
          id="registration-panel-new"
          aria-labelledby="registration-tab-new"
          hidden={tab !== 'new'}
        >
          {tab === 'new' ? <RegistrationNewUserForm /> : null}
        </div>

        <div
          role="tabpanel"
          id="registration-panel-registered"
          aria-labelledby="registration-tab-registered"
          hidden={tab !== 'registered'}
        >
          <form noValidate onSubmit={handleSubmit}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <AppTextField
                label="First name"
                value={firstNameQuery}
                onChange={(event) => setFirstNameQuery(event.target.value)}
                fullWidth
                autoComplete="off"
                name="registration-first-name"
              />
              <AppTextField
                label="Last name"
                value={lastNameQuery}
                onChange={(event) => setLastNameQuery(event.target.value)}
                fullWidth
                autoComplete="off"
                name="registration-last-name"
              />
              <Button
                type="submit"
                variant="contained"
                disabled={searching}
                sx={{ flexShrink: 0, height: 56, minWidth: { xs: 88, md: 120 } }}
              >
                {searching ? 'Searching…' : 'Search'}
              </Button>
            </Stack>
            {searchError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {searchError}
              </Typography>
            )}
          </form>

          {showXsLayout ? (
            <Stack spacing={1} sx={{ mt: 3 }} aria-label="Registration search results">
              {searching ? (
                <Stack direction="row" spacing={1} sx={{ py: 2, alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Searching…
                  </Typography>
                </Stack>
              ) : results.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  {searched ? 'No users found.' : 'Search by first name, last name, or both.'}
                </Typography>
              ) : (
                results.map((user) => {
                  const selected = selectedUser?.username === user.username;

                  return (
                    <Stack
                      key={user.username}
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1,
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: selected ? 'action.selected' : 'transparent',
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2">
                          {displayValue(user.firstName)} {displayValue(user.lastName)}
                        </Typography>
                        <Typography variant="body2">{displayValue(user.state)}</Typography>
                        <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                          {displayValue(user.email)}
                        </Typography>
                      </Box>
                      <SelectUserButton user={user} selected={selected} onSelect={handleSelect} />
                    </Stack>
                  );
                })
              )}
            </Stack>
          ) : (
            <TableContainer sx={{ mt: 3, overflowX: 'auto' }}>
              <Table size="small" aria-label="Registration search results">
                <TableHead>
                  <TableRow>
                    <TableCell>First name</TableCell>
                    <TableCell>Last name</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell sx={{ width: '6.5rem' }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searching ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Stack direction="row" spacing={1} sx={{ py: 2, alignItems: 'center', justifyContent: 'center' }}>
                          <CircularProgress size={18} />
                          <Typography variant="body2" color="text.secondary">
                            Searching…
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                          {searched ? 'No users found.' : 'Search by first name, last name, or both.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((user) => {
                      const selected = selectedUser?.username === user.username;

                      return (
                        <TableRow key={user.username} hover selected={selected}>
                          <TableCell>{displayValue(user.firstName)}</TableCell>
                          <TableCell>{displayValue(user.lastName)}</TableCell>
                          <TableCell>{displayValue(user.state)}</TableCell>
                          <TableCell sx={{ overflowWrap: 'anywhere' }}>{displayValue(user.email)}</TableCell>
                          <TableCell align="right">
                            <SelectUserButton user={user} selected={selected} onSelect={handleSelect} />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {truncated && !searching && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Showing the first 100 matches. Narrow the name to see fewer people.
            </Typography>
          )}
        </div>
      </Paper>
    </Container>
  );
}
