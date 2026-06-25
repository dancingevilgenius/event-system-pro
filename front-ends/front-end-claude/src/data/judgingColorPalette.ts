export interface PaletteColor {
  id: string;
  hex: string;
  /** Human-readable name for accessibility labels and dialog alt text. */
  name: string;
}

const COLUMNS = 8;
const ROWS = 14;

// Column = hue family (8 evenly spaced hues), Row = lightness/saturation step
// (14 steps from near-white to near-black, passing through full saturation).
// This gives a coherent, swatch-book-style palette rather than 112 arbitrary
// hardcoded hex values.
const HUE_NAMES = [
  'Red',
  'Orange',
  'Gold',
  'Green',
  'Teal',
  'Blue',
  'Violet',
  'Magenta',
];

function buildPalette(): PaletteColor[] {
  const colors: PaletteColor[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const hue = (col / COLUMNS) * 360;
      // Row 0 = lightest, row 13 = darkest. Saturation peaks in the middle rows.
      const t = row / (ROWS - 1); // 0..1
      const lightness = 92 - t * 80; // 92% down to 12%
      const saturation = 35 + Math.sin(t * Math.PI) * 50; // ramps up then down
      const hex = hslToHex(hue, saturation, lightness);
      const step = row + 1;
      colors.push({
        id: `c${row}-${col}`,
        hex,
        name: `${HUE_NAMES[col]} ${step}`,
      });
    }
  }
  return colors;
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export const JUDGING_COLOR_PALETTE: PaletteColor[] = buildPalette();
export const PALETTE_COLUMNS = COLUMNS;
export const PALETTE_ROWS = ROWS;
