import { useEffect, useState } from 'react';
import CheckinSheet, { type CheckinSheetRow } from '../components/CheckinSheet';
import {
  CHECKIN_ROW_COUNT,
  assignBibNumbers,
  fetchRandomCheckinPeople,
  formatCheckinName,
  pairCheckinCouples,
  type CheckinCouple,
} from '../lib/checkinRoster';

const COLUMNS = [
  { key: 'bib', label: 'Bib #', width: '16%' },
  { key: 'leader', label: 'Leader' },
  { key: 'follower', label: 'Follower' },
];

export default function CheckinCouplePage() {
  const [rows, setRows] = useState<CheckinCouple[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setChecked({});

    Promise.all([
      fetchRandomCheckinPeople('leader', CHECKIN_ROW_COUNT),
      fetchRandomCheckinPeople('follower', CHECKIN_ROW_COUNT),
    ])
      .then(([leaders, followers]) => {
        if (cancelled) {
          return;
        }
        const count = Math.min(leaders.length, followers.length);
        const bibs = assignBibNumbers(count);
        setRows(pairCheckinCouples(leaders, followers, bibs));
      })
      .catch((loadError: unknown) => {
        if (cancelled) {
          return;
        }
        setRows([]);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load check-in roster.');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sheetRows: CheckinSheetRow[] = rows.map((row) => ({
    id: row.bib,
    values: {
      bib: row.bib,
      leader: formatCheckinName(row.leader),
      follower: formatCheckinName(row.follower),
    },
    checked: checked[row.bib] === true,
    checkAriaLabel: `Checked in bib ${row.bib}`,
  }));

  return (
    <CheckinSheet
      title="Couples Check-In"
      tableLabel="Couples check-in table"
      columns={COLUMNS}
      rows={sheetRows}
      loading={loading}
      error={error}
      emptyMessage="No test couples found. Leaders and followers are both required."
      onToggle={(id, next) => setChecked((current) => ({ ...current, [id]: next }))}
    />
  );
}
