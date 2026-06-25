import TextField, { type TextFieldProps } from '@mui/material/TextField';
import {
  type FocusEvent,
  type MouseEvent,
  useRef,
} from 'react';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

function scrollFocusedInputIntoView(target: HTMLElement) {
  window.setTimeout(() => {
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 300);
}

function isNativeInputElement(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
  );
}

export default function AppTextField({
  onFocus,
  onClick,
  slotProps,
  type,
  ...rest
}: TextFieldProps) {
  const isMobile = useIsMobileDevice();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const htmlInputSlot = slotProps?.htmlInput;
  const htmlInputProps =
    typeof htmlInputSlot === 'function' ? undefined : htmlInputSlot;

  const handleFocus = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (isMobile) {
      scrollFocusedInputIntoView(event.currentTarget);
    }

    onFocus?.(event);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (isMobile && inputRef.current && !isNativeInputElement(event.target)) {
      inputRef.current.focus({ preventScroll: true });
    }

    onClick?.(event);
  };

  const defaultInputMode =
    type === 'password' ? undefined : htmlInputProps?.inputMode ?? 'text';

  return (
    <TextField
      {...rest}
      type={type}
      onFocus={handleFocus}
      onClick={handleClick}
      inputRef={inputRef}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...htmlInputProps,
          ...(defaultInputMode ? { inputMode: defaultInputMode } : {}),
          enterKeyHint:
            htmlInputProps?.enterKeyHint ?? (rest.multiline ? 'enter' : 'done'),
        },
      }}
    />
  );
}
