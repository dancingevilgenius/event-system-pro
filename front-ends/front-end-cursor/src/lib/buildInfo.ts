export type GitHubBuildInfo = {
  repository: string;
  branch: string;
  commit: string;
  commitMessage: string;
  buildDate: string | null;
};

function readBuildEnv(name: string): string {
  const value = import.meta.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

export function getGitHubBuildInfo(): GitHubBuildInfo {
  const repository = readBuildEnv('VITE_GITHUB_REPOSITORY');
  const branch = readBuildEnv('VITE_GIT_BRANCH');
  const commit = readBuildEnv('VITE_GIT_COMMIT');
  const commitMessage = readBuildEnv('VITE_GIT_COMMIT_MESSAGE');
  const buildDate = readBuildEnv('VITE_BUILD_DATE');

  return {
    repository: repository || 'unknown',
    branch: branch || 'unknown',
    commit: commit || 'unknown',
    commitMessage: commitMessage || 'Not available',
    buildDate: buildDate || null,
  };
}

export function formatBuildTimestamp(value: string | null): string {
  if (!value) {
    return 'Not available';
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date(parsed));
}
