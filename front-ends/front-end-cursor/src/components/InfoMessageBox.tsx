import { Alert, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { type ReactNode, useRef, useState } from 'react';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

const infoStyles = {
  bgcolor: '#e3f2fd',
  color: '#0d47a1',
  borderColor: '#0288d1',
} as const;

const SLIDE_TRANSITION = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const };
const COLLAPSE_MS = 350;

type InfoMessageBoxProps = {
  children: ReactNode;
  overlay?: boolean;
};

export default function InfoMessageBox({ children, overlay = false }: InfoMessageBoxProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitHeight, setExitHeight] = useState<number | null>(null);

  const handleClick = () => {
    if (isExiting || !wrapperRef.current) {
      return;
    }

    if (!overlay) {
      const height = wrapperRef.current.getBoundingClientRect().height;
      setExitHeight(height);
    }

    setIsExiting(true);
    window.setTimeout(() => setHidden(true), COLLAPSE_MS);
  };

  if (hidden) {
    return null;
  }

  const message = (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: overlay ? 0 : -12 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        y: 0,
        height: overlay ? 'auto' : isExiting ? 0 : 'auto',
      }}
      transition={{
        opacity: { duration: 0.2 },
        height: overlay ? undefined : SLIDE_TRANSITION,
        y: { duration: 0.25 },
      }}
      style={{
        overflow: overlay ? undefined : 'hidden',
        height: !overlay && isExiting && exitHeight !== null ? exitHeight : undefined,
      }}
    >
      <Alert
        onClick={handleClick}
        severity="info"
        variant="outlined"
        sx={{
          cursor: 'pointer',
          alignItems: 'center',
          bgcolor: infoStyles.bgcolor,
          color: infoStyles.color,
          borderColor: infoStyles.borderColor,
          boxShadow: overlay ? 3 : undefined,
          '& .MuiAlert-icon': {
            color: infoStyles.borderColor,
          },
        }}
      >
        {children}
      </Alert>
    </motion.div>
  );

  if (!overlay) {
    return message;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          pointerEvents: 'auto',
        }}
      >
        {message}
      </Box>
    </Box>
  );
}
