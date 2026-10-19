import { describe, expect, it } from 'vitest';
import {
  checkinIconTone,
  contestLockedFlag,
  eventInJudgingWindow,
  formatRegisteredCounts,
  selectJudgingHomeContests,
  showsJudgingHomeButton,
  type JudgingHomeContestRow,
  type JudgingHomeEvent,
  type JudgingUserIdentity,
} from './judgingHome';

const carlos: JudgingUserIdentity = {
  userId: 1004,
  username: 'dancingevilgenius',
  firstName: 'Carlos',
  lastName: 'Garcia',
};

const liz: JudgingUserIdentity = {
  userId: 1011,
  username: 'egutzwiler-daigle',
  firstName: 'Elizabeth',
  lastName: 'Gutzwiler-Daigle',
};

const allAmericanStart = '2026-10-17T19:00:00-05:00';
const saturdayAfternoon = new Date('2026-10-17T16:41:00-05:00');

const event134: JudgingHomeEvent = {
  eventId: 134,
  name: 'All-American Jack and Jill',
  startDate: allAmericanStart,
  moreJson: {
    staff: {
      people: [
        {
          id: 'liz-staff',
          first_name: 'Elizabeth',
          last_name: 'Gutzwiler-Daigle',
          primary_role_code: 'FLOOR_PARENT',
          secondary_role_code: 'REGISTRATION',
        },
        {
          id: 'carlos-staff',
          first_name: 'Carlos',
          last_name: 'Garcia',
          primary_role_code: 'JUDGE',
          secondary_role_code: 'REGISTRATION',
        },
        {
          id: 'head-staff',
          first_name: 'Yvonne',
          last_name: 'Antonacci',
          primary_role_code: 'HEAD_JUDGE',
          secondary_role_code: '',
        },
      ],
    },
    contests: {
      has_contests: true,
      items: [
        {
          id: 'jnj-item',
          division_key: 'JNJ',
          division_label: 'Jack and Jill',
          skill_level_key: 'AAM',
          skill_level_label: 'All-American',
          head_judge_staff_id: 'head-staff',
          scoring_judge_staff_ids: ['carlos-staff'],
        },
        {
          id: 'strictly-item',
          division_key: 'STR',
          division_label: 'Strictly',
          skill_level_key: 'AAM',
          skill_level_label: 'All-American',
          head_judge_staff_id: 'head-staff',
          scoring_judge_staff_ids: [],
        },
      ],
    },
  },
};

describe('showsJudgingHomeButton', () => {
  it('shows Judging for the Judge app role without a contest in the 6-hour window', () => {
    expect(showsJudgingHomeButton({ appRoles: ['JUDGE'], contestsInWindow: 0 })).toBe(true);
    expect(showsJudgingHomeButton({ appRoles: ['Judge'], contestsInWindow: 0 })).toBe(true);
    expect(showsJudgingHomeButton({ appRoles: [' judge '], contestsInWindow: 0 })).toBe(true);
  });

  it('shows Judging for Head Judge as its own role', () => {
    expect(showsJudgingHomeButton({ appRoles: ['HEAD_JUDGE'], contestsInWindow: 0 })).toBe(true);
    expect(showsJudgingHomeButton({ appRoles: ['Head Judge'], contestsInWindow: 0 })).toBe(true);
  });

  it('hides Judging when the account is not a judge and no contest is in the window', () => {
    expect(showsJudgingHomeButton({ appRoles: ['STAFF'], contestsInWindow: 0 })).toBe(false);
    expect(showsJudgingHomeButton({ appRoles: [], contestsInWindow: 0 })).toBe(false);
    expect(showsJudgingHomeButton({ appRoles: ['REGISTRATION'] })).toBe(false);
  });

  it('still shows Judging when a contest is already in the window', () => {
    expect(showsJudgingHomeButton({ appRoles: ['STAFF'], contestsInWindow: 1 })).toBe(true);
  });
});

