export type Sex = 'male' | 'female';

export interface Character {
  firstName: string;
  lastName: string;
  sex: Sex;
  /** Which pool this character is drawn from, for reference/debugging only. */
  pool: 'legion' | 'imperial-guard';
}

/**
 * Words whose presence as a WHOLE WORD in the first or last name disqualifies
 * a character from the pool. Checked case-insensitively, word-boundary based,
 * so e.g. "Landry" or "Manhunter" do NOT match "lad"/"man" as substrings —
 * only standalone words do. See isNameAllowed() in nameSelection.ts.
 */
export const EXCLUDED_WORDS = ['boy', 'girl', 'lad', 'lass', 'ladd', 'man', 'woman'];

// Legion of Super-Heroes (DC) — civilian/codename first+last splits chosen so
// none of the EXCLUDED_WORDS appear as whole words in either name.
const LEGION: Character[] = [
  { firstName: 'Rokk', lastName: 'Krinn', sex: 'male', pool: 'legion' }, // Cosmic Boy -> excluded "boy", renamed by codename root only
  { firstName: 'Garth', lastName: 'Ranzz', sex: 'male', pool: 'legion' }, // Lightning Lad -> use civilian name only
  { firstName: 'Imra', lastName: 'Ardeen', sex: 'female', pool: 'legion' }, // Saturn Girl civilian name
  { firstName: 'Brainiac', lastName: 'Five', sex: 'male', pool: 'legion' },
  { firstName: 'Jo', lastName: 'Nah', sex: 'male', pool: 'legion' }, // Ultra Boy civilian
  { firstName: 'Tinya', lastName: 'Wazzo', sex: 'female', pool: 'legion' }, // Phantom Girl civilian
  { firstName: 'Salu', lastName: 'Digby', sex: 'female', pool: 'legion' }, // Chameleon Girl civilian
  { firstName: 'Luornu', lastName: 'Durgo', sex: 'female', pool: 'legion' }, // Triplicate Girl civilian
  { firstName: 'Reep', lastName: 'Daggle', sex: 'male', pool: 'legion' }, // Chameleon Boy civilian
  { firstName: 'Querl', lastName: 'Dox', sex: 'male', pool: 'legion' }, // Brainiac 5 civilian
  { firstName: 'Vi', lastName: 'Vanadium', sex: 'female', pool: 'legion' }, // Live Wire civilian
  { firstName: 'Ayla', lastName: 'Ranzz', sex: 'female', pool: 'legion' }, // Light Lass civilian (sister of Garth)
  { firstName: 'Dirk', lastName: 'Morgna', sex: 'male', pool: 'legion' }, // Sun Boy civilian
  { firstName: 'Mysa', lastName: 'Nal', sex: 'female', pool: 'legion' }, // White Witch
  { firstName: 'Thom', lastName: 'Kallor', sex: 'male', pool: 'legion' }, // Star Boy civilian
  { firstName: 'Nura', lastName: 'Nal', sex: 'female', pool: 'legion' }, // Dream Girl civilian
  { firstName: 'Jan', lastName: 'Arrah', sex: 'male', pool: 'legion' }, // Element Lad civilian
  { firstName: 'Lyle', lastName: 'Norg', sex: 'male', pool: 'legion' }, // Invisible Kid civilian
  { firstName: 'Celeste', lastName: 'Rodgers', sex: 'female', pool: 'legion' }, // Andromeda civilian (created surname)
  { firstName: 'Jacques', lastName: 'Foccart', sex: 'male', pool: 'legion' }, // Invisible Kid II civilian
  { firstName: 'Marla', lastName: 'Latham', sex: 'female', pool: 'legion' }, // Eve civilian (created surname)
  { firstName: 'Gim', lastName: 'Allon', sex: 'male', pool: 'legion' }, // Colossal Boy civilian
  { firstName: 'Shvaughn', lastName: 'Erin', sex: 'female', pool: 'legion' },
  { firstName: 'Tasmia', lastName: 'Mallor', sex: 'female', pool: 'legion' }, // Tasmia (Shadow Lass) civilian
  { firstName: 'Sensor', lastName: 'Tenzil', sex: 'female', pool: 'legion' }, // Princess Projectra alt civilian split
];

// Shi'ar Imperial Guard (Marvel-inspired) — civilian/given names only,
// filtered the same way.
const IMPERIAL_GUARD: Character[] = [
  { firstName: 'Gladiator', lastName: 'Kallark', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Smasher', lastName: 'Izzy', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Oracle', lastName: 'Korath', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Manta', lastName: 'Naro', sex: 'female', pool: 'imperial-guard' }, // first name not "man" as whole word
  { firstName: 'Astra', lastName: 'Vakar', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Flashfire', lastName: 'Kong', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Fang', lastName: 'Razxim', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Plutonia', lastName: 'Vekt', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Mentor', lastName: 'Hojin', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Magique', lastName: 'Lyrane', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Starbolt', lastName: 'Renar', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Electron', lastName: 'Davan', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Tempest', lastName: 'Shi', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Hussar', lastName: 'Tural', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Earthquake', lastName: 'Borrum', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Nightside', lastName: 'Quaal', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Titan', lastName: 'Pulsar', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Webwing', lastName: 'Aerie', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Impulse', lastName: 'Quill', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Stardust', lastName: 'Cassio', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Warstar', lastName: 'Brood', sex: 'male', pool: 'imperial-guard' },
  { firstName: 'Bandit', lastName: 'Korla', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Cassiopeia', lastName: 'Vance', sex: 'female', pool: 'imperial-guard' },
  { firstName: 'Subterfuge', lastName: 'Ondine', sex: 'female', pool: 'imperial-guard' },
];

export const LEGION_POOL: Character[] = LEGION;
export const IMPERIAL_GUARD_POOL: Character[] = IMPERIAL_GUARD;

export const ALL_CHARACTERS: Character[] = [...LEGION_POOL, ...IMPERIAL_GUARD_POOL];
