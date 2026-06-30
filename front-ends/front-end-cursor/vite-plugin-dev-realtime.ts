import { execFile } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import type { Plugin } from 'vite';

const execFileAsync = promisify(execFile);

const REALTIME_HEALTH_URL = 'http://127.0.0.1:3002/health';
const START_ROUTE = '/__dev__/realtime/start';

const pluginDir = path.dirname(fileURLToPath(import.meta.url));
const composeFile = path.resolve(pluginDir, '../../back-ends/postgrest/docker-compose.yml');

let startPromise: Promise<{ ok: boolean; message: string }> | null = null;

async function isRealtimeHealthy(): Promise<boolean> {
  try {
    const response = await fetch(REALTIME_HEALTH_URL, {
      signal: AbortSignal.timeout(2500),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function startRealtimeService(): Promise<{ ok: boolean; message: string }> {
  if (await isRealtimeHealthy()) {
    return { ok: true, message: 'Realtime service is already running.' };
  }

  if (!startPromise) {
    startPromise = (async () => {
      try {
        await execFileAsync(
          'docker',
          ['compose', '-f', composeFile, 'up', '-d', 'realtime'],
          {
            timeout: 120_000,
            windowsHide: true,
          },
        );

        const deadline = Date.now() + 30_000;
        while (Date.now() < deadline) {
          if (await isRealtimeHealthy()) {
            return { ok: true, message: 'Realtime service started.' };
          }

          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
        }

        return {
          ok: false,
          message: 'Realtime container started but health check did not succeed in time.',
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to start realtime service.';
        return { ok: false, message };
      } finally {
        startPromise = null;
      }
    })();
  }

  return startPromise;
}

function sendJson(
  res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: string) => void },
  statusCode: number,
  body: unknown,
) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

/**
 * Dev-only: POST /__dev__/realtime/start runs docker compose up for the realtime service.
 */
export default function devRealtimePlugin(): Plugin {
  return {
    name: 'dev-realtime-orchestrator',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url !== START_ROUTE) {
          next();
          return;
        }

        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, message: 'Method not allowed.' });
          return;
        }

        void startRealtimeService().then((result) => {
          sendJson(res, result.ok ? 200 : 500, result);
        });
      });
    },
  };
}
