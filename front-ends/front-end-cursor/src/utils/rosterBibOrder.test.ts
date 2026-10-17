import { describe, expect, it } from 'vitest';
import { compareRosterByBib } from './rosterBibOrder';

describe('compareRosterByBib', () => {
  it('sorts bibs ascending and puts missing bibs last', () => {
    const people = [
      { id: 'c', bib: 12 },
      { id: 'a', bib: undefined },
      { id: 'b', bib: 2 },
      { id: 'd' },
      { id: 'e', bib: 2 },
    ];
    const ordered = [...people].sort(compareRosterByBib);
    expect(ordered.map((person) => person.id)).toEqual(['b', 'e', 'c', 'a', 'd']);
  });
});
