import { describe, expect, it } from 'vitest';
import {
  eventInJudgingWindow,
  selectJudgingHomeContests,
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
      },
      {
        id: 'event-134-json-strictly-item',
        eventId: 134,
        eventName: 'All-American Jack and Jill',
        skillLevelLabel: 'All-American',
        divisionLabel: 'Strictly',
        contestId: null,
        contestItemId: 'strictly-item',
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
    });
  });
});
