import http from 'http';
import express from 'express';
import pg from 'pg';
import { WebSocketServer } from 'ws';

const {
  PORT = '3002',
  DATABASE_URL,
  POC_COUNTER_LABEL = 'poc_counter',
} = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });
const clients = new Set();

function broadcastJson(payload) {
  const message = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}

function broadcastCounter(value) {
  broadcastJson({ type: 'poc_counter', value });
}

function broadcastAttendeeChange(payloadText) {
  let eventId = null;
  let op = null;

  try {
    const parsed = JSON.parse(payloadText || '{}');
    eventId = Number(parsed.event_id);
    op = typeof parsed.op === 'string' ? parsed.op : null;
  } catch {
    return;
  }

  if (!Number.isFinite(eventId) || eventId <= 0) {
    return;
  }

  broadcastJson({
    type: 'event_attendee_change',
    eventId,
    op,
  });
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

async function startNotifyListener() {
  const listenClient = new pg.Client({ connectionString: DATABASE_URL });
  await listenClient.connect();
  await listenClient.query('LISTEN system_config_poc_counter');
  await listenClient.query('LISTEN event_attendee_change');

  listenClient.on('notification', (message) => {
    if (message.channel === 'system_config_poc_counter') {
      broadcastCounter(message.payload ?? '0');
      return;
    }

    if (message.channel === 'event_attendee_change') {
      broadcastAttendeeChange(message.payload ?? '{}');
    }
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
  console.log('Listening: system_config_poc_counter, event_attendee_change');
});

void startNotifyListener().catch((error) => {
  console.error('failed to start notify listener:', error);
  process.exit(1);
});
