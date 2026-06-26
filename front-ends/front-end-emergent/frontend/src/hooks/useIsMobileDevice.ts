import { useState, useEffect } from "react";

export function useIsMobileDevice(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return checkMobile();
  });

  useEffect(() => {
    const handler = () => setIsMobile(checkMobile());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
}

function checkMobile(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  if (coarse) return true;
  const narrow = window.innerWidth <= 768;
  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  return narrow && touch;
}
