import { useState, useEffect, useRef } from "react";
import {
  Box,
  Alert,
  Collapse,
  Slide,
} from "@mui/material";
import { useMessages } from "@/hooks/useMessages";
import { CONTENT_MAX_WIDTH } from "@/constants/layout";
import type { Message, MessageType } from "@/context/MessageProvider";

const COLLAPSE_MS = 350;

const severityFor = (
  t: MessageType
): "success" | "warning" | "error" =>
  t === "success" ? "success" : t === "warning" ? "warning" : "error";

interface RowProps {
  message: Message;
  onRemove: (id: string) => void;
}

function MessageRow({ message, onRemove }: RowProps) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    setOpen(true);
    mountedRef.current = true;
  }, []);

  const handleClick = () => {
    setShown(false);
  };

  const handleExited = () => {
    if (!shown) {
      onRemove(message.id);
    }
  };

  return (
    <Collapse
      in={shown}
      timeout={COLLAPSE_MS}
      onExited={handleExited}
      sx={{ width: "100%" }}
    >
      <Slide direction="down" in={open} mountOnEnter unmountOnExit>
        <Box
          data-testid={`message-${message.type}`}
          onClick={handleClick}
          sx={{ cursor: "pointer", mb: 1 }}
        >
          <Alert
            variant="outlined"
            severity={severityFor(message.type)}
            sx={{
              alignItems: "center",
              borderWidth: 1.5,
              fontWeight: 500,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "background.paper"
                  : "background.paper",
            }}
          >
            {message.text}
          </Alert>
        </Box>
      </Slide>
    </Collapse>
  );
}

export function MessageStack() {
  const { messages, dismissMessage } = useMessages();

  if (messages.length === 0) return null;

  return (
    <Box
      data-testid="message-stack"
      role="region"
      aria-live="polite"
      sx={{
        position: "fixed",
        top: 16,
        left: 0,
        right: 0,
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: `${CONTENT_MAX_WIDTH}px`,
          pointerEvents: "auto",
        }}
      >
        {messages.map((m) => (
          <MessageRow key={m.id} message={m} onRemove={dismissMessage} />
        ))}
      </Box>
    </Box>
  );
}
