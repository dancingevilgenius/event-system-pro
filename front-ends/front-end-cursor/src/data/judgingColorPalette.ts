export const PALETTE_GRID_COLS = 8;
export const PALETTE_GRID_ROWS = 14;

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`;
}

function buildRedColors(): string[] {
  const colors: string[] = [];

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < PALETTE_GRID_COLS; col += 1) {
      const hue = (355 - col * 6 + 360) % 360;
      const saturation = 48 + col * 6;
      const lightness = 18 + row * 17;

      colors.push(hsl(hue, Math.min(saturation, 100), Math.min(lightness, 78)));
    }
  }

  return colors;
}

function buildGreenColors(): string[] {
  const colors: string[] = [];

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < PALETTE_GRID_COLS; col += 1) {
      const hue = 82 + col * 9;
      const saturation = 38 + row * 14;
      const lightness = 20 + row * 16;

      colors.push(hsl(hue, Math.min(saturation, 96), Math.min(lightness, 72)));
    }
  }

  return colors;
}

function buildBlueColors(): string[] {
  const colors: string[] = [];

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < PALETTE_GRID_COLS; col += 1) {
      const hue = 192 + col * 8;
      const saturation = 42 + row * 18;
      const lightness = 18 + row * 22;

      colors.push(hsl(hue, Math.min(saturation, 100), Math.min(lightness, 78)));
    }
  }

  return colors;
}

function buildTanBrownColors(): string[] {
  const colors: string[] = [];

  for (let col = 0; col < PALETTE_GRID_COLS; col += 1) {
    const hue = 24 + col * 4;
    const saturation = 28 + col * 7;
    const lightness = 24 + col * 7;

    colors.push(hsl(hue, Math.min(saturation, 72), Math.min(lightness, 58)));
  }

  return colors;
}

function buildYellowColors(): string[] {
  const colors: string[] = [];

  for (let col = 0; col < PALETTE_GRID_COLS; col += 1) {
    const hue = 44 + col * 3;
    const saturation = 52 + col * 5;
    const lightness = 42 + col * 6;

    colors.push(hsl(hue, Math.min(saturation, 96), Math.min(lightness, 88)));
  }

  return colors;
}

function buildNeutralColors(): string[] {
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

export const JUDGING_COLOR_PALETTE: string[] = [
  ...buildRedColors(),
  ...buildGreenColors(),
  ...buildBlueColors(),
  ...buildTanBrownColors(),
  ...buildYellowColors(),
  ...buildNeutralColors(),
];

export function paletteIndexToPosition(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / PALETTE_GRID_COLS),
    col: index % PALETTE_GRID_COLS,
  };
}
