function hslToHex(h: number, s: number, l: number): string {
  const hue = ((h % 360) + 360) % 360;
  const saturation = Math.min(Math.max(s, 0), 100) / 100;
  const lightness = Math.min(Math.max(l, 0), 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const intermediate = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = lightness - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    red = chroma;
    green = intermediate;
  } else if (hue < 120) {
    red = intermediate;
    green = chroma;
  } else if (hue < 180) {
    green = chroma;
    blue = intermediate;
  } else if (hue < 240) {
    green = intermediate;
    blue = chroma;
  } else if (hue < 300) {
    red = intermediate;
    blue = chroma;
  } else {
    red = chroma;
    blue = intermediate;
  }

  const toByte = (channel: number) =>
    Math.round((channel + match) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toByte(red)}${toByte(green)}${toByte(blue)}`;
}

export function colorToHex(color: string): string {
  if (color.startsWith('#')) {
    return color.toLowerCase();
  }

  const match = color.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/i);
  if (!match) {
    return color;
  }

  return hslToHex(Number(match[1]), Number(match[2]), Number(match[3]));
}

export function colorToRgbString(color: string): string {
  const hex = colorToHex(color);
  if (!hex.startsWith('#') || hex.length !== 7) {
    return color;
  }

  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);

  return `rgb(${red}, ${green}, ${blue})`;
}

export function colorDesignationLabel(color: string): string {
  const hex = colorToHex(color);
  const rgb = colorToRgbString(color);
  return `${hex} · ${rgb}`;
}
