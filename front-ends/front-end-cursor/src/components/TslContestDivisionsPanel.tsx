import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createTslDivisionContest,
  fetchSortedStaticListEntries,
  type ContestListRow,
  type StaticListEntry,
} from '../api/postgrest';
import { eventContestPath } from '../constants/eventRoutes';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { TSL_DIVISIONS_LIST_CODE } from '../lib/staticList';
import { isTslContestEvent } from '../lib/tslContests';

type TslContestDivisionsPanelProps = {
  eventGroupCode: string;
  eventId: number;
  eventCode: string;
  eventTypeCode: string | null;
  contests: ContestListRow[];
  onContestsChanged: () => Promise<void>;
};

export default function TslContestDivisionsPanel({
  eventGroupCode,
  eventId,
  eventCode,
  eventTypeCode,
  contests,
  onContestsChanged,
}: TslContestDivisionsPanelProps) {
  const navigate = useNavigate();
  const { showXsLayout } = useLayoutTier();
  const { showSuccess, showProblem, showWarning } = useMessages();

  const [divisions, setDivisions] = useState<StaticListEntry[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [loadingLists, setLoadingLists] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const contestsByDivision = useMemo(() => {
    const map = new Map<string, ContestListRow>();
    for (const contest of contests) {
      if (contest.divisionKey) {
        map.set(contest.divisionKey, contest);
      }
    }
    return map;
  }, [contests]);

  const existingKeys = useMemo(
    () => new Set(contestsByDivision.keys()),
    [contestsByDivision],
  );

  useEffect(() => {
    let cancelled = false;

    setLoadingLists(true);
    setListError(null);

    fetchSortedStaticListEntries(TSL_DIVISIONS_LIST_CODE, 'TSL divisions')
      .then((entries) => {
        if (cancelled) {
          return;
        }
        setDivisions(entries);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setListError(
          error instanceof Error ? error.message : 'Unable to load TSL divisions.',
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingLists(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setSelectedKeys(new Set(existingKeys));
  }, [existingKeys]);

  const toggleKey = useCallback((key: string, checked: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const toCreate = divisions.filter(
      (division) => selectedKeys.has(division.key) && !existingKeys.has(division.key),
    );
    const attemptedRemove = [...existingKeys].filter((key) => !selectedKeys.has(key));

    if (toCreate.length === 0 && attemptedRemove.length === 0) {
      showWarning('No contest changes to save.');
      return;
    }

    if (attemptedRemove.length > 0) {
      showWarning(
        'Unchecking an existing contest does not delete it. Re-check it or open the contest to manage it.',
      );
      setSelectedKeys(new Set(existingKeys));
    }

    if (toCreate.length === 0) {
      return;
    }

    setSaving(true);
    try {
      for (const division of toCreate) {
        await createTslDivisionContest({
          eventId,
          eventCode,
          eventTypeCode: eventTypeCode || 'SWORD_LIGHT_SABER',
          divisionKey: division.key,
          divisionLabel: division.label,
        });
      }
      showSuccess(
        toCreate.length === 1
          ? `Created ${toCreate[0].label} contest.`
          : `Created ${toCreate.length} contests.`,
      );
      await onContestsChanged();
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Unable to save contests.');
    } finally {
      setSaving(false);
    }
  }, [
    divisions,
    eventCode,
    eventId,
    eventTypeCode,
    existingKeys,
    onContestsChanged,
    selectedKeys,
    showProblem,
    showSuccess,
    showWarning,
  ]);

  if (!isTslContestEvent(eventGroupCode, eventTypeCode)) {
    return null;
  }

  return (
    <Stack
      spacing={2}
      sx={{
        my: 2,
        textAlign: 'left',
        ...(showXsLayout
          ? centeredContentStackSx
          : { maxWidth: 480, mx: 'auto', width: '100%' }),
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        TSL contest types — check the divisions to offer at this event.
      </Typography>

      {loadingLists && (
        <Stack sx={{ py: 3, alignItems: 'center' }}>
          <CircularProgress size={28} />
        </Stack>
      )}

      {!loadingLists && listError && (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
          {listError}
        </Typography>
      )}

      {!loadingLists &&
        !listError &&
        divisions.map((division) => {
          const existing = contestsByDivision.get(division.key);
          const checked = selectedKeys.has(division.key);

          return (
            <Stack
              key={division.key}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <FormControlLabel
                sx={{ flex: 1, mr: 0 }}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => toggleKey(division.key, event.target.checked)}
                    slotProps={{ input: { 'aria-label': division.label } }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {division.label}
                    {existing ? ` (${existing.participantCount})` : ''}
                  </Typography>
                }
              />
              {existing ? (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    navigate(eventContestPath(eventGroupCode, eventId, existing.contestId))
                  }
                >
                  Open
                </Button>
              ) : null}
            </Stack>
          );
        })}

      {!loadingLists && !listError && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={saving}
          onClick={() => {
            void handleSave();
          }}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      )}
    </Stack>
  );
}
