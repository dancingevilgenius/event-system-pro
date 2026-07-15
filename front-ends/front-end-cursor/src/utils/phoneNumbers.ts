import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Strict validity (used by registration recovery checks). */
export function hasCompletePhone(phone: string | undefined): boolean {
  return typeof phone === 'string' && phone.length > 0 && isValidPhoneNumber(phone);
}

/** Empty / dial-code-only input (e.g. `+1`). */
export function isPhoneCleared(phone: string | undefined): boolean {
  if (typeof phone !== 'string' || phone.trim() === '') {
    return true;
  }

  const digits = digitsOnly(phone);
  // Country calling codes are typically 1–3 digits.
  return digits.length === 0 || digits.length <= 3;
}

/**
 * Accepts numbers that are long enough to store.
 * Intentionally does NOT require libphonenumber "valid" — demo seed phones
 * use 555-… placeholders that fail strict validity checks.
 */
export function hasUsablePhone(phone: string | undefined): boolean {
  if (typeof phone !== 'string' || isPhoneCleared(phone)) {
    return false;
  }

  const digits = digitsOnly(phone);

  // NANP: 10-digit national, or 11 digits with leading country code 1 (includes 555 demo).
  if (digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))) {
    return true;
  }

  if (isPossiblePhoneNumber(phone) || isPossiblePhoneNumber(phone, 'US')) {
    return true;
  }

  const parsed =
    parsePhoneNumberFromString(phone) ?? parsePhoneNumberFromString(phone, 'US');
  if (parsed?.nationalNumber && parsed.nationalNumber.length >= 8) {
    return true;
  }

  // Other international numbers: E.164 allows up to 15 digits.
  return digits.length >= 8 && digits.length <= 15;
}

export function phoneHasNationalDigits(phone: string | undefined): boolean {
  return !isPhoneCleared(phone);
}

export function phoneDigitsMatch(left: string | undefined, right: string | undefined): boolean {
  const leftDigits = typeof left === 'string' ? digitsOnly(left) : '';
  const rightDigits = typeof right === 'string' ? digitsOnly(right) : '';
  if (!leftDigits || !rightDigits) {
    return false;
  }

  // Compare national forms when one side includes a leading US country code.
  const normalize = (digits: string) =>
    digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;

  return normalize(leftDigits) === normalize(rightDigits);
}

export function buildPhoneNumbersJson(phone: string | undefined) {
  if (!hasUsablePhone(phone) || !phone) {
    return [];
  }

  const parsed =
    parsePhoneNumberFromString(phone) ?? parsePhoneNumberFromString(phone, 'US');
  if (parsed?.nationalNumber && parsed.countryCallingCode) {
    return [
      {
        type: 'mobile',
        country_code: parsed.countryCallingCode,
        number: parsed.nationalNumber,
        primary: true,
      },
    ];
  }

  const digits = digitsOnly(phone);
  if (digits.length === 11 && digits.startsWith('1')) {
    return [
      {
        type: 'mobile',
        country_code: '1',
        number: digits.slice(1),
        primary: true,
      },
    ];
  }

  if (digits.length === 10) {
    return [
      {
        type: 'mobile',
        country_code: '1',
        number: digits,
        primary: true,
      },
    ];
  }

  return [
    {
      type: 'mobile',
      country_code: '1',
      number: digits,
      primary: true,
    },
  ];
}
