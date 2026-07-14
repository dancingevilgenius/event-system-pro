import { loadSession } from '../lib/session';

const POSTGREST_URL =
  import.meta.env.VITE_POSTGREST_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000');

const POC_COUNTER_LABEL = 'poc_counter';

function buildAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const token = loadSession()?.token;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export function getRealtimeWsUrl(): string {
  const configured = import.meta.env.VITE_REALTIME_WS_URL;
  if (typeof configured === 'string' && configured.trim() !== '') {
    return configured.trim();
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/realtime/ws`;
}

function getRealtimeHealthUrl(): string {
  if (import.meta.env.DEV) {
    return '/realtime/health';
  }

  const configured = import.meta.env.VITE_REALTIME_WS_URL;
  if (typeof configured === 'string' && configured.trim() !== '') {
    const url = new URL(configured.trim());
    url.pathname = '/health';
    url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:';
    return url.toString();
  }

  const protocol = window.location.protocol;
  return `${protocol}//${window.location.host}/realtime/health`;
}

export async function isRealtimeHealthy(): Promise<boolean> {
  try {
    const response = await fetch(getRealtimeHealthUrl(), {
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

let ensureRealtimePromise: Promise<boolean> | null = null;

/** Dev-only: verify realtime is up; ask the Vite dev server to start Docker if not. */
export async function ensureRealtimeService(): Promise<boolean> {
  if (!import.meta.env.DEV) {
    return isRealtimeHealthy();
  }

  if (await isRealtimeHealthy()) {
    return true;
  }

  if (!ensureRealtimePromise) {
    ensureRealtimePromise = (async () => {
      try {
        const response = await fetch('/__dev__/realtime/start', {
          method: 'POST',
          signal: AbortSignal.timeout(130_000),
        });
        const result = (await response.json()) as { ok?: boolean };
        return response.ok && result.ok === true;
      } catch {
        return false;
      } finally {
        ensureRealtimePromise = null;
      }
    })();
  }

  return ensureRealtimePromise;
}

export async function fetchPocCounter(): Promise<number> {
  const params = new URLSearchParams({
    label: `eq.${POC_COUNTER_LABEL}`,
    select: 'value',
    limit: '1',
  });

  const response = await fetch(`${POSTGREST_URL}/system_config?${params.toString()}`, {
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Unable to load counter (${response.status})`);
  }

  const records = (await response.json()) as Array<{ value?: unknown }>;
  const rawValue = records[0]?.value;

  if (typeof rawValue === 'number') {
    return Number.isFinite(rawValue) ? rawValue : 0;
  }

  if (typeof rawValue === 'string') {
    const parsed = Number.parseInt(rawValue, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}
