import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';

export type PhoneNumberOptions = {
  /** When true, never call libphonenumber — demo seed phones use 555 placeholders. */
  isDemo?: boolean;
};

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

/** Digit-length check only — no libphonenumber. */
function hasUsablePhoneDigitsOnly(phone: string): boolean {
  const digits = digitsOnly(phone);

  // NANP: 10-digit national, or 11 digits with leading country code 1 (includes 555 demo).
  if (digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))) {
    return true;
  }

  // Other international numbers: E.164 allows up to 15 digits.
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Accepts numbers that are long enough to store.
 * For demo users (`isDemo: true`), never uses libphonenumber.
 */
export function hasUsablePhone(
  phone: string | undefined,
  options: PhoneNumberOptions = {},
): boolean {
  if (typeof phone !== 'string' || isPhoneCleared(phone)) {
    return false;
  }

  if (options.isDemo) {
    return hasUsablePhoneDigitsOnly(phone);
  }

  if (hasUsablePhoneDigitsOnly(phone)) {
    return true;
  }

  if (isPossiblePhoneNumber(phone) || isPossiblePhoneNumber(phone, 'US')) {
    return true;
  }

  const parsed =
    parsePhoneNumberFromString(phone) ?? parsePhoneNumberFromString(phone, 'US');
  return Boolean(parsed?.nationalNumber && parsed.nationalNumber.length >= 8);
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

function buildPhoneNumbersJsonFromDigits(phone: string) {
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

  if (digits.length >= 8) {
    return [
      {
        type: 'mobile',
        country_code: '1',
        number: digits,
        primary: true,
      },
    ];
  }

  return [];
}

export function buildPhoneNumbersJson(
  phone: string | undefined,
  options: PhoneNumberOptions = {},
) {
  if (!hasUsablePhone(phone, options) || !phone) {
    return [];
  }

  // Demo users: never call libphonenumber.
  if (options.isDemo) {
    return buildPhoneNumbersJsonFromDigits(phone);
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

  return buildPhoneNumbersJsonFromDigits(phone);
}
