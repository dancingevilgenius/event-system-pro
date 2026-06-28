import { useEffect, useState } from 'react';
import { fetchPocCounter, getRealtimeWsUrl } from '../api/realtime';

type PocCounterMessage = {
  type?: string;
  value?: string | number;
};

export function usePocCounter() {
  const [counter, setCounter] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;

    const applyCounterValue = (value: string | number | undefined) => {
      const parsed = Number.parseInt(String(value ?? '0'), 10);
      setCounter(Number.isFinite(parsed) ? parsed : 0);
    };

    const connect = () => {
      socket = new WebSocket(getRealtimeWsUrl());

      socket.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(String(event.data)) as PocCounterMessage;
          if (message.type === 'poc_counter') {
            applyCounterValue(message.value);
          }
        } catch {
          // Ignore malformed messages.
        }
      });

      socket.addEventListener('close', () => {
        if (!active) {
          return;
        }

        reconnectTimer = window.setTimeout(connect, 3000);
      });
    };

    void fetchPocCounter()
      .then((value) => {
        if (!active) {
          return;
        }

        setCounter(value);
        setError(null);
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load counter.');
      });

    connect();

    return () => {
      active = false;

      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
      }

      socket?.close();
    };
  }, []);

  return { counter, error };
}
