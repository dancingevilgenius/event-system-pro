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
  if (typeof phone !== 'string' || phone.trim() === '') {
    return false;
  }

  if (isPossiblePhoneNumber(phone)) {
    return true;
  }

  // Demo / placeholder NANP numbers (e.g. 555…) can fail both validity and
  // possibility checks in some edge formats; accept a full 10-digit national US number.
  const parsed = parsePhoneNumberFromString(phone);
  return (
    parsed?.countryCallingCode === '1' &&
    typeof parsed.nationalNumber === 'string' &&
    /^\d{10}$/.test(parsed.nationalNumber)
  );
}

export function phoneHasNationalDigits(phone: string | undefined): boolean {
  if (typeof phone !== 'string' || !phone.trim()) {
    return false;
  }

  return Boolean(parsePhoneNumberFromString(phone)?.nationalNumber);
}

export function buildPhoneNumbersJson(phone: string | undefined) {
  if (!phone || !hasUsablePhone(phone)) {
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
