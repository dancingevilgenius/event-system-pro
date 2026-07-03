import { type ReactNode, useCallback, useMemo, useState } from 'react';
import MessageStack from '../components/MessageStack';
import {
  isMessageAutoDismissMs,
  readStoredMessageAutoDismissMs,
  storeMessageAutoDismissMs,
} from '../lib/messagePreferences';
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
  const [messageAutoDismissMs, setMessageAutoDismissMsState] = useState(readStoredMessageAutoDismissMs);

  const setMessageAutoDismissMs = useCallback((ms: number) => {
    if (!isMessageAutoDismissMs(ms)) {
      return;
    }

    setMessageAutoDismissMsState(ms);
    storeMessageAutoDismissMs(ms);
  }, []);

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

  const showInfo = useCallback(
    (text: string) => showMessage('info', text),
    [showMessage],
  );

  const value = useMemo(
    () => ({
      messages,
      messageAutoDismissMs,
      setMessageAutoDismissMs,
      showMessage,
      showSuccess,
      showWarning,
      showProblem,
      showInfo,
      dismissMessage,
      clearMessages,
    }),
    [
      messages,
      messageAutoDismissMs,
      setMessageAutoDismissMs,
      showMessage,
      showSuccess,
      showWarning,
      showProblem,
      showInfo,
      dismissMessage,
      clearMessages,
    ],
  );

  return (
    <MessageContext.Provider value={value}>
      {children}
      <MessageStack
        messages={messages}
        autoDismissMs={messageAutoDismissMs}
        onDismiss={dismissMessage}
      />
    </MessageContext.Provider>
  );
}
