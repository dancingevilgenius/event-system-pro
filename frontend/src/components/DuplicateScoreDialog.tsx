import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import { CloseIcon } from "@/icons/CloseIcon";

interface Props {
  open: boolean;
  currentLeaderFirst: string;
  currentFollowerFirst: string;
  otherLeaderFirst: string;
  otherFollowerFirst: string;
  onChooseCurrentHigher: () => void;
  onChooseOtherHigher: () => void;
  onClose: () => void;
}

export function DuplicateScoreDialog({
  open,
  currentLeaderFirst,
  currentFollowerFirst,
  otherLeaderFirst,
  otherFollowerFirst,
  onChooseCurrentHigher,
  onChooseOtherHigher,
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      data-testid="duplicate-score-dialog"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <span>Duplicate Score</span>
        <IconButton
          onClick={onClose}
          size="small"
          data-testid="duplicate-dialog-close"
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <Stack spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            onClick={onChooseCurrentHigher}
            data-testid="duplicate-choose-current"
            fullWidth
          >
            Put {currentLeaderFirst} &amp; {currentFollowerFirst} higher
          </Button>
          <Button
            variant="outlined"
            onClick={onChooseOtherHigher}
            data-testid="duplicate-choose-other"
            fullWidth
          >
            Put {otherLeaderFirst} &amp; {otherFollowerFirst} higher
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
