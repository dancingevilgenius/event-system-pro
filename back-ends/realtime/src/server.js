import http from 'http';
import express from 'express';
import pg from 'pg';
import { WebSocketServer } from 'ws';

const {
  PORT = '3002',
  DATABASE_URL,
  COUNTER_INTERVAL_MS = '5000',
  POC_COUNTER_LABEL = 'poc_counter',
} = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });
const clients = new Set();
let lastHour = new Date().getHours();

function broadcastCounter(value) {
  const payload = JSON.stringify({ type: 'poc_counter', value });
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(payload);
    }
  }
}

async function readCounterValue(client = pool) {
  const { rows } = await client.query(
    `SELECT value
     FROM public.system_config
     WHERE label = $1
       AND active IS NOT FALSE
     LIMIT 1`,
    [POC_COUNTER_LABEL],
  );

  return rows[0]?.value ?? '0';
}

async function resetCounter() {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE public.system_config
       SET value = '0',
           modified_by = 'realtime',
           modified_date = CURRENT_TIMESTAMP
       WHERE label = $1`,
      [POC_COUNTER_LABEL],
    );
  } finally {
    client.release();
  }
}

async function incrementCounter() {
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE public.system_config
       SET value = (COALESCE(NULLIF(value, ''), '0')::int + 1)::text,
           modified_by = 'realtime',
           modified_date = CURRENT_TIMESTAMP
       WHERE label = $1
         AND active IS NOT FALSE`,
      [POC_COUNTER_LABEL],
    );
  } finally {
    client.release();
  }
}

async function tickCounter() {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour !== lastHour) {
    lastHour = currentHour;
    await resetCounter();
    return;
  }

  await incrementCounter();
}

async function startCounterScheduler() {
  const intervalMs = Number(COUNTER_INTERVAL_MS);
  if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
    throw new Error('COUNTER_INTERVAL_MS must be a positive number');
  }

  setInterval(() => {
    void tickCounter().catch((error) => {
      console.error('counter tick failed:', error);
    });
  }, intervalMs);
}

async function startNotifyListener() {
  const listenClient = new pg.Client({ connectionString: DATABASE_URL });
  await listenClient.connect();
  await listenClient.query('LISTEN system_config_poc_counter');

  listenClient.on('notification', (message) => {
    if (message.channel !== 'system_config_poc_counter') {
      return;
    }

    broadcastCounter(message.payload ?? '0');
  });

  listenClient.on('error', (error) => {
    console.error('notify listener error:', error);
  });

  listenClient.on('end', () => {
    console.error('notify listener disconnected');
  });
}

const app = express();

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server, path: '/ws' });

webSocketServer.on('connection', (socket) => {
  clients.add(socket);

  void readCounterValue()
    .then((value) => {
      socket.send(JSON.stringify({ type: 'poc_counter', value }));
    })
    .catch((error) => {
      console.error('failed to send initial counter:', error);
    });

  socket.on('close', () => {
    clients.delete(socket);
  });
});

server.listen(Number(PORT), () => {
  console.log(`Realtime listening on http://localhost:${PORT}`);
  console.log(`WebSocket path: /ws`);
  console.log(`Counter interval: ${COUNTER_INTERVAL_MS}ms`);
});

void startNotifyListener().catch((error) => {
  console.error('failed to start notify listener:', error);
  process.exit(1);
});

void startCounterScheduler();
