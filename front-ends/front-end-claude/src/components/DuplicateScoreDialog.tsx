import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CloseIcon } from './icons/CloseIcon';

interface DuplicateScoreDialogProps {
  open: boolean;
  currentLeaderFirst: string;
  currentFollowerFirst: string;
  otherLeaderFirst: string;
  otherFollowerFirst: string;
  score: number;
  onChooseCurrent: () => void;
  onChooseOther: () => void;
  onClose: () => void;
}

export function DuplicateScoreDialog({
  open,
  currentLeaderFirst,
  currentFollowerFirst,
  otherLeaderFirst,
  otherFollowerFirst,
  score,
  onChooseCurrent,
  onChooseOther,
  onClose,
}: DuplicateScoreDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        Duplicate Score
        <IconButton onClick={onClose} aria-label="Dismiss" size="small">
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {currentLeaderFirst} &amp; {currentFollowerFirst} and {otherLeaderFirst} &amp;{' '}
          {otherFollowerFirst} both have a raw score of {score.toFixed(2)}. Which couple should be
          ranked higher?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 1, px: 3, pb: 3 }}>
        <Button variant="contained" color="primary" fullWidth onClick={onChooseCurrent}>
          {currentLeaderFirst} &amp; {currentFollowerFirst} higher
        </Button>
        <Button variant="outlined" color="primary" fullWidth onClick={onChooseOther}>
          {otherLeaderFirst} &amp; {otherFollowerFirst} higher
        </Button>
      </DialogActions>
    </Dialog>
  );
}
