import { useContext } from "react";
import { MessageContext } from "@/context/MessageProvider";

export function useMessages() {
  const ctx = useContext(MessageContext);
  if (!ctx) {
    throw new Error("useMessages must be used inside MessageProvider");
  }
  return ctx;
}
