import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';

type QuickRegisterDialogProps = {
  open: boolean;
  firstName: string;
  detail?: string | null;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function QuickRegisterDialog({
  open,
  firstName,
  detail = null,
  busy = false,
  onClose,
  onConfirm,
}: QuickRegisterDialogProps) {
  const name = firstName.trim();

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="quick-register-title"
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
        <DialogContentText id="quick-register-title">
          Do you want to Quick Register {name}?
        </DialogContentText>
        {detail ? (
          <DialogContentText sx={{ mt: 2 }}>{detail}</DialogContentText>
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
          disabled={busy}
          sx={{ minWidth: 96 }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
