import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchDeploymentInfo, type DeploymentInfo } from '../api/postgrest';
import CloseIcon from './CloseIcon';
import { formatBuildTimestamp, getGitHubBuildInfo } from '../lib/buildInfo';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

const BUILD_INFO_LABEL_SX = {
  fontWeight: 700,
  color: 'text.primary',
} as const;

type BuildInfoDialogProps = {
  open: boolean;
  onClose: () => void;
};

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle1" sx={BUILD_INFO_LABEL_SX}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function BuildInfoDialog({ open, onClose }: BuildInfoDialogProps) {
  const buildInfo = getGitHubBuildInfo();
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(null);
  const [loadingDeployment, setLoadingDeployment] = useState(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setLoadingDeployment(true);
    setDeploymentError(null);

    fetchDeploymentInfo()
      .then((info) => {
        if (!cancelled) {
          setDeploymentInfo(info);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setDeploymentError(
            error instanceof Error ? error.message : 'Unable to load deployment info.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingDeployment(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

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
        Build Information
        <IconButton
          aria-label="Close build information dialog"
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
        <Stack spacing={2.5} sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH, mx: 'auto' }}>
          <Typography variant="subtitle1" sx={BUILD_INFO_LABEL_SX}>
            GitHub
          </Typography>
          <InfoRow label="Repository" value={buildInfo.repository} />
          <InfoRow label="Branch" value={buildInfo.branch} />
          <InfoRow label="Commit" value={buildInfo.commit} />
          <InfoRow label="Commit message" value={buildInfo.commitMessage} />
          <InfoRow label="Build date" value={formatBuildTimestamp(buildInfo.buildDate)} />

          <Typography variant="subtitle1" sx={{ ...BUILD_INFO_LABEL_SX, pt: 1 }}>
            Dokploy
          </Typography>

          {loadingDeployment && (
            <Stack sx={{ py: 2, alignItems: 'center' }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {!loadingDeployment && deploymentError && (
            <Typography variant="body2" color="error">
              {deploymentError}
            </Typography>
          )}

          {!loadingDeployment && !deploymentError && (
            <>
              <InfoRow
                label="Deployment date"
                value={formatBuildTimestamp(deploymentInfo?.deployedAt ?? null)}
              />
              <InfoRow label="Deploy source" value={deploymentInfo?.deploySource ?? 'Not available'} />
            </>
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
