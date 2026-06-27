import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import {
  clearFlashSuccess,
  clearFlashWarning,
  peekFlashSuccess,
  peekFlashWarning,
  setFlashSuccess,
  setFlashWarning,
  type LoginFlashState,
} from '../lib/authMessages';

export default function LoginFlashHandler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { messages, showSuccess, showWarning } = useMessages();

  useEffect(() => {
    const pendingWarning = peekFlashWarning();
    if (pendingWarning) {
      if (!messages.some((message) => message.text === pendingWarning)) {
        showWarning(pendingWarning);
      }
      return;
    }

    const pendingSuccess = peekFlashSuccess();
    if (pendingSuccess) {
      if (!messages.some((message) => message.text === pendingSuccess)) {
        showSuccess(pendingSuccess);
      }
      return;
    }

    const flash = location.state as LoginFlashState | null;
    if (flash?.flashSuccess) {
      setFlashSuccess(flash.flashSuccess);
      showSuccess(flash.flashSuccess);
      navigate('.', { replace: true, state: null });
      return;
    }

    if (flash?.flashWarning) {
      setFlashWarning(flash.flashWarning);
      showWarning(flash.flashWarning);
      navigate('.', { replace: true, state: null });
    }
  }, [location.pathname, location.state, messages, navigate, showSuccess, showWarning]);

  useEffect(() => {
    const pendingWarning = peekFlashWarning();
    if (pendingWarning && messages.some((message) => message.text === pendingWarning)) {
      clearFlashWarning();
    }

    const pendingSuccess = peekFlashSuccess();
    if (pendingSuccess && messages.some((message) => message.text === pendingSuccess)) {
      clearFlashSuccess();
    }
  }, [messages]);

  return null;
}
