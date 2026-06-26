export type Sex = "male" | "female";

export interface CharacterName {
  first: string;
  last: string;
  sex: Sex;
}

// Legion of Super-Heroes (DC) — civilian names
const LEGION: CharacterName[] = [
  { first: "Rokk", last: "Krinn", sex: "male" },
  { first: "Garth", last: "Ranzz", sex: "male" },
  { first: "Imra", last: "Ardeen", sex: "female" },
  { first: "Querl", last: "Dox", sex: "male" },
  { first: "Thom", last: "Kallor", sex: "male" },
  { first: "Luornu", last: "Durgo", sex: "female" },
  { first: "Tinya", last: "Wazzo", sex: "female" },
  { first: "Jan", last: "Arrah", sex: "male" },
  { first: "Dirk", last: "Morgna", sex: "male" },
  { first: "Lyle", last: "Norg", sex: "male" },
  { first: "Chuck", last: "Taine", sex: "male" },
  { first: "Jo", last: "Nah", sex: "male" },
  { first: "Lar", last: "Gand", sex: "male" },
  { first: "Salu", last: "Digby", sex: "female" },
  { first: "Reep", last: "Daggle", sex: "male" },
  { first: "Gim", last: "Allon", sex: "male" },
  { first: "Ayla", last: "Ranzz", sex: "female" },
  { first: "Nura", last: "Nal", sex: "female" },
  { first: "Val", last: "Armorr", sex: "male" },
  { first: "Wilimena", last: "Morgna", sex: "female" },
  { first: "Brin", last: "Londo", sex: "male" },
  { first: "Drake", last: "Burroughs", sex: "male" },
  { first: "Troy", last: "Stewart", sex: "male" },
  { first: "Mysa", last: "Nal", sex: "female" },
  { first: "Pol", last: "Krinn", sex: "male" },
  { first: "Lydda", last: "Jath", sex: "female" },
  { first: "Dag", last: "Wentim", sex: "male" },
  { first: "Jenni", last: "Ognats", sex: "female" },
  { first: "Laurel", last: "Gand", sex: "female" },
  { first: "Jazmin", last: "Cullen", sex: "female" },
  { first: "Brek", last: "Bannin", sex: "male" },
  { first: "Tasmia", last: "Mallor", sex: "female" },
  { first: "Cham", last: "Voxv", sex: "male" },
  { first: "Condo", last: "Arlik", sex: "male" },
];

// Shi'ar Imperial Guard (Marvel)
const SHIAR: CharacterName[] = [
  { first: "Kallark", last: "Imperius", sex: "male" },
  { first: "Sybyl", last: "Dvorak", sex: "female" },
  { first: "Magdelene", last: "Plutonia", sex: "female" },
  { first: "Tarianna", last: "Starbolt", sex: "female" },
  { first: "Yrn", last: "Tolarian", sex: "male" },
  { first: "Astra", last: "Vapora", sex: "female" },
  { first: "Harkon", last: "Lukas", sex: "male" },
  { first: "Sissien", last: "Nightside", sex: "female" },
  { first: "Yrik", last: "Marrai", sex: "male" },
  { first: "Vril", last: "Rokk", sex: "male" },
  { first: "Sk'iir", last: "Tempest", sex: "male" },
  { first: "Cassandra", last: "Webb", sex: "female" },
  { first: "Karza", last: "Voloxtra", sex: "male" },
  { first: "Mentor", last: "Aelfyre", sex: "male" },
  { first: "Sela", last: "Boltus", sex: "female" },
  { first: "Vanth", last: "Dreadstar", sex: "male" },
  { first: "Lilandra", last: "Neramani", sex: "female" },
  { first: "Deathbird", last: "Cal'syee", sex: "female" },
  { first: "Mantis", last: "Velorus", sex: "female" },
  { first: "Talon", last: "Krait", sex: "male" },
  { first: "Pyra", last: "Solas", sex: "female" },
  { first: "Glomulus", last: "Vurr", sex: "male" },
];

export const ALL_CHARACTERS: CharacterName[] = [...LEGION, ...SHIAR];

const EXCLUDED_WORDS = ["boy", "girl", "lad", "lass", "ladd", "man", "woman"];

function hasExcludedWord(name: string): boolean {
  const tokens = name.toLowerCase().split(/[^a-z]+/);
  return tokens.some((t) => EXCLUDED_WORDS.includes(t));
}

export function getEligibleCharacters(): CharacterName[] {
  return ALL_CHARACTERS.filter(
    (c) => !hasExcludedWord(c.first) && !hasExcludedWord(c.last)
  );
}
