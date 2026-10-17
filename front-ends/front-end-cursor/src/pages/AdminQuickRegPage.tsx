import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { type FormEvent, useEffect, useState } from 'react';
import { searchQuickRegUsers, type QuickRegUser } from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { useMessages } from '../hooks/useMessages';
import { formatReadableDateTime } from '../utils/auditTimestamps';
import { trimSavedText } from '../utils/trimSavedText';

export default function AdminQuickRegPage() {
  const { containerMaxWidth } = useLayoutTier();
  const { showProblem, showWarning } = useMessages();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rows, setRows] = useState<QuickRegUser[]>([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<QuickRegUser | null>(null);

  useEffect(() => {
    if (selected === null) {
      return;
    }

    const timer = window.setTimeout(() => setSelected(null), 10_000);
    return () => window.clearTimeout(timer);
  }, [selected]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const first = trimSavedText(firstName);
    const last = trimSavedText(lastName);
    if (first === '' && last === '') {
      showProblem('Enter a first name and/or last name to search.');
      return;
    }

    setBusy(true);
    try {
      const result = await searchQuickRegUsers(first, last);
      setRows(result.users);
      setSearched(true);
      if (result.truncated) {
        showWarning('Showing the first 100 matches.');
      }
    } catch (error) {
      setRows([]);
      setSearched(true);
      showProblem(error instanceof Error ? error.message : 'Unable to search Quick Registration accounts.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Quick Reg" backTo="/adminhome" backLabel="Back to Admin" />

        <Box component="form" onSubmit={(event) => void handleSearch(event)} noValidate>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ alignItems: { md: 'center' } }}
          >
            <AppTextField
              label="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              fullWidth
              autoComplete="off"
            />
            <AppTextField
              label="Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              fullWidth
              autoComplete="off"
            />
            <Button
              type="submit"
              variant="contained"
              disabled={busy}
              sx={{ minWidth: { md: 120 }, alignSelf: { xs: 'stretch', md: 'center' } }}
            >
              Search
            </Button>
          </Stack>
        </Box>

        {searched ? (
          <TableContainer sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                  <TableCell sx={{ width: 56 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary">
                        No Quick Registration accounts found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.username}>
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>
                        <IconButton
                          type="button"
                          size="small"
                          aria-label={`Show password for ${row.firstName} ${row.lastName}`}
                          onClick={() => setSelected(row)}
                        >
                          <QuestionMarkIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Paper>

      <Dialog
        open={selected !== null}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="quickreg-password-title"
      >
        <DialogContent>
          <DialogContentText id="quickreg-password-title" sx={{ textAlign: 'center' }}>
            {selected?.password}
          </DialogContentText>
          <Stack spacing={0.5} sx={{ mt: 3 }}>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 700, mr: 1 }}>
                Created by
              </Box>
              {selected?.createdByName}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 700, mr: 1 }}>
                Username
              </Box>
              {selected?.createdByUsername}
            </Typography>
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 700, mr: 1 }}>
                Created
              </Box>
              {selected?.createdDate ? formatReadableDateTime(selected.createdDate) : ''}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', px: 3, pb: 3 }}>
          <Button type="button" variant="contained" onClick={() => setSelected(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
