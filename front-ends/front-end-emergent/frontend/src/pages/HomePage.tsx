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
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useMessages } from "@/hooks/useMessages";

export default function HomePage() {
  const navigate = useNavigate();
  const { clearMessages, showSuccess, showWarning, showProblem } =
    useMessages();

  const handleTestMessages = () => {
    clearMessages();
    showSuccess("Your change has been saved.");
    showWarning("Your event starts in less than 15 min.");
    showProblem("Your sign in time has passed.");
  };

  return (
    <Container maxWidth="md" sx={pageContainerSx}>
      <Stack sx={centeredContentStackSx} spacing={2.5}>
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            data-testid="home-title"
          >
            Welcome
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Choose a role to continue.
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
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/staff")}
              data-testid="home-staff-btn"
            >
              Staff
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/competitor")}
              data-testid="home-competitor-btn"
            >
              Competitor
            </Button>
          </Stack>
        </Paper>

        <ThemeSwitcher />

        <Stack spacing={1.5}>
          <Button
            variant="outlined"
            onClick={handleTestMessages}
            data-testid="home-test-messages-btn"
          >
            Test Messages
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/")}
            data-testid="home-back-to-login-btn"
          >
            Back to Login
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
