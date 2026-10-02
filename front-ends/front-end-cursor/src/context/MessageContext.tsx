import { createContext } from 'react';
import type { AppMessage, MessageType, ShowMessageOptions } from '../types/messages';

export type MessageContextValue = {
  messages: AppMessage[];
  messageAutoDismissMs: number;
  setMessageAutoDismissMs: (ms: number) => void;
  showMessage: (type: MessageType, text: string, options?: ShowMessageOptions) => string;
  showSuccess: (text: string, options?: ShowMessageOptions) => string;
  showWarning: (text: string, options?: ShowMessageOptions) => string;
  showProblem: (text: string, options?: ShowMessageOptions) => string;
  showInfo: (text: string, options?: ShowMessageOptions) => string;
  dismissMessage: (id: string) => void;
  clearMessages: () => void;
};

export const MessageContext = createContext<MessageContextValue | null>(null);
