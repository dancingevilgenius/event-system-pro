import { Box, IconButton } from '@mui/material';
import {
  CountrySelector,
  type CountryIso2,
  usePhoneInput,
} from 'react-international-phone';
import 'react-international-phone/style.css';
import AppTextField from './AppTextField';

const phoneFieldSx = {
  display: 'flex',
  gap: 1,
  minWidth: 0,
  maxWidth: '100%',
  alignItems: 'flex-end',
  boxSizing: 'border-box',
} as const;

const phoneInputWrapperSx = {
  flex: 1,
  minWidth: 0,
  maxWidth: '100%',
} as const;

const countryButtonSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
  height: 56,
  width: 56,
  flexShrink: 0,
} as const;

type AppPhoneNumberFieldProps = {
  label?: string;
  value?: string;
  onChange: (phone: string) => void;
  defaultCountry?: CountryIso2;
  fullWidth?: boolean;
  autoComplete?: string;
};

export default function AppPhoneNumberField({
  label = 'Phone',
  value = '',
  onChange,
  defaultCountry = 'us',
  fullWidth = true,
  autoComplete = 'tel',
}: AppPhoneNumberFieldProps) {
  const { country, setCountry, inputValue, handlePhoneValueChange, inputRef } =
    usePhoneInput({
      defaultCountry,
      value,
      forceDialCode: true,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  return (
    <Box sx={phoneFieldSx}>
      <CountrySelector
        selectedCountry={country.iso2}
        onSelect={(selected) => setCountry(selected.iso2)}
        renderButtonWrapper={({ children, rootProps }) => (
          <IconButton {...rootProps} aria-label="Select country" sx={countryButtonSx}>
            {children}
          </IconButton>
        )}
      />
      <Box sx={phoneInputWrapperSx}>
        <AppTextField
          label={label}
          fullWidth={fullWidth}
          value={inputValue}
          onChange={handlePhoneValueChange}
          inputRef={inputRef}
          autoComplete={autoComplete}
          type="tel"
          variant="outlined"
          sx={{ minWidth: 0, maxWidth: '100%' }}
        />
      </Box>
    </Box>
  );
}
