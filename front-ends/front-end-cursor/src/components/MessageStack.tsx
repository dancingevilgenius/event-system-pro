import { Alert, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppMessage, MessageType } from '../types/messages';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

const messageStyles: Record<
  MessageType,
  { bgcolor: string; color: string; borderColor: string }
> = {
  success: {
    bgcolor: '#e8f5e9',
    color: '#1b5e20',
    borderColor: '#2e7d32',
  },
  warning: {
    bgcolor: '#fff8e1',
    color: '#f57f17',
    borderColor: '#f9a825',
  },
  problem: {
    bgcolor: '#ffebee',
    color: '#b71c1c',
    borderColor: '#c62828',
  },
  info: {
    bgcolor: '#e3f2fd',
    color: '#0d47a1',
    borderColor: '#0288d1',
  },
};

const SLIDE_TRANSITION = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };
const COLLAPSE_MS = 350;

type MessageItemProps = {
  message: AppMessage;
  autoDismissMs: number;
  isExiting: boolean;
  exitHeight: number | null;
  onRequestDismiss: (id: string, height: number) => void;
};

function MessageItem({
  message,
  autoDismissMs,
  isExiting,
  exitHeight,
  onRequestDismiss,
}: MessageItemProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const styles = messageStyles[message.type];

  useEffect(() => {
    if (autoDismissMs <= 0 || isExiting) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!wrapperRef.current) {
        return;
      }

      const height = wrapperRef.current.getBoundingClientRect().height;
      onRequestDismiss(message.id, height);
    }, autoDismissMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoDismissMs, isExiting, message.id, onRequestDismiss]);

  const handleClick = () => {
    if (isExiting || !wrapperRef.current) {
      return;
    }

    const height = wrapperRef.current.getBoundingClientRect().height;
    onRequestDismiss(message.id, height);
  };

  return (
    <motion.div
      ref={wrapperRef}
      layout="position"
      initial={{ opacity: 0, y: -12 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        y: 0,
        height: isExiting ? 0 : 'auto',
        marginBottom: isExiting ? 0 : 8,
      }}
      transition={{
        layout: SLIDE_TRANSITION,
        opacity: { duration: 0.2 },
        height: SLIDE_TRANSITION,
        marginBottom: SLIDE_TRANSITION,
        y: { duration: 0.25 },
      }}
      style={{
        overflow: 'hidden',
        height: isExiting && exitHeight !== null ? exitHeight : undefined,
      }}
    >
      <Alert
        onClick={handleClick}
        severity={
          message.type === 'problem'
            ? 'error'
            : message.type === 'warning'
              ? 'warning'
              : message.type === 'info'
                ? 'info'
                : 'success'
        }
        variant="outlined"
        sx={{
          cursor: 'pointer',
          alignItems: 'center',
          bgcolor: styles.bgcolor,
          color: styles.color,
          borderColor: styles.borderColor,
          '& .MuiAlert-icon': {
            color: styles.borderColor,
          },
        }}
      >
        {message.text}
      </Alert>
    </motion.div>
  );
}

type MessageStackProps = {
  messages: AppMessage[];
  autoDismissMs: number;
  onDismiss: (id: string) => void;
};

export default function MessageStack({ messages, autoDismissMs, onDismiss }: MessageStackProps) {
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const [exitHeights, setExitHeights] = useState<Record<string, number>>({});
  const timersRef = useRef<Map<string, number>>(new Map());

  const handleRequestDismiss = useCallback(
    (id: string, height: number) => {
      setExitingIds((current) => {
        if (current.has(id)) {
          return current;
        }

        setExitHeights((heights) => ({ ...heights, [id]: height }));

        const timer = window.setTimeout(() => {
          onDismiss(id);
          setExitingIds((exiting) => {
            const next = new Set(exiting);
            next.delete(id);
            return next;
          });
          setExitHeights((heights) => {
            const next = { ...heights };
            delete next[id];
            return next;
          });
          timersRef.current.delete(id);
        }, COLLAPSE_MS);

        timersRef.current.set(id, timer);

        return new Set(current).add(id);
      });
    },
    [onDismiss],
  );

  if (messages.length === 0) {
    return null;
  }

  return (
    <Box
      aria-live="polite"
      sx={{
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.snackbar,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        px: 2,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          pointerEvents: 'auto',
          position: 'relative',
        }}
      >
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            autoDismissMs={autoDismissMs}
            isExiting={exitingIds.has(message.id)}
            exitHeight={exitHeights[message.id] ?? null}
            onRequestDismiss={handleRequestDismiss}
          />
        ))}
      </div>
    </Box>
  );
}
