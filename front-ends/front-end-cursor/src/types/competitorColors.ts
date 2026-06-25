export type CompetitorRole = 'leader' | 'follower';

export type CompetitorColorRecord = {
  top: string | null;
  bottom: string | null;
};

export function competitorRecordKey(
  bibNumber: number,
  role: CompetitorRole,
): string {
  return `${bibNumber}|${role}`;
}

export function emptyColorRecord(): CompetitorColorRecord {
  return { top: null, bottom: null };
}

export function colorRecordFromSelection(colors: string[]): CompetitorColorRecord {
  return {
    top: colors[0] ?? null,
    bottom: colors[1] ?? null,
  };
}

export function colorRecordToSelection(
  record: CompetitorColorRecord | undefined,
): string[] {
  if (!record) {
    return [];
  }

  const colors: string[] = [];
  if (record.top) {
    colors.push(record.top);
  }
  if (record.bottom) {
    colors.push(record.bottom);
  }
  return colors;
}

export function hasSelectedColors(record: CompetitorColorRecord | undefined): boolean {
  return Boolean(record?.top || record?.bottom);
}
