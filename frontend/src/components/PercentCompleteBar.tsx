import { Box, LinearProgress, Button, Typography } from "@mui/material";

interface Props {
  percent: number;
  onSubmit: () => void;
}

export function PercentCompleteBar({ percent, onSubmit }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const isComplete = clamped >= 100;

  if (isComplete) {
    return (
      <Button
        variant="contained"
        color="success"
        fullWidth
        size="large"
        onClick={onSubmit}
        data-testid="submit-judging-btn"
        sx={{ py: 1.5, fontWeight: 700 }}
      >
        Submit
      </Button>
    );
  }

  return (
    <Box data-testid="percent-complete-bar" sx={{ width: "100%" }}>
      <Typography
        variant="caption"
        sx={{ fontWeight: 600, color: "text.secondary" }}
        data-testid="percent-complete-text"
      >
        Percent Complete: {Math.round(clamped)}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={clamped}
        sx={{
          mt: 0.75,
          height: 10,
          borderRadius: 99,
          backgroundColor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 99,
          },
        }}
      />
    </Box>
  );
}
