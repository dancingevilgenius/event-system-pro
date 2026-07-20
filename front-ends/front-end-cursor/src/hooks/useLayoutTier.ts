import { useMediaQuery } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';

export const MD_LAYOUT_QUERY = '(min-width:768px)';
export const LG_LAYOUT_QUERY = '(min-width:1024px)';
export const XL_LAYOUT_QUERY = '(min-width:1280px)';

export function useLayoutTier() {
  const showMdLayout = useMediaQuery(MD_LAYOUT_QUERY);
  const showLgLayout = useMediaQuery(LG_LAYOUT_QUERY);
  const showXlLayout = useMediaQuery(XL_LAYOUT_QUERY);
  const showXsLayout = !showMdLayout;

  const containerMaxWidth: Breakpoint = showXlLayout
    ? 'xl'
    : showLgLayout
      ? 'lg'
      : showMdLayout
        ? 'md'
        : 'sm';

  return {
    showXsLayout,
    showMdLayout,
    showLgLayout,
    showXlLayout,
    showCompactTable: showMdLayout && !showLgLayout,
    containerMaxWidth,
  };
}
