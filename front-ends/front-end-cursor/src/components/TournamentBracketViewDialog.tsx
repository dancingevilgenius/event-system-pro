import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Bracket } from 'react-bracket-ui';
import { useMemo } from 'react';
import CloseIcon from './CloseIcon';
import {
  bracketStateToUiMatches,
  roundLabel,
  serializeBracketState,
  type BracketState,
} from '../utils/tournamentBracket';

type TournamentBracketViewDialogProps = {
  open: boolean;
  onClose: () => void;
  bracket: BracketState;
};

export default function TournamentBracketViewDialog({
  open,
  onClose,
  bracket,
}: TournamentBracketViewDialogProps) {
  const theme = useTheme();
  const bracketJson = useMemo(() => serializeBracketState(bracket), [bracket]);
  const uiMatches = useMemo(() => bracketStateToUiMatches(bracket), [bracket]);

  const roundNames = Object.fromEntries(
    bracketJson.rounds.map((round, index) => [index + 1, round.name || roundLabel(index)]),
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl">
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
        }}
      >
        <Typography component="span" variant="h6">
          Tournament Bracket
        </Typography>
        <IconButton aria-label="Close bracket view" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {bracketJson.champion && (
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
              Champion: {bracketJson.champion['display-name']} (@{bracketJson.champion.username})
            </Typography>
          )}

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              bgcolor: 'background.default',
              overflow: 'auto',
              minHeight: 480,
            }}
          >
            <Bracket
              matches={uiMatches}
              enableZoomPan
              showRoundNames
              roundNames={roundNames}
              matchWidth={220}
              matchHeight={88}
              gap={28}
              colors={{
                primary: theme.palette.primary.main,
                secondary: theme.palette.text.secondary,
                background: theme.palette.background.paper,
                winner: theme.palette.success.light,
              }}
              style={{ minHeight: 480, padding: 16 }}
            />
          </Box>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Bracket JSON</Typography>
            <TextField
              value={JSON.stringify(bracketJson, null, 2)}
              multiline
              fullWidth
              minRows={8}
              maxRows={16}
              slotProps={{
                input: {
                  readOnly: true,
                  sx: { fontFamily: 'monospace', fontSize: '0.8rem' },
                },
              }}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
