import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CheckinSheet, { type CheckinSheetRow } from '../components/CheckinSheet';
import {
  assignBibNumbers,
  fetchRandomCheckinPeople,
  type CheckinPerson,
  type CheckinRole,
} from '../lib/checkinRoster';

const COLUMNS = [
  { key: 'bib', label: 'Bib #', width: '18%' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
];

type SingleRow = {
  bib: string;
  person: CheckinPerson;
};

function roleFromParam(value: string | null): CheckinRole | null {
  if (value === 'leader' || value === 'follower') {
    return value;
  }
  return null;
}

function displayText(value: string): string {
  const trimmed = value.trim();
  return trimmed === '' ? '—' : trimmed;
}

export default function CheckinSinglePage() {
  const [searchParams] = useSearchParams();
  const role = roleFromParam(searchParams.get('role'));
  const [rows, setRows] = useState<SingleRow[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(role !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!role) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setChecked({});

    fetchRandomCheckinPeople(role)
      .then((people) => {
        if (cancelled) {
          return;
        }
        const bibs = assignBibNumbers(people.length);
        setRows(
          people.map((person, index) => ({
            bib: bibs[index] ?? String(index + 1),
            person,
          })),
        );
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
  }, [role]);

  if (!role) {
    return (
      <CheckinSheet
        title="Check-In"
        tableLabel="Check-in"
        columns={COLUMNS}
        rows={[]}
        loading={false}
        error={null}
        emptyMessage="Choose Leaders Checkin or Followers Checkin on the Demo page."
        onToggle={() => undefined}
      />
    );
  }

  const title = role === 'leader' ? 'Leaders Check-In' : 'Followers Check-In';
  const roleLabel = role === 'leader' ? 'leader' : 'follower';
  const sheetRows: CheckinSheetRow[] = [...rows]
    .sort((left, right) => Number(left.bib) - Number(right.bib))
    .map((row) => ({
      id: row.bib,
      values: {
        bib: row.bib,
        firstName: displayText(row.person.firstName),
        lastName: displayText(row.person.lastName),
      },
      checked: checked[row.bib] === true,
      checkAriaLabel: `Checked in bib ${row.bib}`,
    }));

  return (
    <CheckinSheet
      title={title}
      tableLabel={`${title} table`}
      columns={COLUMNS}
      rows={sheetRows}
      loading={loading}
      error={error}
      emptyMessage={`No test ${roleLabel}s found.`}
      onToggle={(id, next) => setChecked((current) => ({ ...current, [id]: next }))}
    />
  );
}
