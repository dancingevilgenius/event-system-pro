import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { StaticListEntry } from '../api/postgrest';
import {
  buildDefaultSwingContestTitle,
  type SwingDanceContestFormState,
} from '../lib/swingDanceContest';
import AppTextField from './AppTextField';
import DeleteIcon from './DeleteIcon';
import DragHandleIcon from './DragHandleIcon';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';

type SwingDanceContestProps = {
  contest: SwingDanceContestFormState;
  danceOptions: StaticListEntry[];
  levelOptions: StaticListEntry[];
  duplicateHighlight: boolean;
  onChange: (
    id: string,
    next: SwingDanceContestFormState,
    options?: { checkDuplicates?: boolean },
  ) => void;
  onDelete: (id: string) => void;
};

export default function SwingDanceContest({
  contest,
  danceOptions,
  levelOptions,
  duplicateHighlight,
  onChange,
  onDelete,
}: SwingDanceContestProps) {
  const isMobile = useIsMobileDevice();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: contest.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const handleDanceChange = (danceKey: string) => {
    const danceLabel = danceOptions.find((entry) => entry.key === danceKey)?.label ?? '';
    const levelLabel = levelOptions.find((entry) => entry.key === contest.levelKey)?.label ?? '';
    const title = contest.titleManuallyEdited
      ? contest.title
      : buildDefaultSwingContestTitle(danceLabel, levelLabel);

    onChange(
      contest.id,
      {
        ...contest,
        danceKey,
        title,
      },
      { checkDuplicates: true },
    );
  };

  const handleLevelChange = (levelKey: string) => {
    const danceLabel = danceOptions.find((entry) => entry.key === contest.danceKey)?.label ?? '';
    const levelLabel = levelOptions.find((entry) => entry.key === levelKey)?.label ?? '';
    const title = contest.titleManuallyEdited
      ? contest.title
      : buildDefaultSwingContestTitle(danceLabel, levelLabel);

    onChange(
      contest.id,
      {
        ...contest,
        levelKey,
        title,
      },
      { checkDuplicates: true },
    );
  };

  const handleTitleChange = (title: string) => {
    onChange(contest.id, {
      ...contest,
      title,
      titleManuallyEdited: true,
    });
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteOpen(false);
    onDelete(contest.id);
  };

  const dragHandle = (
    <Box
      {...attributes}
      {...listeners}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        color: 'text.secondary',
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
        alignSelf: isMobile ? 'flex-start' : 'center',
        pt: isMobile ? 1 : 0,
      }}
      aria-label="Drag to reorder contest"
    >
      <DragHandleIcon />
    </Box>
  );

  const danceField = (
    <AppTextField
      select
      label="Swing Division"
      value={contest.danceKey}
      onChange={(event) => handleDanceChange(event.target.value)}
      fullWidth
      sx={{ minWidth: 0 }}
    >
      <MenuItem value="">
        <em>Select Division</em>
      </MenuItem>
      {danceOptions.map((entry) => (
        <MenuItem key={entry.key} value={entry.key}>
          {entry.label}
        </MenuItem>
      ))}
    </AppTextField>
  );

  const levelField = (
    <AppTextField
      select
      label="Skill Level"
      value={contest.levelKey}
      onChange={(event) => handleLevelChange(event.target.value)}
      fullWidth
      sx={{ minWidth: 0 }}
    >
      <MenuItem value="">
        <em>Select skill level</em>
      </MenuItem>
      {levelOptions.map((entry) => (
        <MenuItem key={entry.key} value={entry.key}>
          {entry.label}
        </MenuItem>
      ))}
    </AppTextField>
  );

  const titleField = (
    <AppTextField
      label="Contest Name"
      value={contest.title}
      onChange={(event) => handleTitleChange(event.target.value)}
      fullWidth
      sx={{ minWidth: 0 }}
    />
  );

  const deleteButton = (
    <IconButton
      aria-label="Delete contest"
      color="error"
      onClick={() => setConfirmDeleteOpen(true)}
      sx={{ flex: '0 0 auto', alignSelf: isMobile ? 'center' : 'center' }}
    >
      <DeleteIcon />
    </IconButton>
  );

  return (
    <>
      <Paper
        ref={setNodeRef}
        style={style}
        variant="outlined"
        sx={{
          p: 2,
          borderColor: duplicateHighlight ? 'error.main' : 'divider',
          borderWidth: duplicateHighlight ? 2 : 1,
          bgcolor: duplicateHighlight ? '#ffebee' : 'background.paper',
        }}
      >
        {isMobile ? (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
              {dragHandle}
              <Box sx={{ flex: 1, minWidth: 0 }}>{danceField}</Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>{levelField}</Box>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>{titleField}</Box>
              {deleteButton}
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            {dragHandle}
            <Box sx={{ flex: '1 1 0', minWidth: 0 }}>{danceField}</Box>
            <Box sx={{ flex: '1 1 0', minWidth: 0 }}>{levelField}</Box>
            <Box sx={{ flex: '2 1 0', minWidth: 0 }}>{titleField}</Box>
            {deleteButton}
          </Stack>
        )}
      </Paper>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete contest?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove this swing dance contest from the list?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ flexDirection: isMobile ? 'column' : 'row', gap: 1, px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDeleteOpen(false)} fullWidth={isMobile}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete} fullWidth={isMobile}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
