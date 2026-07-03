import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

export function hasCompletePhone(phone: string | undefined): boolean {
  return typeof phone === 'string' && phone.length > 0 && isValidPhoneNumber(phone);
}

export function buildPhoneNumbersJson(phone: string | undefined) {
  if (!phone || !isValidPhoneNumber(phone)) {
    return [];
  }

  const parsed = parsePhoneNumberFromString(phone);
  if (!parsed) {
    return [];
  }

  return [
    {
      type: 'mobile',
      country_code: parsed.countryCallingCode,
      number: parsed.nationalNumber,
      primary: true,
    },
  ];
}
