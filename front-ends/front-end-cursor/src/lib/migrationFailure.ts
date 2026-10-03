export type MigrationFailureInfo = {
  message: string;
  detail?: string | null;
  hint?: string | null;
};

export type MigrationFailureReport = {
  cause: string | null;
  steps: string[];
};

function clean(value: string | null | undefined): string {
  return value?.trim() ?? '';
}

export function diagnoseMigrationFailure(
  script: string,
  info: MigrationFailureInfo,
): MigrationFailureReport {
  const message = clean(info.message);
  const detail = clean(info.detail);
  const hint = clean(info.hint);
  const combined = `${message}\n${detail}\n${hint}`;

  const earlier = message.match(/^Apply (.+) first\.$/);
  if (earlier) {
    return {
      cause: `${script} is waiting on ${earlier[1]}, which is still not applied.`,
      steps: [
        `Apply ${earlier[1]} first.`,
        `Apply ${script} again.`,
      ],
    };
  }

  if (/no stored SQL to apply/i.test(message)) {
    return {
      cause: 'The script text is not stored in the database, so Apply cannot run it.',
      steps: [
        'Reload this page so the catalog can pick up the script text.',
        `Apply ${script} again.`,
      ],
    };
  }

  if (/already exists/i.test(combined)) {
    return {
      cause: 'Part of this script is already present in the database, so the script stopped.',
      steps: [
        'Open the statement named in the error and make that step safe to run again, or remove the duplicate object left by a partial run.',
        `Apply ${script} again.`,
      ],
    };
  }

  if (/permission denied|must be owner/i.test(combined)) {
    return {
      cause: 'The database role that runs Apply cannot change that object.',
      steps: [
        'Grant the needed privilege, or run the script as the database owner.',
        `Apply ${script} again.`,
      ],
    };
  }

  if (/syntax error/i.test(combined)) {
    return {
      cause: message || 'The script has a syntax error.',
      steps: [
        `Correct the statement reported in the error in database/migrations/${script}.`,
        `Apply ${script} again.`,
      ],
    };
  }

  if (/does not exist/i.test(combined)) {
    return {
      cause: message || 'A required database object is missing.',
      steps: [
        'Apply the earlier missing scripts in order. The missing object is usually created by one of them.',
        `Apply ${script} again.`,
      ],
    };
  }

  if (/violates|duplicate key|foreign key|check constraint/i.test(combined)) {
    return {
      cause: message || 'Existing data does not satisfy this script.',
      steps: [
        'Correct the rows named in the error.',
        `Apply ${script} again.`,
      ],
    };
  }

  if (hint) {
    return {
      cause: hint,
      steps: [`Apply ${script} again after following that hint.`],
    };
  }

  return { cause: null, steps: [] };
}
