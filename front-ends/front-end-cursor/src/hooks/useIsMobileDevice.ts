import { useEffect, useState } from 'react';

function detectMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrowScreen = window.matchMedia('(max-width: 768px)').matches;
  const touchCapable =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return coarsePointer || (narrowScreen && touchCapable);
}

export function useIsMobileDevice(): boolean {
  const [isMobile, setIsMobile] = useState(detectMobileDevice);

  useEffect(() => {
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const narrowQuery = window.matchMedia('(max-width: 768px)');

    const update = () => setIsMobile(detectMobileDevice());

    coarseQuery.addEventListener('change', update);
    narrowQuery.addEventListener('change', update);

    return () => {
      coarseQuery.removeEventListener('change', update);
      narrowQuery.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}
