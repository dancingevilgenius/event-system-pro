import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

export type QuickRegisterAllPerson = {
  id: string;
  name: string;
  hint: string | null;
};

type QuickRegisterAllDialogProps = {
  open: boolean;
  people: QuickRegisterAllPerson[];
  skipped: string[];
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function QuickRegisterAllDialog({
  open,
  people,
  skipped,
  busy = false,
  onClose,
  onConfirm,
}: QuickRegisterAllDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="quick-register-all-title"
    >
      <DialogTitle sx={{ position: 'relative', minHeight: 40, p: 1 }}>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          disabled={busy}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="quick-register-all-title">
          Do you want to Quick Register these staff?
        </DialogContentText>
        <Stack component="ul" spacing={0.5} sx={{ mt: 2, mb: 0, pl: 2 }}>
          {people.map((person) => (
            <Typography key={person.id} component="li" variant="body2">
              {person.name}
              {person.hint ? ` — ${person.hint}` : ''}
            </Typography>
          ))}
        </Stack>
        {skipped.length > 0 ? (
          <DialogContentText sx={{ mt: 2 }}>
            {`Not included: ${skipped.join(' ')}`}
          </DialogContentText>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 4, pt: 1, pb: 3 }}>
        <Button type="button" onClick={onClose} disabled={busy} sx={{ minWidth: 96 }}>
          No
        </Button>
        <Button
          type="button"
          variant="contained"
          onClick={onConfirm}
          disabled={busy || people.length === 0}
          sx={{ minWidth: 96 }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
