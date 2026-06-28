import { loadSession } from '../lib/session';

const POSTGREST_URL =
  import.meta.env.VITE_POSTGREST_URL ?? 'http://localhost:3000';

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

  const records = (await response.json()) as Array<{ value?: string | null }>;
  const rawValue = records[0]?.value ?? '0';
  const parsed = Number.parseInt(rawValue, 10);

  return Number.isFinite(parsed) ? parsed : 0;
}
