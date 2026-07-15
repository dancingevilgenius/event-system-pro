import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

/** Strict validity (used by registration recovery checks). */
export function hasCompletePhone(phone: string | undefined): boolean {
  return typeof phone === 'string' && phone.length > 0 && isValidPhoneNumber(phone);
}

/**
 * Accepts numbers that are long enough / correctly shaped to store, including
 * common placeholder 555 numbers that fail strict validity checks.
 */
export function hasUsablePhone(phone: string | undefined): boolean {
  return typeof phone === 'string' && phone.length > 0 && isPossiblePhoneNumber(phone);
}

export function buildPhoneNumbersJson(phone: string | undefined) {
  if (!phone || !isPossiblePhoneNumber(phone)) {
    return [];
  }

  const parsed = parsePhoneNumberFromString(phone);
  if (!parsed?.nationalNumber) {
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
