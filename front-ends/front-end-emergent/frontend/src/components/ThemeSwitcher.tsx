import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useThemeSwitcher } from "@/hooks/useThemeSwitcher";

export function ThemeSwitcher() {
  const { skinId, setSkin, skins } = useThemeSwitcher();

  return (
    <FormControl size="small" fullWidth data-testid="theme-switcher">
      <InputLabel id="skin-label">Skin</InputLabel>
      <Select
        labelId="skin-label"
        id="skin-select"
        value={skinId}
        label="Skin"
        onChange={(e) => setSkin(e.target.value)}
        inputProps={{ "data-testid": "skin-select-input" }}
      >
        {skins.map((s) => (
          <MenuItem
            key={s.id}
            value={s.id}
            data-testid={`skin-option-${s.id}`}
          >
            {s.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
