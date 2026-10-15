import { Box, Button, Typography } from '@mui/material';

type PercentCompleteBarProps = {
  percent: number;
  label?: string;
  onSubmit?: () => void;
  /** Smaller wrapping label so several bars can share one phone row. */
  dense?: boolean;
  /** Fill color once the displayed percent reaches 100. */
  completeColor?: 'success';
};

export default function PercentCompleteBar({
  percent,
  label,
  onSubmit,
  dense = false,
  completeColor,
}: PercentCompleteBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const displayPercent = Math.round(clampedPercent);
  const displayLabel = label ?? `Percent Complete: ${displayPercent}%`;
  const isComplete = displayPercent === 100 && completeColor === 'success';
  const fillColor = isComplete ? 'success.main' : 'primary.main';
  const labelColor =
    clampedPercent > 50 ? (isComplete ? 'success.contrastText' : 'primary.contrastText') : 'text.primary';

  if (onSubmit && clampedPercent >= 100) {
    return (
      <Button variant="contained" fullWidth onClick={onSubmit}>
        Submit
      </Button>
    );
  }

  return (
    <Box
      role="progressbar"
      aria-label={displayLabel}
      aria-valuenow={displayPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      sx={{
        position: 'relative',
        width: '100%',
        height: 40,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'action.hover',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${clampedPercent}%`,
          bgcolor: fillColor,
          transition: 'width 0.3s ease',
        }}
      />

      <Typography
        variant="body2"
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: dense ? 1.15 : undefined,
          px: dense ? 0.25 : 0,
          fontSize: dense ? { xs: '0.7rem', md: '0.875rem' } : undefined,
          color: labelColor,
        }}
      >
        {displayLabel}
      </Typography>
    </Box>
  );
}
