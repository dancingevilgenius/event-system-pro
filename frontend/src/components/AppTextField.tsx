import { useRef } from "react";
import { TextField } from "@mui/material";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

export function AppTextField(props: any) {
  const {
    enterKeyHint,
    isPassword,
    multiline,
    inputProps,
    onClick,
    ...rest
  } = props;

  const isMobile = useIsMobileDevice();
  const inputRef = useRef<HTMLInputElement>(null);

  const baseInputProps: Record<string, unknown> = { ...(inputProps ?? {}) };

  if (isMobile) {
    baseInputProps.enterKeyHint =
      enterKeyHint ?? (multiline ? "enter" : "done");
    if (!isPassword && !("inputMode" in baseInputProps)) {
      baseInputProps.inputMode = "text";
    }
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
    onClick?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isMobile) {
      setTimeout(() => {
        e.target.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <TextField
      {...rest}
      multiline={multiline}
      inputRef={inputRef}
      slotProps={{ htmlInput: baseInputProps }}
      onClick={handleContainerClick}
      onFocus={handleFocus}
      fullWidth
    />
  );
}
