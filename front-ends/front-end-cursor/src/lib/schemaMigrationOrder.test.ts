import { describe, expect, it } from 'vitest';
import { compareSchemaMigrationRowsDescending } from './schemaMigrationOrder';

describe('compareSchemaMigrationRowsDescending', () => {
  it('puts the largest script number first', () => {
    const rows = [
      { number: '9', script: '009_login_rpc.sql' },
      { number: '152', script: '152_contest_roster_notify.sql' },
      { number: '99', script: '099_event_group_directors_json.sql' },
      { number: '10', script: '010_mailer_password_reset.sql' },
    ];

    const ordered = [...rows].sort(compareSchemaMigrationRowsDescending);

    expect(ordered.map((row) => row.number)).toEqual(['152', '99', '10', '9']);
  });

  it('breaks ties on the script name with the later name first', () => {
    const rows = [
      { number: '110', script: '110_event_attendee_notify.sql' },
      { number: '110', script: '110_readable_login_logout_timestamps.sql' },
    ];

    const ordered = [...rows].sort(compareSchemaMigrationRowsDescending);

    expect(ordered.map((row) => row.script)).toEqual([
      '110_readable_login_logout_timestamps.sql',
      '110_event_attendee_notify.sql',
    ]);
  });
});
