import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { AppRole } from '../lib/session';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import CloseIcon from './CloseIcon';

type ShowRolesDialogProps = {
  open: boolean;
  roles: AppRole[];
  onClose: () => void;
};

export default function ShowRolesDialog({ open, roles, onClose }: ShowRolesDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 0.5,
          pl: 4,
          pr: 4,
          position: 'relative',
        }}
      >
        Your Roles
        <IconButton
          aria-label="Close roles dialog"
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
          {roles.length === 0 ? (
            <Typography variant="body1" color="text.secondary" align="center">
              No roles have been assigned to your account.
            </Typography>
          ) : (
            <List dense disablePadding>
              {roles.map((role) => (
                <ListItem key={role} disableGutters>
                  <ListItemText primary={role} />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
