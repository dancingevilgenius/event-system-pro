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
import {
  Match,
  SingleEliminationBracket,
  SVGViewer,
  createTheme,
} from '@cm3tahkuh/react-tournament-brackets';
import { useMemo } from 'react';
import CloseIcon from './CloseIcon';
import {
  bracketJsonToTournamentMatches,
  roundLabel,
  serializeBracketState,
  type BracketState,
} from '../utils/tournamentBracket';

type TournamentBracketViewDialogProps = {
  open: boolean;
  onClose: () => void;
  bracket: BracketState;
};

const BRACKET_VIEWER_WIDTH = 960;
const BRACKET_VIEWER_HEIGHT = 520;

export default function TournamentBracketViewDialog({
  open,
  onClose,
  bracket,
}: TournamentBracketViewDialogProps) {
  const theme = useTheme();
  const bracketJson = useMemo(() => serializeBracketState(bracket), [bracket]);
  const tournamentMatches = useMemo(
    () => bracketJsonToTournamentMatches(bracketJson),
    [bracketJson],
  );

  const bracketTheme = useMemo(
    () =>
      createTheme({
        textColor: {
          main: theme.palette.text.primary,
          highlighted: theme.palette.primary.main,
          dark: theme.palette.text.secondary,
          disabled: theme.palette.text.disabled,
        },
        matchBackground: {
          wonColor: theme.palette.success.light,
          lostColor: theme.palette.background.paper,
        },
        border: {
          color: theme.palette.divider,
          highlightedColor: theme.palette.primary.main,
        },
        canvasBackground: theme.palette.background.default,
        connectorColor: theme.palette.divider,
        connectorColorHighlight: theme.palette.primary.main,
        roundHeader: {
          backgroundColor: theme.palette.background.paper,
          fontColor: theme.palette.text.primary,
        },
        roundHeaders: {
          background: theme.palette.action.hover,
        },
        score: {
          text: {
            highlightedWonColor: theme.palette.success.dark,
            highlightedLostColor: theme.palette.text.secondary,
          },
          background: {
            wonColor: theme.palette.success.light,
            lostColor: theme.palette.action.hover,
          },
        },
      }),
    [theme],
  );

  const roundNames = useMemo(
    () => bracketJson.rounds.map((round, index) => round.name || roundLabel(index)),
    [bracketJson.rounds],
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
              overflow: 'hidden',
              minHeight: BRACKET_VIEWER_HEIGHT,
            }}
          >
            <SingleEliminationBracket
              matches={tournamentMatches}
              matchComponent={Match}
              theme={bracketTheme}
              options={{
                style: {
                  roundHeader: {
                    isShown: true,
                    roundTextGenerator: (roundNumber) =>
                      roundNames[roundNumber - 1] ?? `Round ${roundNumber}`,
                  },
                },
              }}
              svgWrapper={({ children, ...props }) => (
                <SVGViewer
                  width={BRACKET_VIEWER_WIDTH}
                  height={BRACKET_VIEWER_HEIGHT}
                  background={theme.palette.background.default}
                  SVGBackground={theme.palette.background.default}
                  {...props}
                >
                  {children}
                </SVGViewer>
              )}
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
