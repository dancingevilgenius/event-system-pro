import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  searchUsersByNameOrEmail,
  updateEventGroupDirectors,
  type DirectorSearchUser,
  type EventGroupDirector,
} from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import AppTextField from './AppTextField';
import CloseIcon from './CloseIcon';

type EditEventGroupDirectorsDialogProps = {
  open: boolean;
  eventGroupCode: string;
  eventGroupName: string;
  initialDirectors: EventGroupDirector[];
  onClose: () => void;
  onSaved: () => void;
};

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

export default function EditEventGroupDirectorsDialog({
  open,
  eventGroupCode,
  eventGroupName,
  initialDirectors,
  onClose,
  onSaved,
}: EditEventGroupDirectorsDialogProps) {
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DirectorSearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [directors, setDirectors] = useState<EventGroupDirector[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSearchQuery('');
    setSearchResults([]);
    setSearching(false);
    setSearchError(null);
    setDirectors(initialDirectors.map((director) => ({ ...director })));
    setSaving(false);
    setSaveError(null);
  }, [open, initialDirectors]);

  const directorUsernames = new Set(directors.map((director) => director.username));

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const results = await searchUsersByNameOrEmail(query);
      setSearchResults(results);
    } catch (searchFailure) {
      setSearchResults([]);
      setSearchError(
        searchFailure instanceof Error ? searchFailure.message : 'Unable to search users.',
      );
    } finally {
      setSearching(false);
    }
  };

  const handleAddDirector = (user: DirectorSearchUser) => {
    if (directorUsernames.has(user.username)) {
      return;
    }

    setDirectors((current) => [
      ...current,
      {
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    ]);
    setSaveError(null);
  };

  const handleRemoveDirector = (username: string) => {
    setDirectors((current) => current.filter((director) => director.username !== username));
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      await updateEventGroupDirectors(eventGroupCode, directors);
      onSaved();
      onClose();
    } catch (saveFailure) {
      setSaveError(
        saveFailure instanceof Error ? saveFailure.message : 'Unable to save directors.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 5, position: 'relative' }}>
        Edit Directors — {eventGroupName}
        <IconButton
          aria-label="Close edit directors dialog"
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Search users</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <AppTextField
                label="First name, last name, or email"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void handleSearch();
                  }
                }}
                fullWidth
                autoComplete="off"
              />
              <Button
                variant="outlined"
                onClick={() => void handleSearch()}
                disabled={searching || searchQuery.trim() === ''}
                sx={{ minWidth: 100, alignSelf: { xs: 'stretch', sm: 'center' } }}
              >
                {searching ? 'Searching…' : 'Search'}
              </Button>
            </Stack>
            {searchError && (
              <Typography variant="body2" color="error">
                {searchError}
              </Typography>
            )}
          </Stack>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Search results
            </Typography>
            {searching ? (
              <Stack sx={{ py: 3, alignItems: 'center' }}>
                <CircularProgress size={28} />
              </Stack>
            ) : (
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" aria-label="User search results">
                  <TableHead>
                    <TableRow>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      {isAdmin && <TableCell align="center">Add</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isAdmin ? 4 : 3} align="center">
                          {searchQuery.trim() === '' ? 'Enter a search term.' : 'No users found.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      searchResults.map((user) => {
                        const alreadyAdded = directorUsernames.has(user.username);

                        return (
                          <TableRow key={user.username} hover>
                            <TableCell>{displayValue(user.firstname)}</TableCell>
                            <TableCell>{displayValue(user.lastname)}</TableCell>
                            <TableCell>{displayValue(user.email)}</TableCell>
                            {isAdmin && (
                              <TableCell align="center">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  disabled={alreadyAdded}
                                  onClick={() => handleAddDirector(user)}
                                >
                                  {alreadyAdded ? 'Added' : 'Add'}
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Directors
            </Typography>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" aria-label="Event group directors">
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {directors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No directors assigned.
                      </TableCell>
                    </TableRow>
                  ) : (
                    directors.map((director) => (
                      <TableRow key={director.username} hover>
                        <TableCell>{displayValue(director.firstname)}</TableCell>
                        <TableCell>{displayValue(director.lastname)}</TableCell>
                        <TableCell>{displayValue(director.email)}</TableCell>
                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            onClick={() => handleRemoveDirector(director.username)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {saveError && (
            <Typography variant="body2" color="error">
              {saveError}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => void handleSave()} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
