import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 3,
        py: 5,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Choose where you'd like to go.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => navigate('/staff')}
        >
          Staff
        </Button>
      </Box>
    </Box>
  );
}
