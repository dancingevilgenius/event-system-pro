import {
  Container,
  Stack,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { centeredContentStackSx, pageContainerSx } from "@/constants/layout";

export interface ContestButton {
  label: string;
  route?: string;
}

interface Props {
  title: string;
  buttons: ContestButton[];
  testIdPrefix: string;
}

export function ContestSelectionPage({ title, buttons, testIdPrefix }: Props) {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={pageContainerSx}>
      <Stack sx={centeredContentStackSx} spacing={2.5}>
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            data-testid={`${testIdPrefix}-title`}
          >
            {title}
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Stack spacing={1.5}>
            {buttons.map((b, i) => (
              <Button
                key={b.label}
                variant="contained"
                size="large"
                onClick={() => b.route && navigate(b.route)}
                data-testid={`${testIdPrefix}-contest-${i + 1}`}
                disabled={!b.route}
                sx={{
                  "&.Mui-disabled": {
                    opacity: 0.55,
                  },
                }}
              >
                {b.label}
              </Button>
            ))}
          </Stack>
        </Paper>

        <Button
          variant="text"
          onClick={() => navigate("/home")}
          data-testid={`${testIdPrefix}-back-home`}
        >
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
}
