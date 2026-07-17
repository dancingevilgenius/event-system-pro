import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

const AUDIT_TRAIL_CELL_SX = {
  minWidth: 0,
  overflow: 'hidden',
} as const;

const AUDIT_TRAIL_CELL_TEXT_SX = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
} as const;

export type AuditTrailCardField = {
  key?: string;
  label: string;
  value: ReactNode;
  columnSpan?: number;
  valueSx?: SxProps<Theme>;
};

export type AuditTrailCardProps = {
  fields: AuditTrailCardField[];
  header?: ReactNode;
  beforeActions?: ReactNode;
  columns?: 1 | 2 | 3;
  flexDirection?: 'row' | 'column';
  actions?: ReactNode;
  actionsAlign?: 'left' | 'right';
  /** When true, render actions as the last grid cell instead of a separate column or footer. */
  actionsInGrid?: boolean;
  showActionsDivider?: boolean;
  sx?: SxProps<Theme>;
};

function AuditTrailCardFieldItem({ field }: { field: AuditTrailCardField }) {
  return (
    <Box
      sx={{
        ...AUDIT_TRAIL_CELL_SX,
        gridColumn: field.columnSpan ? `span ${field.columnSpan}` : undefined,
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ ...AUDIT_TRAIL_CELL_TEXT_SX, fontWeight: 700 }}
      >
        {field.label}
      </Typography>
      <Typography variant="body2" sx={{ ...AUDIT_TRAIL_CELL_TEXT_SX, ...field.valueSx }}>
        {field.value}
      </Typography>
    </Box>
  );
}

export default function AuditTrailCard({
  fields,
  header,
  beforeActions,
  columns = 1,
  flexDirection = 'column',
  actions,
  actionsAlign = 'right',
  actionsInGrid = false,
  showActionsDivider = true,
  sx,
}: AuditTrailCardProps) {
  const hasActions = actions != null;
  const actionsOnRight = actionsAlign === 'right';
  const actionsAside = hasActions && flexDirection === 'row' && !actionsInGrid;
  const actionsBelow = hasActions && flexDirection === 'column' && !actionsInGrid;

  const actionsNode = hasActions ? (
    <Box
      sx={{
        alignSelf:
          flexDirection === 'column'
            ? actionsOnRight
              ? 'flex-end'
              : 'flex-start'
            : undefined,
        flex: flexDirection === 'row' ? '0 0 auto' : undefined,
      }}
    >
      {actions}
    </Box>
  ) : null;

  return (
    <Paper variant="outlined" sx={{ p: 2, overflowX: 'auto', ...sx }}>
      <Stack spacing={1.5} sx={{ flexWrap: 'nowrap', minWidth: 'min-content' }}>
        {header}

        <Stack
          direction={flexDirection}
          spacing={flexDirection === 'row' ? 2 : 1.5}
          sx={{
            alignItems: flexDirection === 'row' ? 'stretch' : undefined,
            justifyContent: flexDirection === 'row' && actionsOnRight ? 'space-between' : undefined,
            flexWrap: 'nowrap',
          }}
        >
          <Box
            sx={{
              flex: flexDirection === 'row' ? '1 1 0' : undefined,
              minWidth: 0,
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap: 1,
              columnGap: columns > 1 ? 2 : undefined,
            }}
          >
            {fields.map((field, index) => (
              <AuditTrailCardFieldItem key={field.key ?? field.label ?? index} field={field} />
            ))}
            {hasActions && actionsInGrid && (
              <Box
                sx={{
                  ...AUDIT_TRAIL_CELL_SX,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: actionsOnRight ? 'flex-end' : 'flex-start',
                }}
              >
                {actions}
              </Box>
            )}
          </Box>

          {actionsAside && (
            <Stack
              spacing={1}
              sx={{
                flex: '0 0 auto',
                alignItems: actionsOnRight ? 'flex-end' : 'flex-start',
                justifyContent: 'center',
              }}
            >
              {actions}
            </Stack>
          )}
        </Stack>

        {beforeActions}

        {actionsBelow && (
          <>
            {showActionsDivider && <Divider />}
            {actionsNode}
          </>
        )}
      </Stack>
    </Paper>
  );
}
