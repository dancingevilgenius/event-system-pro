import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import PercentCompleteBar from './PercentCompleteBar';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import { usePageTraining } from '../hooks/usePageTraining';
import { placeTrainingCoach, type TrainingCoachPoint } from '../lib/pageTraining';

const ENTRY_ROW_SELECTOR = '[data-prelims-entry]';

type DragState = {
  pointerId: number;
  originX: number;
  originY: number;
  startX: number;
  startY: number;
};

function clampPosition(point: TrainingCoachPoint, panel: HTMLElement): TrainingCoachPoint {
  const margin = 8;
  const maxX = Math.max(margin, window.innerWidth - panel.offsetWidth - margin);
  const maxY = Math.max(margin, window.innerHeight - panel.offsetHeight - margin);
  return {
    x: Math.min(maxX, Math.max(margin, point.x)),
    y: Math.min(maxY, Math.max(margin, point.y)),
  };
}

export default function PageTrainingCoach() {
  const { coachVisible, instructionText, progressPercent, progressLabel, restartLesson, restartNonce } =
    usePageTraining();
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const placedByUserRef = useRef(false);
  const seenRestartNonce = useRef(restartNonce);
  const [position, setPosition] = useState<TrainingCoachPoint | null>(null);

  useLayoutEffect(() => {
    if (!coachVisible) {
      placedByUserRef.current = false;
      setPosition(null);
      return;
    }

    if (seenRestartNonce.current !== restartNonce) {
      seenRestartNonce.current = restartNonce;
      placedByUserRef.current = false;
    }

    const frame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel || placedByUserRef.current) {
        return;
      }

      const reservedRects = [...document.querySelectorAll(ENTRY_ROW_SELECTOR)]
        .slice(0, 2)
        .map((row) => {
          const rect = row.getBoundingClientRect();
          return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
        });

      setPosition(
        placeTrainingCoach({
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          panelWidth: panel.offsetWidth,
          panelHeight: panel.offsetHeight,
          reservedRects,
        }),
      );
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [coachVisible, instructionText, restartNonce]);

  if (!coachVisible) {
    return null;
  }

  const onHandlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !position || !panelRef.current) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const onHandlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const panel = panelRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !panel) {
      return;
    }

    placedByUserRef.current = true;
    setPosition(
      clampPosition(
        {
          x: drag.startX + event.clientX - drag.originX,
          y: drag.startY + event.clientY - drag.originY,
        },
        panel,
      ),
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  return (
    <Box
      ref={panelRef}
      sx={{
        position: 'fixed',
        top: position?.y ?? -9999,
        left: position?.x ?? 16,
        zIndex: (theme) => theme.zIndex.snackbar,
        width: { xs: `min(100% - 32px, ${CONTENT_MAX_WIDTH}px)`, md: 420 },
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      <Stack
        spacing={1}
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          boxShadow: 6,
        }}
      >
        <Box
          role="button"
          aria-label="Drag training panel"
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          sx={{
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Training
          </Typography>
        </Box>
        <TextField
          value={instructionText}
          multiline
          minRows={2}
          fullWidth
          slotProps={{
            htmlInput: {
              readOnly: true,
              'aria-label': 'Training instruction',
            },
          }}
        />
        <PercentCompleteBar percent={progressPercent} label={progressLabel} />
        <Button variant="outlined" onClick={restartLesson}>
          Restart
        </Button>
      </Stack>
    </Box>
  );
}
