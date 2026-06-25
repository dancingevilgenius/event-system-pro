import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface PercentCompleteBarProps {
  percent: number;
  onSubmit: () => void;
}

export function PercentCompleteBar({ percent, onSubmit }: PercentCompleteBarProps) {
  const rounded = Math.round(percent);
  const isComplete = rounded >= 100;

  if (isComplete) {
    return (
      <Button
        variant="contained"
        color="success"
        size="large"
        fullWidth
        onClick={onSubmit}
        sx={{ fontWeight: 700, letterSpacing: 0.3 }}
      >
        Submit
      </Button>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontWeight: 600 }}
      >
        Percent Complete: {rounded}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={rounded}
        sx={{
          height: 10,
          borderRadius: 5,
          bgcolor: 'rgba(20,33,61,0.08)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            bgcolor: 'secondary.main',
          },
        }}
      />
    </Box>
  );
}
