const POSTGREST_URL =
  import.meta.env.VITE_POSTGREST_URL ?? 'http://localhost:3000';

type RpcErrorBody = {
  message?: string;
  hint?: string;
  details?: string;
};

async function callRpc<TResponse>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<TResponse> {
  const response = await fetch(`${POSTGREST_URL}/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const errorBody = (await response.json()) as RpcErrorBody;
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep default message when body is not JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as TResponse;
}

export type ForgotPasswordRequestResult = {
  ok: boolean;
  message: string;
  email?: string;
  dev_verification_code?: string;
};

export type ForgotPasswordSimpleResult = {
  ok: boolean;
  message: string;
};

export type LoginResult = {
  ok: boolean;
  message: string;
  user_id?: number;
  username?: string;
  email?: string;
};

export type SecretQuestion = {
  secret_question_id: number;
  question: string;
  created_date: string;
};

export type PasswordRecoveryJson = {
  method: 'secret_questions';
  questions: Array<{
    secret_question_id: number;
    answer_hash: string;
  }>;
};

export type HashPasswordRecoveryResult = {
  ok: boolean;
  message: string;
  password_recovery_json?: PasswordRecoveryJson;
};

export type RegisterUserResult = {
  ok: boolean;
  message: string;
  user_id?: number;
  username?: string;
  email?: string;
};

export async function fetchSecretQuestions(): Promise<SecretQuestion[]> {
  const response = await fetch(
    `${POSTGREST_URL}/secret_question_lu?order=secret_question_id`,
  );

  if (!response.ok) {
    throw new Error(`Unable to load secret questions (${response.status})`);
  }

  return (await response.json()) as SecretQuestion[];
}

export function login(identifier: string, password: string) {
  return callRpc<LoginResult>('login', {
    p_identifier: identifier,
    p_password: password,
  });
}

export function forgotPasswordRequest(identifier: string) {
  return callRpc<ForgotPasswordRequestResult>('forgot_password_request', {
    identifier,
  });
}

export function forgotPasswordVerify(email: string, code: string) {
  return callRpc<ForgotPasswordSimpleResult>('forgot_password_verify', {
    p_email: email,
    p_code: code,
  });
}

export function forgotPasswordComplete(
  email: string,
  code: string,
  newPassword: string,
) {
  return callRpc<ForgotPasswordSimpleResult>('forgot_password_complete', {
    p_email: email,
    p_code: code,
    p_new_password: newPassword,
  });
}

export function hashPasswordRecoveryAnswers(
  answers: Array<{ secret_question_id: number; answer: string }>,
) {
  return callRpc<HashPasswordRecoveryResult>('hash_password_recovery_answers', {
    p_answers: answers,
  });
}

export function registerUser(params: {
  username: string;
  email: string;
  password: string;
  nameJson: Record<string, unknown>;
  phoneNumbersJson: unknown[];
  addressesJson: unknown[];
  passwordRecoveryJson: PasswordRecoveryJson;
}) {
  return callRpc<RegisterUserResult>('register_user', {
    p_username: params.username,
    p_email: params.email,
    p_password: params.password,
    p_name_json: params.nameJson,
    p_phone_numbers_json: params.phoneNumbersJson,
    p_addresses_json: params.addressesJson,
    p_password_recovery_json: params.passwordRecoveryJson,
  });
}
