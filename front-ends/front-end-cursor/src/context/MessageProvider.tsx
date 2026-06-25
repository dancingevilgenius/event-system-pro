import { type ReactNode, useCallback, useMemo, useState } from 'react';
import MessageStack from '../components/MessageStack';
import type { AppMessage, MessageType } from '../types/messages';
import { MessageContext } from './MessageContext';

type MessageProviderProps = {
  children: ReactNode;
};

function createMessageId(): string {
  return crypto.randomUUID();
}

export default function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<AppMessage[]>([]);

  const dismissMessage = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const showMessage = useCallback((type: MessageType, text: string) => {
    const id = createMessageId();
    setMessages((current) => [...current, { id, type, text }]);
    return id;
  }, []);

  const showSuccess = useCallback(
    (text: string) => showMessage('success', text),
    [showMessage],
  );

  const showWarning = useCallback(
    (text: string) => showMessage('warning', text),
    [showMessage],
  );

  const showProblem = useCallback(
    (text: string) => showMessage('problem', text),
    [showMessage],
  );

  const value = useMemo(
    () => ({
      messages,
      showMessage,
      showSuccess,
      showWarning,
      showProblem,
      dismissMessage,
      clearMessages,
    }),
    [messages, showMessage, showSuccess, showWarning, showProblem, dismissMessage, clearMessages],
  );

  return (
    <MessageContext.Provider value={value}>
      {children}
      <MessageStack messages={messages} onDismiss={dismissMessage} />
    </MessageContext.Provider>
  );
}
