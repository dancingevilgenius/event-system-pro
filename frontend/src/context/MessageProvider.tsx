import {
  createContext,
  useCallback,
  useState,
  type ReactNode,
} from "react";

export type MessageType = "success" | "warning" | "problem";

export interface Message {
  id: string;
  type: MessageType;
  text: string;
}

interface MessageCtx {
  messages: Message[];
  showSuccess: (text: string) => string;
  showWarning: (text: string) => string;
  showProblem: (text: string) => string;
  clearMessages: () => void;
  dismissMessage: (id: string) => void;
}

export const MessageContext = createContext<MessageCtx | null>(null);

let counter = 0;
const nextId = () => {
  counter += 1;
  return `msg-${Date.now()}-${counter}`;
};

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const push = useCallback((type: MessageType, text: string): string => {
    const id = nextId();
    setMessages((prev) => [...prev, { id, type, text }]);
    return id;
  }, []);

  const showSuccess = useCallback((t: string) => push("success", t), [push]);
  const showWarning = useCallback((t: string) => push("warning", t), [push]);
  const showProblem = useCallback((t: string) => push("problem", t), [push]);

  const clearMessages = useCallback(() => setMessages([]), []);

  const dismissMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const value: MessageCtx = {
    messages,
    showSuccess,
    showWarning,
    showProblem,
    clearMessages,
    dismissMessage,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}
