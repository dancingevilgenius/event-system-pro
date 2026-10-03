export function pendingMigrationsMessage(pendingCount: number): string | null {
  if (!Number.isFinite(pendingCount) || pendingCount <= 0) {
    return null;
  }

  return `This environment needs to apply ${pendingCount} Migrations`;
}
