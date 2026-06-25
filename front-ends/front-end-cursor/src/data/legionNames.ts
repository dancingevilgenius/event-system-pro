/** First and last names of Legion of Super-Heroes members (DC). */
const LEGION_MEMBER_NAMES_RAW = [
  { first: 'Garth', last: 'Ranzz' },
  { first: 'Imra', last: 'Ardeen' },
  { first: 'Rokk', last: 'Krinn' },
  { first: 'Luornu', last: 'Durgo' },
  { first: 'Reep', last: 'Daggle' },
  { first: 'Lyle', last: 'Norg' },
  { first: 'Tinya', last: 'Wazzo' },
  { first: 'Jo', last: 'Nah' },
  { first: 'Dirk', last: 'Morgna' },
  { first: 'Querl', last: 'Dox' },
  { first: 'Chuck', last: 'Taine' },
  { first: 'Jan', last: 'Arrah' },
  { first: 'Salu', last: 'Digby' },
  { first: 'Gim', last: 'Allon' },
  { first: 'Thom', last: 'Kallor' },
  { first: 'Nura', last: 'Nal' },
  { first: 'Val', last: 'Armorr' },
  { first: 'Drake', last: 'Burroughs' },
  { first: 'Troy', last: 'Stewart' },
  { first: 'Lar', last: 'Gand' },
  { first: 'Tasmia', last: 'Mallor' },
  { first: 'Brin', last: 'Londo' },
  { first: 'Brek', last: 'Bannin' },
  { first: 'Ayla', last: 'Ranzz' },
  { first: 'Andrew', last: 'Nolan' },
  { first: 'Ganglios', last: 'OfHykraius' },
  { first: 'Mysa', last: 'Nal' },
  { first: 'Jenni', last: 'Ognats' },
  { first: 'Tenzil', last: 'Kem' },
  { first: 'Pol', last: 'Krinn' },
  { first: 'Devlin', last: "O'Ryan" },
  { first: 'Dawn', last: 'Allen' },
  { first: 'Kara', last: 'Zor-El' },
  { first: 'Mon', last: 'El' },
  { first: 'Leviathan', last: 'Gim' },
  { first: 'Bobby', last: 'Lane' },
  { first: 'Rose', last: 'Forrest' },
  { first: 'Chemical', last: 'Cozzens' },
  { first: 'Blok', last: 'Dryad' },
  { first: 'Shadow', last: 'Lass' },
] as const;

const EXCLUDED_NAME_WORDS = /\b(boy|girl|lass|lad|ladd)\b/i;

export type LegionMember = {
  first: string;
  last: string;
};

function hasExcludedNameWord(name: string): boolean {
  return EXCLUDED_NAME_WORDS.test(name);
}

export const LEGION_MEMBER_NAMES: LegionMember[] = LEGION_MEMBER_NAMES_RAW.filter(
  (member) =>
    !hasExcludedNameWord(member.first) && !hasExcludedNameWord(member.last),
);

export function formatInitialLast(first: string, last: string): string {
  return `${first.charAt(0)}. ${last}`;
}

export function formatFullFirstLast(first: string, last: string): string {
  return `${first} ${last}`;
}

export function formatCompetitorPair(
  leader: LegionMember,
  follower: LegionMember,
  useFullFirst: boolean,
): string {
  return formatCompetitorPairNames(leader, follower, {
    leaderFullFirst: useFullFirst,
    followerFullFirst: useFullFirst,
  });
}

export function formatCompetitorPairNames(
  leader: LegionMember,
  follower: LegionMember,
  options: { leaderFullFirst: boolean; followerFullFirst: boolean },
): string {
  const formatName = (first: string, last: string, useFullFirst: boolean) =>
    useFullFirst ? formatFullFirstLast(first, last) : formatInitialLast(first, last);

  return `${formatName(leader.first, leader.last, options.leaderFullFirst)} · ${formatName(follower.first, follower.last, options.followerFullFirst)}`;
}

export function memberKey(member: LegionMember): string {
  return `${member.first}|${member.last}`;
}
