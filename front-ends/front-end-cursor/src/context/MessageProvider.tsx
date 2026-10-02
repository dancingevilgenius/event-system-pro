import { type ReactNode, useCallback, useMemo, useState } from 'react';
import MessageStack from '../components/MessageStack';
import {
  isMessageAutoDismissMs,
  readStoredMessageAutoDismissMs,
  storeMessageAutoDismissMs,
} from '../lib/messagePreferences';
import type { AppMessage, MessageType, ShowMessageOptions } from '../types/messages';
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
    setMessages((current) => current.filter((message) => message.sticky));
  }, []);

  const showMessage = useCallback((type: MessageType, text: string, options?: ShowMessageOptions) => {
    const id = options?.id ?? createMessageId();
    const sticky = options?.sticky === true;
    const nextMessage: AppMessage = { id, type, text, sticky };

    setMessages((current) => {
      const withoutSameId = current.filter((message) => message.id !== id);
      return [...withoutSameId, nextMessage];
    });

    return id;
  }, []);

  const showSuccess = useCallback(
    (text: string, options?: ShowMessageOptions) => showMessage('success', text, options),
    [showMessage],
  );

  const showWarning = useCallback(
    (text: string, options?: ShowMessageOptions) => showMessage('warning', text, options),
    [showMessage],
  );

  const showProblem = useCallback(
    (text: string, options?: ShowMessageOptions) => showMessage('problem', text, options),
    [showMessage],
  );

  const showInfo = useCallback(
    (text: string, options?: ShowMessageOptions) => showMessage('info', text, options),
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
