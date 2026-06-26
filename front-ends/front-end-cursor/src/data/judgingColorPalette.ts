export const PALETTE_GRID_COLS = 8;

function hsl(h: number, s: number, l: number): string {
  return `hsl(${((h % 360) + 360) % 360} ${Math.min(Math.max(s, 0), 100)}% ${Math.min(Math.max(l, 0), 100)}%)`;
}

function gradientRow(
  baseHue: number,
  options: {
    hueStep?: number;
    saturation: [number, number];
    lightness: [number, number];
  },
): string[] {
  const colors: string[] = [];
  const hueStep = options.hueStep ?? 0;

  for (let col = 0; col < PALETTE_GRID_COLS; col += 1) {
    const t = col / (PALETTE_GRID_COLS - 1);
    const hue = baseHue + (col - (PALETTE_GRID_COLS - 1) / 2) * hueStep;
    const saturation =
      options.saturation[0] + (options.saturation[1] - options.saturation[0]) * t;
    const lightness =
      options.lightness[0] + (options.lightness[1] - options.lightness[0]) * t;

    colors.push(hsl(hue, saturation, lightness));
  }

  return colors;
}

function buildNeutralRow(): string[] {
  return [
    '#000000',
    '#1f1f1f',
    '#3d3d3d',
    '#5c5c5c',
    '#7a7a7a',
    '#999999',
    '#d9d9d9',
    '#ffffff',
  ];
}

function buildBlueGradientRow(): string[] {
  return gradientRow(215, {
    hueStep: 2,
    saturation: [55, 88],
    lightness: [22, 72],
  });
}

function buildPurpleGradientRow(): string[] {
  return gradientRow(278, {
    hueStep: 2.5,
    saturation: [48, 82],
    lightness: [24, 70],
  });
}

function buildRedGradientRow(): string[] {
  return gradientRow(358, {
    hueStep: 1.5,
    saturation: [52, 90],
    lightness: [20, 68],
  });
}

function buildBrownGradientRow(): string[] {
  return gradientRow(28, {
    hueStep: 1.5,
    saturation: [28, 58],
    lightness: [18, 52],
  });
}

function buildGreenGradientRow(): string[] {
  return gradientRow(132, {
    hueStep: 3,
    saturation: [40, 78],
    lightness: [20, 66],
  });
}

function buildYellowGradientRow(): string[] {
  return gradientRow(48, {
    hueStep: 2,
    saturation: [58, 92],
    lightness: [38, 82],
  });
}

function buildNeonAssortmentRow(): string[] {
  const neonSwatches = [
    { hue: 328, saturation: 96, lightness: 58 },
    { hue: 54, saturation: 98, lightness: 56 },
    { hue: 118, saturation: 92, lightness: 52 },
    { hue: 168, saturation: 94, lightness: 50 },
    { hue: 192, saturation: 96, lightness: 54 },
    { hue: 282, saturation: 90, lightness: 56 },
    { hue: 88, saturation: 98, lightness: 54 },
    { hue: 18, saturation: 96, lightness: 58 },
  ];

  return neonSwatches.map((swatch) =>
    hsl(swatch.hue, swatch.saturation, swatch.lightness),
  );
}

function buildPaletteRows(): string[][] {
  return [
    buildNeutralRow(),
    buildBlueGradientRow(),
    buildPurpleGradientRow(),
    buildRedGradientRow(),
    buildBrownGradientRow(),
    buildGreenGradientRow(),
    buildYellowGradientRow(),
    buildNeonAssortmentRow(),
  ];
}

const PALETTE_ROWS = buildPaletteRows();

export const PALETTE_GRID_ROWS = PALETTE_ROWS.length;

export const JUDGING_COLOR_PALETTE: string[] = PALETTE_ROWS.flat();

export function paletteIndexToPosition(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / PALETTE_GRID_COLS),
    col: index % PALETTE_GRID_COLS,
  };
}
