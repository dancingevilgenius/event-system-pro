import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FLOOR_PARENT_TITLE,
  eventStartsWithinNextWindow,
  floorParentCheckinPath,
  floorParentTitleFromAdditionalInfo,
  selectFloorParentContests,
} from './floorParent';

const now = new Date('2026-10-19T15:00:00.000Z');

describe('floorParentTitleFromAdditionalInfo', () => {
  it('defaults when the title is missing or unknown', () => {
    expect(floorParentTitleFromAdditionalInfo(null)).toBe(DEFAULT_FLOOR_PARENT_TITLE);
    expect(floorParentTitleFromAdditionalInfo({})).toBe('Floor Parent');
    expect(floorParentTitleFromAdditionalInfo({ floor_parent_title: 'Floor Captain' })).toBe('Floor Parent');
  });

  it('keeps a saved title', () => {
    expect(floorParentTitleFromAdditionalInfo({ floor_parent_title: 'Floor Mom' })).toBe('Floor Mom');
    expect(floorParentTitleFromAdditionalInfo({ floor_parent_title: ' Floor Dad ' })).toBe('Floor Dad');
  });
});

describe('eventStartsWithinNextWindow', () => {
  it('includes a start now or exactly 6 hours ahead', () => {
    expect(eventStartsWithinNextWindow('2026-10-19T15:00:00.000Z', now)).toBe(true);
    expect(eventStartsWithinNextWindow('2026-10-19T21:00:00.000Z', now)).toBe(true);
  });

  it('excludes a start in the past or more than 6 hours ahead', () => {
    expect(eventStartsWithinNextWindow('2026-10-19T14:59:59.000Z', now)).toBe(false);
    expect(eventStartsWithinNextWindow('2026-10-19T21:00:00.001Z', now)).toBe(false);
    expect(eventStartsWithinNextWindow(null, now)).toBe(false);
  });
});

describe('selectFloorParentContests', () => {
  it('lists upcoming contests in start order and merges a table twin', () => {
    const contests = selectFloorParentContests({
      now,
      events: [
        {
          eventId: 2,
          name: 'Later Swing',
          startDate: '2026-10-19T18:00:00.000Z',
          moreJson: {
            contests: {
              items: [
                {
                  id: 'item-b',
                  skill_level_label: 'Novice',
                  division_label: 'Jack and Jill',
                  skill_level_key: 'novice',
                  division_key: 'jj',
                },
              ],
            },
          },
        },
        {
          eventId: 1,
          name: 'Soon Swing',
          startDate: '2026-10-19T16:00:00.000Z',
          moreJson: {
            contests: {
              items: [
                {
                  id: 'item-a',
                  skill_level_label: 'Champion',
                  division_label: 'Strictly',
                },
              ],
            },
          },
        },
        {
          eventId: 3,
          name: 'Yesterday',
          startDate: '2026-10-18T16:00:00.000Z',
          moreJson: {
            contests: { items: [{ id: 'old', skill_level_label: 'Novice', division_label: 'JJ' }] },
          },
        },
        {
          eventId: 4,
          name: 'Cancelled',
          startDate: '2026-10-19T16:30:00.000Z',
          moreJson: {
            cancelled: true,
            contests: { items: [{ id: 'gone', skill_level_label: 'Novice', division_label: 'JJ' }] },
          },
        },
      ],
      contests: [
        {
          contestId: 44,
          eventId: 1,
          eventTypeCode: 'Strictly',
          moreJson: { id: 'item-a', skill_level_label: 'Champion', division_label: 'Strictly' },
        },
        {
          contestId: 55,
          eventId: 2,
          eventTypeCode: null,
          moreJson: { skill_level_label: 'All-Star', division_label: 'Showcase' },
        },
      ],
    });

    expect(contests.map((contest) => contest.id)).toEqual([
      'event-1-json-item-a',
      'event-2-contest-55',
      'event-2-json-item-b',
    ]);
    expect(contests[0]?.contestId).toBe(44);
    expect(floorParentCheckinPath(contests[0]!)).toContain('contestId=44');
    expect(floorParentCheckinPath(contests[0]!)).toContain('itemId=item-a');
  });
});
