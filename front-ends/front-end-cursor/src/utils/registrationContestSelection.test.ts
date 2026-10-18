import { describe, expect, it } from 'vitest';
import { checkedIdsForContestLoad } from './registrationContestSelection';

describe('checkedIdsForContestLoad', () => {
  it('checks the only contest when the loaded list has exactly one', () => {
    expect(checkedIdsForContestLoad(['contest-42'])).toEqual({ 'contest-42': true });
  });

  it('leaves every box unchecked when the list is empty or has more than one contest', () => {
    expect(checkedIdsForContestLoad([])).toEqual({});
    expect(checkedIdsForContestLoad(['contest-1', 'contest-2'])).toEqual({});
  });
});
