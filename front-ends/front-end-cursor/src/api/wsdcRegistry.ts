const WSDC_REGISTRY_BASE =
  import.meta.env.VITE_WSDC_REGISTRY_URL ??
  (import.meta.env.DEV ? '/wsdc-registry' : 'https://worldsdc.com/wp-json/wsdcregistry/v1');

export type WsdcSuggestion = {
  name: string;
  wscid: number;
};

export type WsdcNameMatch = {
  id?: number;
  first_name: string;
  last_name: string;
  wscid: number;
};

export type WsdcDancerProfile = {
  dancer_first: string;
  dancer_last: string;
  dancer_wsdcid: number | string;
  dominate_role?: string;
  non_dominate_role?: string;
  dominate_required?: string;
  dominate_allowed?: string;
  non_dominate_required?: string;
  non_dominate_allowed?: string;
  short_dominate_role?: string;
  short_non_dominate_role?: string;
  dominate_role_highest_level?: string;
  dominate_role_highest_level_points?: number | string;
  non_dominate_role_highest_level?: string;
  non_dominate_role_highest_level_points?: number | string;
};

export type WsdcFindResult =
  | { type: 'names'; names: WsdcNameMatch[] }
  | (WsdcDancerProfile & { type?: string; names?: undefined });

function registryUrl(path: string): string {
  return `${WSDC_REGISTRY_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

async function fetchRegistryJson<T>(path: string, params: Record<string, string>): Promise<T> {
  const search = new URLSearchParams(params);
  const response = await fetch(`${registryUrl(path)}?${search.toString()}`);

  if (!response.ok) {
    throw new Error(`WSDC registry request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function normalizeWsdcId(value: string | number | null | undefined): string {
  if (value == null) {
    return '';
  }

  return String(value).replace(/\D/g, '');
}

export function isWsdcDancerProfile(value: WsdcFindResult | null): value is WsdcDancerProfile {
  return Boolean(value && 'dancer_wsdcid' in value && value.dancer_wsdcid != null);
}

export function isWsdcNameList(
  value: WsdcFindResult | null,
): value is { type: 'names'; names: WsdcNameMatch[] } {
  return Boolean(value && Array.isArray((value as { names?: unknown }).names));
}

export async function autocompleteWsdcDancers(query: string): Promise<WsdcSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) {
    return [];
  }

  const json = await fetchRegistryJson<unknown>('autocomplete.json', { q });
  if (!Array.isArray(json)) {
    return [];
  }

  return json
    .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === 'object')
    .map((row) => ({
      name: typeof row.name === 'string' ? row.name : '',
      wscid: typeof row.wscid === 'number' ? row.wscid : Number(row.wscid),
    }))
    .filter((row) => row.name && Number.isFinite(row.wscid));
}

export async function findWsdcDancerByQuery(query: string): Promise<WsdcFindResult> {
  return fetchRegistryJson<WsdcFindResult>('find.json', { q: query.trim() });
}

export async function findWsdcDancerById(wsdcId: string | number): Promise<WsdcFindResult> {
  const num = normalizeWsdcId(wsdcId);
  if (!num) {
    throw new Error('WSDC ID is required.');
  }

  return fetchRegistryJson<WsdcFindResult>('find.json', { num });
}

export function buildStoredWsdcInfo(
  wsdcId: string,
  profile: WsdcDancerProfile,
): Record<string, unknown> {
  return {
    wsdc_id: normalizeWsdcId(wsdcId || profile.dancer_wsdcid),
    dancer_first: profile.dancer_first,
    dancer_last: profile.dancer_last,
    dancer_wsdcid: profile.dancer_wsdcid,
    primary_role: profile.dominate_role ?? null,
    secondary_role: profile.non_dominate_role ?? null,
    primary_required: profile.dominate_required ?? null,
    primary_allowed: profile.dominate_allowed ?? null,
    secondary_required: profile.non_dominate_required ?? null,
    secondary_allowed: profile.non_dominate_allowed ?? null,
    short_primary_role: profile.short_dominate_role ?? null,
    short_secondary_role: profile.short_non_dominate_role ?? null,
    primary_role_highest_level: profile.dominate_role_highest_level ?? null,
    primary_role_highest_level_points: profile.dominate_role_highest_level_points ?? null,
    secondary_role_highest_level: profile.non_dominate_role_highest_level ?? null,
    secondary_role_highest_level_points: profile.non_dominate_role_highest_level_points ?? null,
  };
}

export function formatWsdcFetchElapsed(elapsedMs: number): string {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    return '—';
  }

  if (elapsedMs < 1000) {
    return `${Math.round(elapsedMs)} ms`;
  }

  const seconds = elapsedMs / 1000;
  return seconds >= 10 ? `${Math.round(seconds)} s` : `${seconds.toFixed(1)} s`;
}

export function formatWsdcFetchTimingMessage(
  elapsedMs: number,
  action = 'WSDC lookup',
): string {
  return `${action} completed in ${formatWsdcFetchElapsed(elapsedMs)}.`;
}

export function formatWsdcLevelLine(
  roleLabel: string | undefined,
  required: string | undefined,
  allowed: string | undefined,
): string {
  const role = roleLabel?.trim() || 'Role';
  const req = required?.trim();
  const allow = allowed?.trim();

  if (req && allow) {
    return `${role}: Qualified for ${req} or ${allow}`;
  }

  if (req) {
    return `${role}: ${req}`;
  }

  if (allow) {
    return `${role}: Qualified for ${allow}`;
  }

  return `${role}: —`;
}
