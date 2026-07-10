import { Box, Typography } from '@mui/material';
import WsdcLookup, { type WsdcLookupProps } from './WsdcLookup';

export type WsdcFindDancerSectionProps = WsdcLookupProps & {
  /** Section heading above the search controls. */
  title?: string;
  /** Short helper text under the title. */
  description?: string;
};

/**
 * Drop-in WSDC registry search block (Find Dancer + results).
 * Reuse this section on any page; pass save handlers via WsdcLookup props when needed.
 */
export default function WsdcFindDancerSection({
  title = 'Find Dancer',
  description = 'Search by name or WSDC #. Duplicate names are resolved by selecting a WSDC # (or open with ?wsdc=12345).',
  enableDirectLink = true,
  ...lookupProps
}: WsdcFindDancerSectionProps) {
  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography variant="h6" component="h2" gutterBottom align="center">
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}
      <WsdcLookup enableDirectLink={enableDirectLink} {...lookupProps} />
    </Box>
  );
}
