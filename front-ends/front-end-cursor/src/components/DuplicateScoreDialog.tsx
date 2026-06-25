import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from './CloseIcon';

type DuplicateScoreDialogProps = {
  open: boolean;
  currentLeaderFirst: string;
  currentFollowerFirst: string;
  otherLeaderFirst: string;
  otherFollowerFirst: string;
  onClose: () => void;
  onChooseCurrentHigher: () => void;
  onChooseOtherHigher: () => void;
};

export default function DuplicateScoreDialog({
  open,
  currentLeaderFirst,
  currentFollowerFirst,
  otherLeaderFirst,
  otherFollowerFirst,
  onClose,
  onChooseCurrentHigher,
  onChooseOtherHigher,
}: DuplicateScoreDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 0.5,
          pl: 4,
          pr: 4,
          position: 'relative',
        }}
      >
        Duplicate Score
        <IconButton
          aria-label="Close duplicate score dialog"
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

      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Two competitors have the same raw score. Who should rank higher?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', px: 3, pb: 3, pt: 0 }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Button variant="contained" onClick={onChooseCurrentHigher}>
            {`Put ${currentLeaderFirst} and ${currentFollowerFirst} higher`}
          </Button>
          <Button variant="outlined" onClick={onChooseOtherHigher}>
            {`Put ${otherLeaderFirst} and ${otherFollowerFirst} higher`}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
