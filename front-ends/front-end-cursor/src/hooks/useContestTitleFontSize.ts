import { useEffect, useState } from 'react';

/** Phone and small-tablet couple names in a contest row title. */
export const CONTEST_TITLE_FONT_SIZE = { xs: '0.8125rem', md: '1rem' } as const;

/** iPad 9.7-inch and larger screens, matching Prelims row titles. */
export const LARGE_SCREEN_CONTEST_TITLE_FONT_SIZE = '1.5rem';

const IPAD_97_MIN_CSS_PX = 768;

export type ContestTitleFontSize =
  | typeof CONTEST_TITLE_FONT_SIZE
  | typeof LARGE_SCREEN_CONTEST_TITLE_FONT_SIZE;

function detectIpad97OrLargerScreen(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return Math.min(window.screen.width, window.screen.height) >= IPAD_97_MIN_CSS_PX;
}

export function useIpad97OrLargerScreen(): boolean {
  const [matches, setMatches] = useState(detectIpad97OrLargerScreen);

  useEffect(() => {
    const update = () => setMatches(detectIpad97OrLargerScreen());

    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);

    return () => {
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return matches;
}