describe('eventInJudgingWindow', () => {
  it('includes All-American Jack and Jill at 7:00 PM when it is 4:41 PM', () => {
    expect(eventInJudgingWindow(allAmericanStart, saturdayAfternoon)).toBe(true);
  });

  it('includes a start exactly 6 hours ahead or 6 hours ago', () => {
    const now = new Date('2026-10-17T16:00:00-05:00');
    expect(eventInJudgingWindow('2026-10-17T22:00:00-05:00', now)).toBe(true);
    expect(eventInJudgingWindow('2026-10-17T10:00:00-05:00', now)).toBe(true);
  });

  it('excludes a start more than 6 hours away', () => {
    const now = new Date('2026-10-17T16:00:00-05:00');
    expect(eventInJudgingWindow('2026-10-17T22:00:01-05:00', now)).toBe(false);
    expect(eventInJudgingWindow('2026-10-17T09:59:59-05:00', now)).toBe(false);
  });
});

describe('selectJudgingHomeContests', () => {
  it('does not list contests outside the 6-hour window for an app-role judge', () => {
    const contests = selectJudgingHomeContests({
      events: [{ ...event134, startDate: '2026-10-20T19:00:00-05:00' }],
      contests: [],
      user: { ...carlos, appRoles: ['JUDGE'] },
      now: saturdayAfternoon,
    });

    expect(contests).toEqual([]);
    expect(showsJudgingHomeButton({ appRoles: ['Judge'], contestsInWindow: contests.length })).toBe(true);
  });

  it('lists every contest on the event for a staff judge', () => {
    const contests = selectJudgingHomeContests({
      events: [event134],
      contests: [],
      user: carlos,
      now: saturdayAfternoon,
    });

    expect(contests).toEqual([
      {
        id: 'event-134-json-jnj-item',
        eventId: 134,
        eventName: 'All-American Jack and Jill',
        skillLevelLabel: 'All-American',
        divisionLabel: 'Jack and Jill',
        contestId: null,
        contestItemId: 'jnj-item',
        skillLevelKey: 'AAM',
        divisionKey: 'JNJ',
        leaderCount: 0,
        followerCount: 0,
        locked: true,
        canToggleLock: false,
        viewerSubmitted: false,
        leadersCheckedIn: 0,
        followersCheckedIn: 0,
      },
      {
        id: 'event-134-json-strictly-item',
        eventId: 134,
        eventName: 'All-American Jack and Jill',
        skillLevelLabel: 'All-American',
        divisionLabel: 'Strictly',
        contestId: null,
        contestItemId: 'strictly-item',
        skillLevelKey: 'AAM',
        divisionKey: 'STR',
        leaderCount: 0,
        followerCount: 0,
        locked: true,
        canToggleLock: false,
        viewerSubmitted: false,
        leadersCheckedIn: 0,
        followersCheckedIn: 0,
      },
    ]);
  });

  it('does not list contests for registration staff who are not judges', () => {
    expect(
      selectJudgingHomeContests({
        events: [event134],
        contests: [],
        user: liz,
        now: saturdayAfternoon,
      }),
    ).toEqual([]);
  });

  it('omits events outside the 6-hour window', () => {
    const later: JudgingHomeEvent = {
      ...event134,
      eventId: 200,
      startDate: '2026-10-18T12:00:00-05:00',
    };

    expect(
      selectJudgingHomeContests({
        events: [later],
        contests: [],
        user: carlos,
        now: saturdayAfternoon,
      }),
    ).toEqual([]);
  });

  it('includes a contest when the user is only assigned as a scoring judge', () => {
    const scoringOnly: JudgingHomeEvent = {
      eventId: 140,
      name: 'Novice Jack and Jill',
      startDate: allAmericanStart,
      moreJson: {
        staff: {
          people: [
            {
              id: 'dj-staff',
              first_name: 'Carlos',
              last_name: 'Garcia',
              primary_role_code: 'DJ',
              secondary_role_code: '',
            },
          ],
        },
        contests: {
          has_contests: true,
          items: [
            {
              id: 'novice-item',
              division_label: 'Jack and Jill',
              skill_level_label: 'Novice',
              scoring_judge_staff_ids: ['dj-staff'],
            },
            {
              id: 'other-item',
              division_label: 'Strictly',
              skill_level_label: 'Novice',
              scoring_judge_staff_ids: ['someone-else'],
            },
          ],
        },
      },
    };

    expect(
      selectJudgingHomeContests({
        events: [scoringOnly],
        contests: [],
        user: carlos,
        now: saturdayAfternoon,
      }).map((contest) => contest.contestItemId),
    ).toEqual(['novice-item']);
  });

  it('includes a public contest row and keeps its contest id on a matching json contest', () => {
    const tableRow: JudgingHomeContestRow = {
      contestId: 88,
      eventId: 134,
      eventTypeCode: 'JNJ',
      moreJson: {
        id: 'jnj-item',
        skill_level_key: 'AAM',
        division_key: 'JNJ',
        skill_level_label: 'All-American',
        division_label: 'Jack and Jill',
      },
      staffJson: null,
    };
    const extra: JudgingHomeContestRow = {
      contestId: 89,
      eventId: 134,
      eventTypeCode: 'PRO',
      moreJson: {
        skill_level_label: 'Champion',
        division_label: 'Showcase',
      },
      staffJson: null,
    };

    const contests = selectJudgingHomeContests({
      events: [event134],
      contests: [tableRow, extra],
      user: carlos,
      now: saturdayAfternoon,
    });

    expect(contests.find((contest) => contest.contestItemId === 'jnj-item')?.contestId).toBe(88);
    expect(contests.find((contest) => contest.contestId === 89)).toMatchObject({
      eventName: 'All-American Jack and Jill',
      skillLevelLabel: 'Champion',
      divisionLabel: 'Showcase',
      leaderCount: 0,
      followerCount: 0,
      locked: true,
      canToggleLock: false,
    });
  });

  it('lets an admin see every contest in the window, including events they are not on', () => {
    const outsider: JudgingUserIdentity = {
      userId: 9,
      username: 'admin-only',
      firstName: 'Ada',
      lastName: 'Min',
      appRoles: ['ADMIN'],
    };

    const contests = selectJudgingHomeContests({
      events: [event134],
      contests: [],
      user: outsider,
      now: saturdayAfternoon,
    });

    expect(contests.map((contest) => contest.contestItemId)).toEqual(['jnj-item', 'strictly-item']);
    expect(contests.every((contest) => contest.canToggleLock && contest.locked)).toBe(true);
  });

  it('lets an event director see contests on their event without the lock control', () => {
    const directorEvent: JudgingHomeEvent = {
      ...event134,
      moreJson: {
        staff: {
          people: [
            {
              id: 'dana-staff',
              first_name: 'Dana',
              last_name: 'Director',
              primary_role_code: 'DJ',
              secondary_role_code: 'EVENT_DIRECTOR',
            },
          ],
        },
        contests: (event134.moreJson as { contests: unknown }).contests,
      },
    };
    const dana: JudgingUserIdentity = {
      userId: 20,
      username: 'dana',
      firstName: 'Dana',
      lastName: 'Director',
      appRoles: [],
    };

    const contests = selectJudgingHomeContests({
      events: [directorEvent],
      contests: [],
      user: dana,
      now: saturdayAfternoon,
    });

    expect(contests.map((contest) => contest.contestItemId)).toEqual(['jnj-item', 'strictly-item']);
    expect(contests.every((contest) => contest.canToggleLock)).toBe(false);
  });

  it('lets an event manager app role see contests only when they are on that event staff', () => {
    const attached = selectJudgingHomeContests({
      events: [event134],
      contests: [],
      user: { ...liz, appRoles: ['EVENT_MANAGER'] },
      now: saturdayAfternoon,
    });
    const unattached: JudgingUserIdentity = {
      userId: 21,
      username: 'manager-away',
      firstName: 'Morgan',
      lastName: 'Away',
      appRoles: ['EVENT_MANAGER'],
    };

    expect(attached.map((contest) => contest.contestItemId)).toEqual(['jnj-item', 'strictly-item']);
    expect(attached.every((contest) => contest.canToggleLock)).toBe(false);
    expect(
      selectJudgingHomeContests({
        events: [event134],
        contests: [],
        user: unattached,
        now: saturdayAfternoon,
      }),
    ).toEqual([]);
  });

  it('shows the lock control to a contest head judge and an app head judge', () => {
    const headJudge: JudgingUserIdentity = {
      userId: 30,
      username: 'yvonne',
      firstName: 'Yvonne',
      lastName: 'Antonacci',
    };
    const scoringHead: JudgingUserIdentity = {
      ...carlos,
      appRoles: ['HEAD_JUDGE'],
    };

    const asHead = selectJudgingHomeContests({
      events: [event134],
      contests: [],
      user: headJudge,
      now: saturdayAfternoon,
    });
    const asAppHead = selectJudgingHomeContests({
      events: [event134],
      contests: [],
      user: scoringHead,
      now: saturdayAfternoon,
    });

    expect(asHead.every((contest) => contest.canToggleLock)).toBe(true);
    expect(asAppHead.every((contest) => contest.canToggleLock)).toBe(true);
  });

  it('lets a contest head judge lock only the contest they lead', () => {
    const ledEvent: JudgingHomeEvent = {
      eventId: 141,
      name: 'Novice Spotlight',
      startDate: allAmericanStart,
      moreJson: {
        staff: {
          people: [
            {
              id: 'pat-staff',
              first_name: 'Pat',
              last_name: 'Head',
              primary_role_code: 'DJ',
              secondary_role_code: '',
            },
          ],
        },
        contests: {
          has_contests: true,
          items: [
            {
              id: 'led-item',
              division_label: 'Jack and Jill',
              skill_level_label: 'Novice',
              head_judge_staff_id: 'pat-staff',
            },
            {
              id: 'other-item',
              division_label: 'Strictly',
              skill_level_label: 'Novice',
              head_judge_staff_id: 'someone-else',
              scoring_judge_staff_ids: ['pat-staff'],
            },
          ],
        },
      },
    };
    const pat: JudgingUserIdentity = {
      userId: 31,
      username: 'pat',
      firstName: 'Pat',
      lastName: 'Head',
    };

    const contests = selectJudgingHomeContests({
      events: [ledEvent],
      contests: [],
      user: pat,
      now: saturdayAfternoon,
    });

    expect(contests.map((contest) => [contest.contestItemId, contest.canToggleLock])).toEqual([
      ['led-item', true],
      ['other-item', false],
    ]);
  });

  it('counts stored leaders and followers and treats a missing lock as locked', () => {
    const counted: JudgingHomeEvent = {
      ...event134,
      moreJson: {
        ...(event134.moreJson as Record<string, unknown>),
        contests: {
          has_contests: true,
          items: [
            {
              id: 'jnj-item',
              division_key: 'JNJ',
              division_label: 'Jack and Jill',
              skill_level_key: 'AAM',
              skill_level_label: 'All-American',
              head_judge_staff_id: 'head-staff',
              scoring_judge_staff_ids: ['carlos-staff'],
              leaders: [
                { id: 'a', checked_in: true },
                { id: 'b' },
                { id: 'c', checked_in: true },
              ],
              followers: [
                { id: 'd', checked_in: true },
                { id: 'e' },
                { id: 'f' },
                { id: 'g' },
                { id: 'h' },
              ],
            },
            {
              id: 'strictly-item',
              division_label: 'Strictly',
              skill_level_label: 'All-American',
              Locked: false,
            },
          ],
        },
      },
    };

    const contests = selectJudgingHomeContests({
      events: [counted],
      contests: [],
      user: carlos,
      now: saturdayAfternoon,
    });

    expect(formatRegisteredCounts(0, 0)).toBe('L:0 F:0');
    expect(contests.find((contest) => contest.contestItemId === 'jnj-item')).toMatchObject({
      leaderCount: 3,
      followerCount: 5,
      leadersCheckedIn: 2,
      followersCheckedIn: 1,
      locked: true,
    });
    const countedContest = contests.find((contest) => contest.contestItemId === 'jnj-item');
    expect(countedContest ? checkinIconTone(countedContest) : null).toBe('partial');
    expect(checkinIconTone({ leaderCount: 2, followerCount: 2, leadersCheckedIn: 2, followersCheckedIn: 2 })).toBe(
      'complete',
    );
    expect(checkinIconTone({ leaderCount: 2, followerCount: 2, leadersCheckedIn: 0, followersCheckedIn: 0 })).toBe(
      'none',
    );
    expect(checkinIconTone({ leaderCount: 0, followerCount: 0, leadersCheckedIn: 0, followersCheckedIn: 0 })).toBe(
      'none',
    );
    expect(formatRegisteredCounts(3, 5)).toBe('L:3 F:5');
    expect(contests.find((contest) => contest.contestItemId === 'strictly-item')?.locked).toBe(false);
    expect(contestLockedFlag({})).toBe(true);
    expect(contestLockedFlag({ Locked: false })).toBe(false);
    expect(contestLockedFlag({ Locked: true })).toBe(true);
  });

  it('uses public contest competitors when the event item has no roster arrays', () => {
    const tableRow: JudgingHomeContestRow = {
      contestId: 90,
      eventId: 134,
      eventTypeCode: 'JNJ',
      moreJson: {
        id: 'open-item',
        skill_level_label: 'Novice',
        division_label: 'Jack and Jill',
      },
      staffJson: null,
      competitorsJson: {
        leaders: [{ id: 'l1' }, { id: 'l2' }],
        followers: [{ id: 'f1' }],
      },
    };
    const event: JudgingHomeEvent = {
      eventId: 134,
      name: 'All-American Jack and Jill',
      startDate: allAmericanStart,
      moreJson: {
        staff: {
          people: [
            {
              id: 'carlos-staff',
              first_name: 'Carlos',
              last_name: 'Garcia',
              primary_role_code: 'JUDGE',
            },
          ],
        },
        contests: { has_contests: true, items: [] },
      },
    };

    const contests = selectJudgingHomeContests({
      events: [event],
      contests: [tableRow],
      user: carlos,
      now: saturdayAfternoon,
    });

    expect(contests).toMatchObject([
      { contestId: 90, leaderCount: 2, followerCount: 1, locked: true },
    ]);
  });

  it('drops a cancelled event and its contests', () => {
    const cancelledEvent: JudgingHomeEvent = {
      ...event134,
      moreJson: {
        ...(event134.moreJson as Record<string, unknown>),
        cancelled: true,
      },
    };
    const tableRow: JudgingHomeContestRow = {
      contestId: 91,
      eventId: 134,
      eventTypeCode: 'JNJ',
      moreJson: {
        skill_level_label: 'Champion',
        division_label: 'Showcase',
      },
      staffJson: null,
    };
    const stillOn: JudgingHomeEvent = {
      ...event134,
      eventId: 135,
      name: 'Still On',
      moreJson: {
        ...(event134.moreJson as Record<string, unknown>),
        cancelled: false,
      },
    };

    const contests = selectJudgingHomeContests({
      events: [cancelledEvent, stillOn],
      contests: [tableRow],
      user: carlos,
      now: saturdayAfternoon,
    });

    expect(contests.some((contest) => contest.eventId === 134)).toBe(false);
    expect(contests.every((contest) => contest.eventId === 135)).toBe(true);
    expect(contests.length).toBeGreaterThan(0);
  });
});
