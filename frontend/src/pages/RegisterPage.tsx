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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { clearMessages, showSuccess } = useMessages();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess("Account created. You can sign in now.");
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={pageContainerSx}>
      <Stack sx={centeredContentStackSx} spacing={2.5}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, textAlign: "center" }}
          data-testid="register-title"
        >
          Create account
        </Typography>

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
                label="Full name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                inputProps={{ "data-testid": "register-name" }}
              />
              <AppTextField
                label="Email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                inputProps={{ "data-testid": "register-email" }}
              />
              <AppTextField
                label="Phone"
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))
                }
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 10,
                  "data-testid": "register-phone",
                }}
              />
              <AppTextField
                label="ZIP code"
                value={zip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setZip(e.target.value.replace(/[^\d]/g, "").slice(0, 5))
                }
                inputProps={{
                  inputMode: "numeric",
                  maxLength: 5,
                  "data-testid": "register-zip",
                }}
              />
              <AppTextField
                label="Password"
                type="password"
                isPassword
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                inputProps={{ "data-testid": "register-password" }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                data-testid="register-submit"
              >
                Register
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Box sx={{ textAlign: "center" }}>
          <Link
            component="button"
            underline="hover"
            onClick={() => navigate("/")}
            data-testid="link-back-to-login"
            sx={{ fontWeight: 600 }}
          >
            Back to Sign in
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
