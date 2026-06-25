/** First and last names of Legion of Super-Heroes members (DC). */
const LEGION_MEMBER_NAMES_RAW = [
  { first: 'Garth', last: 'Ranzz', sex: 'male' },
  { first: 'Imra', last: 'Ardeen', sex: 'female' },
  { first: 'Rokk', last: 'Krinn', sex: 'male' },
  { first: 'Luornu', last: 'Durgo', sex: 'female' },
  { first: 'Reep', last: 'Daggle', sex: 'male' },
  { first: 'Lyle', last: 'Norg', sex: 'male' },
  { first: 'Tinya', last: 'Wazzo', sex: 'female' },
  { first: 'Jo', last: 'Nah', sex: 'male' },
  { first: 'Dirk', last: 'Morgna', sex: 'male' },
  { first: 'Querl', last: 'Dox', sex: 'male' },
  { first: 'Chuck', last: 'Taine', sex: 'male' },
  { first: 'Jan', last: 'Arrah', sex: 'male' },
  { first: 'Salu', last: 'Digby', sex: 'female' },
  { first: 'Gim', last: 'Allon', sex: 'male' },
  { first: 'Thom', last: 'Kallor', sex: 'male' },
  { first: 'Nura', last: 'Nal', sex: 'female' },
  { first: 'Val', last: 'Armorr', sex: 'male' },
  { first: 'Drake', last: 'Burroughs', sex: 'male' },
  { first: 'Troy', last: 'Stewart', sex: 'male' },
  { first: 'Lar', last: 'Gand', sex: 'male' },
  { first: 'Tasmia', last: 'Mallor', sex: 'female' },
  { first: 'Brin', last: 'Londo', sex: 'male' },
  { first: 'Brek', last: 'Bannin', sex: 'male' },
  { first: 'Ayla', last: 'Ranzz', sex: 'female' },
  { first: 'Andrew', last: 'Nolan', sex: 'male' },
  { first: 'Ganglios', last: 'OfHykraius', sex: 'male' },
  { first: 'Mysa', last: 'Nal', sex: 'female' },
  { first: 'Jenni', last: 'Ognats', sex: 'female' },
  { first: 'Tenzil', last: 'Kem', sex: 'male' },
  { first: 'Pol', last: 'Krinn', sex: 'male' },
  { first: 'Devlin', last: "O'Ryan", sex: 'male' },
  { first: 'Dawn', last: 'Allen', sex: 'female' },
  { first: 'Kara', last: 'Zor-El', sex: 'female' },
  { first: 'Mon', last: 'El', sex: 'male' },
  { first: 'Leviathan', last: 'Gim', sex: 'male' },
  { first: 'Bobby', last: 'Lane', sex: 'male' },
  { first: 'Rose', last: 'Forrest', sex: 'female' },
  { first: 'Chemical', last: 'Cozzens', sex: 'male' },
  { first: 'Blok', last: 'Dryad', sex: 'male' },
  { first: 'Shadow', last: 'Lass', sex: 'female' },
] as const;

/** Civilian-style names inspired by Marvel's Shi'ar Imperial Guard. */
const SHIAR_IMPERIAL_GUARD_NAMES_RAW = [
  { first: 'Kallark', last: 'Strontian', sex: 'male' },
  { first: 'Harald', last: 'Quill', sex: 'male' },
  { first: 'Sybil', last: 'Shard', sex: 'female' },
  { first: 'Mira', last: 'Scint', sex: 'female' },
  { first: 'Salique', last: 'Vyr', sex: 'female' },
  { first: 'Xenith', last: 'Kall', sex: 'female' },
  { first: 'Lilandra', last: 'Neramani', sex: 'female' },
  { first: 'Calsyee', last: 'Neramani', sex: 'female' },
  { first: 'Araki', last: 'Chamber', sex: 'male' },
  { first: 'Cerise', last: 'Raf', sex: 'female' },
  { first: 'Kaardum', last: 'Vel', sex: 'male' },
  { first: 'Manta', last: 'Shi', sex: 'female' },
  { first: 'Hussar', last: 'Tor', sex: 'female' },
  { first: 'Astra', last: 'Pha', sex: 'female' },
  { first: 'Pulsar', last: 'Ryn', sex: 'male' },
  { first: 'Neutron', last: 'Hal', sex: 'male' },
  { first: 'Electron', last: 'Vyr', sex: 'male' },
  { first: 'Nightside', last: 'Dar', sex: 'female' },
  { first: 'Fader', last: 'Kyl', sex: 'male' },
  { first: 'Raptor', last: 'Keen', sex: 'female' },
  { first: 'KToth', last: 'Rad', sex: 'male' },
  { first: 'ZCann', last: 'Tre', sex: 'female' },
  { first: 'Titan', last: 'Mass', sex: 'male' },
  { first: 'Izzan', last: 'Verge', sex: 'male' },
  { first: 'Dken', last: 'Neramani', sex: 'male' },
  { first: 'Gerich', last: 'Jal', sex: 'male' },
] as const;

const COMPETITOR_MEMBER_NAMES_RAW = [
  ...LEGION_MEMBER_NAMES_RAW,
  ...SHIAR_IMPERIAL_GUARD_NAMES_RAW,
] as const;

const EXCLUDED_NAME_WORDS = /\b(boy|girl|lass|lad|ladd|man|woman)\b/i;

export type LegionMemberSex = 'male' | 'female';

export type LegionMember = {
  first: string;
  last: string;
  sex: LegionMemberSex;
};

function hasExcludedNameWord(name: string): boolean {
  return EXCLUDED_NAME_WORDS.test(name);
}

export const LEGION_MEMBER_NAMES: LegionMember[] = COMPETITOR_MEMBER_NAMES_RAW.filter(
  (member) =>
    !hasExcludedNameWord(member.first) && !hasExcludedNameWord(member.last),
).map(({ first, last, sex }) => ({ first, last, sex }));

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

type PickRandomLegionMemberOptions = {
  preferSex?: LegionMemberSex;
  preferSexProbability?: number;
  exclude?: LegionMember;
  usedKeys?: ReadonlySet<string>;
};

function buildMemberPool(options: PickRandomLegionMemberOptions): LegionMember[] {
  const { exclude, usedKeys } = options;
  const excludeKey = exclude ? memberKey(exclude) : undefined;

  return LEGION_MEMBER_NAMES.filter((member) => {
    const key = memberKey(member);

    if (excludeKey !== undefined && key === excludeKey) {
      return false;
    }

    if (usedKeys?.has(key)) {
      return false;
    }

    return true;
  });
}

export function pickRandomLegionMember(
  options: PickRandomLegionMemberOptions = {},
): LegionMember {
  const { preferSex, preferSexProbability = 0.9 } = options;

  let pool = buildMemberPool(options);

  if (pool.length === 0) {
    throw new Error('No available competitor names remain in the pool.');
  }

  if (preferSex !== undefined && Math.random() < preferSexProbability) {
    const preferredPool = pool.filter((member) => member.sex === preferSex);

    if (preferredPool.length > 0) {
      pool = preferredPool;
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
