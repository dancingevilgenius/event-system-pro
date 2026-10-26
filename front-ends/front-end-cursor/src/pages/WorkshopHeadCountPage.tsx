import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import AppTextField from '../components/AppTextField';
import PageHeader from '../components/PageHeader';
import { MD_LAYOUT_MEDIA_QUERY } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';
import {
  ALL_WORKSHOP_DAYS,
  HEAD_COUNT_MAX,
  MOCK_WORKSHOPS,
  filterWorkshops,
  sanitizeHeadCountInput,
  workshopDayOptions,
  type WorkshopHeadCountRow,
} from '../lib/workshopHeadCount';

const headerCellSx = { fontWeight: 700, whiteSpace: 'nowrap' } as const;

function HeadCountField({
  workshop,
  value,
  onChange,
}: {
  workshop: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <AppTextField
      value={value}
      onChange={(event) => onChange(sanitizeHeadCountInput(event.target.value))}
      type="number"
      size="small"
      fullWidth
      slotProps={{
        htmlInput: {
          inputMode: 'numeric',
          min: 1,
          max: HEAD_COUNT_MAX,
          step: 1,
          'aria-label': `Head count for ${workshop}`,
        },
      }}
      sx={{ maxWidth: { md: 120 } }}
    />
  );
}

function WorkshopMobileCard({
  row,
  headCount,
  onHeadCountChange,
}: {
  row: WorkshopHeadCountRow;
  headCount: string;
  onHeadCountChange: (next: string) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack spacing={0.25}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Workshop
          </Typography>
          <Typography variant="body1">{row.workshop}</Typography>
        </Stack>
        <Stack spacing={0.25}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Instructor(s)
          </Typography>
          <Typography variant="body2">{row.instructors}</Typography>
        </Stack>
        <Stack spacing={0.25}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Room
          </Typography>
          <Typography variant="body2">{row.room}</Typography>
        </Stack>
        <Stack spacing={0.25}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Date
          </Typography>
          <Typography variant="body2">{row.dayLabel}</Typography>
        </Stack>
        <Stack spacing={0.25}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Time
          </Typography>
          <Typography variant="body2">{row.timeLabel}</Typography>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            Head Count
          </Typography>
          <HeadCountField
            workshop={row.workshop}
            value={headCount}
            onChange={onHeadCountChange}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function WorkshopHeadCountPage() {
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const [instructorFilter, setInstructorFilter] = useState('');
  const [dayFilter, setDayFilter] = useState(ALL_WORKSHOP_DAYS);
  const [headCounts, setHeadCounts] = useState<Record<string, string>>({});
  const dayOptions = useMemo(() => workshopDayOptions(MOCK_WORKSHOPS), []);
  const visibleWorkshops = useMemo(
    () => filterWorkshops(MOCK_WORKSHOPS, instructorFilter, dayFilter),
    [instructorFilter, dayFilter],
  );

  function setHeadCount(id: string, next: string) {
    setHeadCounts((current) => ({ ...current, [id]: next }));
  }

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader
          title="Workshop Head Count"
          backTo="/staff"
          backLabel="Back to Staff"
          titleSx={{
            fontSize: { xs: '1.5rem', md: '2.125rem' },
            lineHeight: { xs: 1.2, md: 1.235 },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 3,
            [`@media ${MD_LAYOUT_MEDIA_QUERY}`]: {
              flexDirection: 'row',
              alignItems: 'flex-start',
            },
          }}
        >
          <AppTextField
            label="Filter by Instructor"
            value={instructorFilter}
            onChange={(event) => setInstructorFilter(event.target.value)}
            fullWidth
            sx={{ flex: 1, minWidth: 0 }}
          />
          <FormControl fullWidth sx={{ flex: 1, minWidth: 0 }}>
            <InputLabel id="workshop-day-filter-label">Filter by Day</InputLabel>
            <Select
              labelId="workshop-day-filter-label"
              label="Filter by Day"
              value={dayFilter}
              onChange={(event) => setDayFilter(event.target.value)}
            >
              <MenuItem value={ALL_WORKSHOP_DAYS}>All days</MenuItem>
              {dayOptions.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {visibleWorkshops.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No workshops match these filters.
          </Typography>
        ) : showXsLayout ? (
          <Stack spacing={2}>
            {visibleWorkshops.map((row) => (
              <WorkshopMobileCard
                key={row.id}
                row={row}
                headCount={headCounts[row.id] ?? ''}
                onHeadCountChange={(next) => setHeadCount(row.id, next)}
              />
            ))}
          </Stack>
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" aria-label="Workshops">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>Workshop</TableCell>
                  <TableCell sx={headerCellSx}>Instructor(s)</TableCell>
                  <TableCell sx={headerCellSx}>Room</TableCell>
                  <TableCell sx={headerCellSx}>Date</TableCell>
                  <TableCell sx={headerCellSx}>Time</TableCell>
                  <TableCell sx={headerCellSx}>Head Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleWorkshops.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.workshop}</TableCell>
                    <TableCell>{row.instructors}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.room}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.dayLabel}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.timeLabel}</TableCell>
                    <TableCell>
                      <HeadCountField
                        workshop={row.workshop}
                        value={headCounts[row.id] ?? ''}
                        onChange={(next) => setHeadCount(row.id, next)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
}
