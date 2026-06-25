interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function PaletteOutlinedIcon({ size = 24, color = 'currentColor', className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Pick colors"
    >
      <path
        d="M12 3C7.03 3 3 6.58 3 11c0 3.6 2.92 6.63 6.94 7.66.5.13.79-.22.79-.6v-1.85c-2.34.5-2.84-1.13-2.84-1.13-.38-.97-.93-1.23-.93-1.23-.76-.52.06-.51.06-.51.84.06 1.28.86 1.28.86.75 1.28 1.97.91 2.45.7.07-.54.29-.91.53-1.12-1.87-.21-3.83-.93-3.83-4.15 0-.92.33-1.67.86-2.26-.09-.21-.37-1.06.08-2.21 0 0 .7-.22 2.3.84a8 8 0 0 1 4.2 0c1.6-1.06 2.3-.84 2.3-.84.45 1.15.17 2 .08 2.21.53.59.86 1.34.86 2.26 0 3.23-1.97 3.94-3.85 4.15.31.27.57.79.57 1.6v2.37c0 .38.29.74.79.6C18.08 17.63 21 14.6 21 11c0-4.42-4.03-8-9-8Z"
        fill={color}
      />
      <circle cx="9" cy="10" r="0.01" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}
