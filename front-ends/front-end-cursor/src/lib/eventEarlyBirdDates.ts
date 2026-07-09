export type EarlyBirdWindow = {
  id: string;
  startDate: string | null;
  endDate: string | null;
};

export function createEmptyEarlyBirdWindow(): EarlyBirdWindow {
  return {
    id: crypto.randomUUID(),
    startDate: null,
    endDate: null,
  };
}

export function createInitialEarlyBirdWindows(count = 3): EarlyBirdWindow[] {
  return Array.from({ length: count }, () => createEmptyEarlyBirdWindow());
}
