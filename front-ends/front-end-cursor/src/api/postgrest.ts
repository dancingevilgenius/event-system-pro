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
