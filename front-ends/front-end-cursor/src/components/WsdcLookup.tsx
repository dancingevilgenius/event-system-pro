import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  autocompleteWsdcDancers,
  findWsdcDancerById,
  findWsdcDancerByQuery,
  formatWsdcLevelLine,
  isWsdcDancerProfile,
  isWsdcNameList,
  normalizeWsdcId,
  type WsdcDancerProfile,
  type WsdcNameMatch,
  type WsdcSuggestion,
} from '../api/wsdcRegistry';
import AppTextField from './AppTextField';

export type WsdcLookupProps = {
  /** Prefill search box (e.g. first + last name). */
  initialQuery?: string;
  /** Load this WSDC ID on mount (and when it changes). */
  initialWsdcId?: string | null;
  /** Sync browser URL ?wsdc= for direct links / duplicate-name disambiguation. */
  enableDirectLink?: boolean;
  /** Show Confirm button when a dancer profile is loaded. */
  onConfirmWsdcId?: (wsdcId: string, profile: WsdcDancerProfile) => void | Promise<void>;
  confirmLabel?: string;
  /** Called whenever a profile is selected (without requiring Confirm). */
  onProfileChange?: (profile: WsdcDancerProfile | null) => void;
  confirming?: boolean;
};

function readWsdcFromUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return normalizeWsdcId(new URLSearchParams(window.location.search).get('wsdc'));
}

function pushWsdcUrl(wsdcId: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  if (wsdcId) {
    url.searchParams.set('wsdc', wsdcId);
  } else {
    url.searchParams.delete('wsdc');
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.pushState({ wsdc: wsdcId }, '', next);
  }
}

