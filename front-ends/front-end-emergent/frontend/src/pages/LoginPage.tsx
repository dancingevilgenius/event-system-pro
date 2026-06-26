import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { centeredContentStackSx, pageContainerSx } from "@/constants/layout";
import { AppTextField } from "@/components/AppTextField";

export default function LoginPage() {
  const navigate = useNavigate();
  const { clearMessages } = useMessages();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <Container maxWidth="sm" sx={pageContainerSx}>
      <Stack sx={centeredContentStackSx} spacing={2.5}>
        <Box sx={{ textAlign: "center", mb: 1 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            data-testid="login-title"
          >
            Event System Pro
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to continue
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
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <AppTextField
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                inputProps={{ "data-testid": "login-email" }}
                autoComplete="email"
              />
              <AppTextField
                label="Password"
                type="password"
                isPassword
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                inputProps={{ "data-testid": "login-password" }}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                data-testid="login-submit"
              >
                Sign In
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link
              component="button"
              underline="hover"
              onClick={() => navigate("/register")}
              data-testid="link-register"
              sx={{ fontWeight: 600 }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
