import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useThemeSwitcher } from '../hooks/useThemeSwitcher';
import type { SkinId } from '../skins/types';

type ThemeSwitcherProps = {
  fullWidth?: boolean;
};

export default function ThemeSwitcher({ fullWidth = false }: ThemeSwitcherProps) {
  const { skinId, skins, setSkin } = useThemeSwitcher();

  const handleChange = (event: SelectChangeEvent) => {
    setSkin(event.target.value as SkinId);
  };

  return (
    <FormControl fullWidth={fullWidth} size="small">
      <InputLabel id="theme-switcher-label">Skin</InputLabel>
      <Select
        labelId="theme-switcher-label"
        id="theme-switcher"
        value={skinId}
        label="Skin"
        onChange={handleChange}
      >
        {skins.map((skin) => (
          <MenuItem key={skin.id} value={skin.id}>
            {skin.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