export default function WsdcLookup({
  initialQuery = '',
  initialWsdcId = null,
  enableDirectLink = false,
  onConfirmWsdcId,
  confirmLabel = 'Save WSDC #',
  onProfileChange,
  confirming = false,
}: WsdcLookupProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<WsdcSuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [nameMatches, setNameMatches] = useState<WsdcNameMatch[]>([]);
  const [profile, setProfile] = useState<WsdcDancerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const acTimer = useRef<number | null>(null);
  const suppressAc = useRef(false);
  const findSeq = useRef(0);
  const mountedInitial = useRef(false);
  const lastLoadedInitialId = useRef<string>('');

  const applyProfile = useCallback(
    (next: WsdcDancerProfile | null, syncUrl: boolean) => {
      setProfile(next);
      onProfileChange?.(next);
      if (syncUrl && enableDirectLink) {
        pushWsdcUrl(next ? normalizeWsdcId(next.dancer_wsdcid) : null);
      }
    },
    [enableDirectLink, onProfileChange],
  );

  const loadById = useCallback(
    async (wsdcId: string, syncUrl: boolean) => {
      const num = normalizeWsdcId(wsdcId);
      if (!num) {
        return;
      }

      const seq = ++findSeq.current;
      setLoading(true);
      setError('');
      setNameMatches([]);
      setSuggestionsOpen(false);

      try {
        const result = await findWsdcDancerById(num);
        if (seq !== findSeq.current) {
          return;
        }

        if (isWsdcDancerProfile(result)) {
          suppressAc.current = true;
          setQuery(`${result.dancer_first} ${result.dancer_last}`.trim());
          applyProfile(result, syncUrl);
        } else if (isWsdcNameList(result)) {
          applyProfile(null, false);
          setNameMatches(result.names);
          setError('');
        } else {
          applyProfile(null, false);
          setError('No dancer found for that WSDC #.');
        }
      } catch (loadError) {
        if (seq !== findSeq.current) {
          return;
        }
        applyProfile(null, false);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not reach the WSDC registry.',
        );
      } finally {
        if (seq === findSeq.current) {
          setLoading(false);
        }
      }
    },
    [applyProfile],
  );

  const loadByQuery = useCallback(
    async (rawQuery: string) => {
      const q = rawQuery.trim();
      if (!q) {
        return;
      }

      const asId = normalizeWsdcId(q);
      if (asId && asId === q.replace(/\s/g, '')) {
        await loadById(asId, true);
        return;
      }

      const seq = ++findSeq.current;
      setLoading(true);
      setError('');
      setNameMatches([]);
      setSuggestionsOpen(false);

      try {
        const result = await findWsdcDancerByQuery(q);
        if (seq !== findSeq.current) {
          return;
        }

        if (isWsdcNameList(result) && result.names.length > 0) {
          applyProfile(null, false);
          setNameMatches(result.names);
          if (result.names.length === 1) {
            await loadById(String(result.names[0].wscid), true);
          }
        } else if (isWsdcDancerProfile(result)) {
          suppressAc.current = true;
          setQuery(`${result.dancer_first} ${result.dancer_last}`.trim());
          applyProfile(result, true);
        } else {
          applyProfile(null, false);
          setError('No dancers matched that search.');
        }
      } catch (loadError) {
        if (seq !== findSeq.current) {
          return;
        }
        applyProfile(null, false);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not reach the WSDC registry.',
        );
      } finally {
        if (seq === findSeq.current) {
          setLoading(false);
        }
      }
    },
    [applyProfile, loadById],
  );

  useEffect(() => {
    if (mountedInitial.current) {
      return;
    }
    mountedInitial.current = true;

    const fromUrl = enableDirectLink ? readWsdcFromUrl() : '';
    const seedId = fromUrl || normalizeWsdcId(initialWsdcId);
    if (seedId) {
      lastLoadedInitialId.current = seedId;
      void loadById(seedId, Boolean(fromUrl));
      return;
    }

    if (initialQuery.trim()) {
      setQuery(initialQuery.trim());
    }
  }, [enableDirectLink, initialQuery, initialWsdcId, loadById]);

  useEffect(() => {
    if (!enableDirectLink) {
      return;
    }

    const onPopState = () => {
      const fromUrl = readWsdcFromUrl();
      if (fromUrl) {
        lastLoadedInitialId.current = fromUrl;
        void loadById(fromUrl, false);
      } else {
        applyProfile(null, false);
        setNameMatches([]);
        setError('');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [applyProfile, enableDirectLink, loadById]);

  useEffect(() => {
    const nextId = normalizeWsdcId(initialWsdcId);
    if (!mountedInitial.current || !nextId || nextId === lastLoadedInitialId.current) {
      return;
    }

    lastLoadedInitialId.current = nextId;
    void loadById(nextId, false);
  }, [initialWsdcId, loadById]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setError('');

    if (suppressAc.current) {
      suppressAc.current = false;
      return;
    }

    if (acTimer.current != null) {
      window.clearTimeout(acTimer.current);
      acTimer.current = null;
    }

    const q = value.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }

    acTimer.current = window.setTimeout(() => {
      void autocompleteWsdcDancers(q)
        .then((rows) => {
          setSuggestions(rows);
          setSuggestionsOpen(rows.length > 0);
        })
        .catch(() => {
          setSuggestions([]);
          setSuggestionsOpen(false);
        });
    }, 250);
  };

  const handleSubmit = () => {
    void loadByQuery(query);
  };

  const handleSelectSuggestion = (suggestion: WsdcSuggestion) => {
    suppressAc.current = true;
    setQuery(suggestion.name);
    setSuggestionsOpen(false);
    void loadById(String(suggestion.wscid), true);
  };

  const handleSelectNameMatch = (match: WsdcNameMatch) => {
    void loadById(String(match.wscid), true);
  };

  const handleConfirm = async () => {
    if (!profile || !onConfirmWsdcId) {
      return;
    }
    await onConfirmWsdcId(normalizeWsdcId(profile.dancer_wsdcid), profile);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSuggestionsOpen(false);
    setNameMatches([]);
    setError('');
    applyProfile(null, true);
  };

  return (
    <Stack spacing={1.5}>
      <Box sx={{ position: 'relative' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { sm: 'flex-start' } }}
        >
          <Box sx={{ flex: 1, position: 'relative', width: '100%' }}>
            <AppTextField
              label="Search by Name or WSDC #"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setSuggestionsOpen(true);
                }
              }}
              onBlur={() => {
                window.setTimeout(() => setSuggestionsOpen(false), 200);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              fullWidth
              autoComplete="off"
              placeholder="Search by Name or WSDC #"
            />
            {suggestionsOpen && suggestions.length > 0 && (
              <Paper
                elevation={4}
                sx={{
                  position: 'absolute',
                  zIndex: 10,
                  left: 0,
                  right: 0,
                  mt: 0.5,
                  maxHeight: 280,
                  overflowY: 'auto',
                }}
              >
                <List dense disablePadding>
                  {suggestions.map((suggestion) => (
                    <ListItemButton
                      key={suggestion.wscid}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <ListItemText primary={suggestion.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
          <Button
            type="button"
            variant="contained"
            disabled={loading || !query.trim()}
            onClick={handleSubmit}
            sx={{ minWidth: { sm: 140 }, height: 56 }}
          >
            Find Dancer
          </Button>
        </Stack>
      </Box>

      {loading && (
        <Stack direction="row" spacing={1} sx={{ py: 1, alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Looking up WSDC registry…
          </Typography>
        </Stack>
      )}

      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && nameMatches.length > 1 && (
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>{nameMatches.length}</strong> dancers match your search — pick one (uses WSDC #):
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 280, overflowY: 'auto' }}>
            <List dense disablePadding>
              {nameMatches.map((match) => (
                <ListItemButton key={match.wscid} onClick={() => handleSelectNameMatch(match)}>
                  <ListItemText
                    primary={`${match.first_name} ${match.last_name}`}
                    secondary={`WSDC #${match.wscid}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {profile && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {profile.dancer_first} {profile.dancer_last} (#{normalizeWsdcId(profile.dancer_wsdcid)})
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {formatWsdcLevelLine(
              profile.dominate_role || profile.short_dominate_role,
              profile.dominate_required,
              profile.dominate_allowed,
            )}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            {formatWsdcLevelLine(
              profile.non_dominate_role || profile.short_non_dominate_role,
              profile.non_dominate_required,
              profile.non_dominate_allowed,
            )}
          </Typography>
          {(profile.dominate_role_highest_level || profile.non_dominate_role_highest_level) && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Highest points — Primary: {profile.dominate_role_highest_level ?? '—'} (
              {profile.dominate_role_highest_level_points ?? 0}) · Secondary:{' '}
              {profile.non_dominate_role_highest_level ?? '—'} (
              {profile.non_dominate_role_highest_level_points ?? 0})
            </Typography>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            {onConfirmWsdcId && (
              <Button
                variant="contained"
                disabled={confirming}
                onClick={() => void handleConfirm()}
              >
                {confirming ? 'Saving…' : confirmLabel}
              </Button>
            )}
            <Button variant="text" onClick={handleClear} disabled={confirming}>
              Clear
            </Button>
          </Stack>
        </Paper>
      )}
    </Stack>
  );
}
