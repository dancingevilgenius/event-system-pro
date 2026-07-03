import { createContext } from 'react';
import type { AppMessage, MessageType } from '../types/messages';

export type MessageContextValue = {
  messages: AppMessage[];
  messageAutoDismissMs: number;
  setMessageAutoDismissMs: (ms: number) => void;
  showMessage: (type: MessageType, text: string) => string;
  showSuccess: (text: string) => string;
  showWarning: (text: string) => string;
  showProblem: (text: string) => string;
  showInfo: (text: string) => string;
  dismissMessage: (id: string) => void;
  clearMessages: () => void;
};

export const MessageContext = createContext<MessageContextValue | null>(null);
