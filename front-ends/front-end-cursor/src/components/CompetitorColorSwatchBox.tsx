import { Box } from '@mui/material';
import { useId } from 'react';
import type { CompetitorColorRecord } from '../types/competitorColors';

export const COLOR_SWATCH_SIZE = 20;

/** BoyOutlined path split: head circle vs body/legs silhouette. */
const BOY_HEAD_PATH =
  'M12 7.5c.97 0 1.75-.78 1.75-1.75S12.97 4 12 4s-1.75.78-1.75 1.75S11.03 7.5 12 7.5';

const BOY_BODY_PATH =
  'M14 20v-5h1v-4.5c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2V15h1v5z';

/** Torso band: below head, above leg split in the BoyOutlined geometry. */
const TORSO_CLIP = { x: 0, y: 8, width: 24, height: 7.5 };
/** Legs/pants band: lower body from the knee/waist break downward. */
const LEGS_CLIP = { x: 0, y: 15.5, width: 24, height: 8.5 };

type CompetitorColorSwatchBoxProps = {
  colors: CompetitorColorRecord;
  size?: number;
};

export default function CompetitorColorSwatchBox({
  colors,
  size = COLOR_SWATCH_SIZE,
}: CompetitorColorSwatchBoxProps) {
  const { top, bottom } = colors;
  const clipBaseId = useId();
  const torsoClipId = `${clipBaseId}-torso`;
  const legsClipId = `${clipBaseId}-legs`;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 0.5,
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 24 24"
        aria-hidden
        sx={{
          width: size - 2,
          height: size - 2,
          display: 'block',
        }}
      >
        <defs>
          <clipPath id={torsoClipId}>
            <rect
              x={TORSO_CLIP.x}
              y={TORSO_CLIP.y}
              width={TORSO_CLIP.width}
              height={TORSO_CLIP.height}
            />
          </clipPath>
          <clipPath id={legsClipId}>
            <rect
              x={LEGS_CLIP.x}
              y={LEGS_CLIP.y}
              width={LEGS_CLIP.width}
              height={LEGS_CLIP.height}
            />
          </clipPath>
        </defs>

        {/* Head stays neutral (not top/bottom outfit colors). */}
        <path d={BOY_HEAD_PATH} fill="rgba(255, 255, 255, 0.45)" />

        {/* Uncolored body regions stay subtly visible on the black background. */}
        <path d={BOY_BODY_PATH} fill="rgba(255, 255, 255, 0.22)" />

        {top ? (
          <path
            d={BOY_BODY_PATH}
            fill={top}
            clipPath={`url(#${torsoClipId})`}
          />
        ) : null}

        {bottom ? (
          <path
            d={BOY_BODY_PATH}
            fill={bottom}
            clipPath={`url(#${legsClipId})`}
          />
        ) : null}
      </Box>
    </Box>
  );
}
