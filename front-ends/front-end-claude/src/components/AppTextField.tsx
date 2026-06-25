import { useRef } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Box from '@mui/material/Box';

export type AppTextFieldProps = TextFieldProps & {
  /** Numeric input mode for phone/zip-style fields. */
  numeric?: boolean;
  /** Caps input length, primarily for phone/zip fields. */
  maxLength?: number;
};

/**
 * Shared text field used across Login / Register.
 * - Scrolls the focused field into view when the on-screen keyboard opens
 * - Tapping anywhere in the field's container focuses the input
 * - Default enterKeyHint: "done" for single-line, "enter" for multiline
 * - Default inputMode: "text" (password fields excluded); numeric fields
 *   use inputMode "numeric" with an optional maxLength
 */
export function AppTextField({
  numeric = false,
  maxLength,
  multiline,
  type,
  slotProps,
  ...rest
}: AppTextFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    // Give the on-screen keyboard a moment to open before scrolling.
    window.setTimeout(() => {
      e.target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 250);
  };

  const isPassword = type === 'password';
  const enterKeyHint = multiline ? 'enter' : 'done';
  const inputMode = numeric ? 'numeric' : isPassword ? undefined : 'text';

  return (
    <Box ref={containerRef} onClick={handleContainerClick} sx={{ width: '100%' }}>
      <TextField
        {...rest}
        type={type}
        multiline={multiline}
        fullWidth
        inputRef={inputRef}
        onFocus={(e) => {
          handleFocus(e);
          rest.onFocus?.(e);
        }}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            inputMode,
            enterKeyHint,
            maxLength,
          },
        }}
      />
    </Box>
  );
}
