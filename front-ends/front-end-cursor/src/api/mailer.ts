const MAILER_URL = import.meta.env.VITE_MAILER_URL ?? 'http://localhost:3001';

export type MailerForgotPasswordRequestResult = {
  ok: boolean;
  message: string;
  email?: string;
};

export async function requestPasswordResetEmail(
  identifier: string,
): Promise<MailerForgotPasswordRequestResult> {
  const response = await fetch(`${MAILER_URL}/forgot-password/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });

  const body = (await response.json()) as MailerForgotPasswordRequestResult & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(body.message ?? `Request failed (${response.status})`);
  }

  return body;
}
