import { describe, expect, it } from 'vitest';
import {
  alreadyRegisteredContestMessage,
  bibNumbersMatch,
  bibOwnerNames,
  contestSkillDivisionLabel,
  duplicateContestBibMessage,
  rosterHasBib,
  rosterPersonById,
} from './duplicateContestBib';

describe('bibNumbersMatch', () => {
  it('treats 007 and 7 as the same bib', () => {
    expect(bibNumbersMatch('007', 7)).toBe(true);
    expect(bibNumbersMatch(7, 7)).toBe(true);
    expect(bibNumbersMatch('7', 7)).toBe(true);
  });

  it('does not match a different bib or a missing bib', () => {
    expect(bibNumbersMatch('8', 7)).toBe(false);
    expect(bibNumbersMatch(undefined, 7)).toBe(false);
    expect(bibNumbersMatch('007', 8)).toBe(false);
  });
});

describe('rosterHasBib', () => {
  it('matches a leader or a follower in the same contest', () => {
    expect(rosterHasBib([{ bib: 4 }, { bib: '007' }], 7)).toBe(true);
    expect(rosterHasBib([{ bib: 4 }, { bib: 8 }], 7)).toBe(false);
  });
});

describe('alreadyRegisteredContestMessage', () => {
  it('uses the stored bib and the skill level and competition type', () => {
    const existing = rosterPersonById(
      [
        { id: 'rthumbtest', firstName: 'Reghome', lastName: 'Thumbtest', bib: 7 },
        { id: 'other', firstName: 'Ana', lastName: 'Lopez', bib: 8 },
      ],
      'rthumbtest',
    );
    expect(existing?.bib).toBe(7);
    expect(
      alreadyRegisteredContestMessage([
        {
          name: 'Reghome Thumbtest',
          bib: existing?.bib ?? null,
          contestLabel: contestSkillDivisionLabel({
            skillLevelLabel: 'All-American',
            divisionLabel: 'Jack and Jill',
          }),
        },
      ]),
    ).toBe('Reghome Thumbtest is already registered with Bib # 7 for All-American Jack and Jill.');
  });

  it('matches the roster id even when the new bib is different', () => {
    expect(rosterPersonById([{ id: 'rthumbtest', bib: 7 }], 'rthumbtest')?.bib).toBe(7);
    expect(rosterPersonById([{ id: 'rthumbtest', bib: 7 }], 'someone-else')).toBeUndefined();
  });
});

describe('duplicateContestBibMessage', () => {
  it('names the bib owner and the skill level and competition type', () => {
    const contestLabel = contestSkillDivisionLabel({
      skillLevelLabel: 'All-American',
      divisionLabel: 'Jack and Jill',
    });
    expect(
      duplicateContestBibMessage([
        {
          bib: 7,
          owners: bibOwnerNames(
            [
              { firstName: 'Carlos', lastName: 'Garcia', bib: '007' },
              { firstName: 'Other', lastName: 'Person', bib: 8 },
            ],
            7,
          ),
          contestLabel,
        },
      ]),
    ).toBe('Bib 7 is already assigned to Carlos Garcia for All-American Jack and Jill.');
  });

  it('names every conflicting contest and its bib owner', () => {
    expect(
      duplicateContestBibMessage([
        { bib: 7, owners: ['Carlos Garcia'], contestLabel: 'All-American Jack and Jill' },
        { bib: 7, owners: ['Ana Lopez'], contestLabel: 'Intermediate Strictly' },
      ]),
    ).toBe(
      'Bib 7 is already assigned to Carlos Garcia for All-American Jack and Jill. Bib 7 is already assigned to Ana Lopez for Intermediate Strictly.',
    );
  });
});
