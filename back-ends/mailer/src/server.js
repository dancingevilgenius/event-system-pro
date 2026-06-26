import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';
import pg from 'pg';

const {
  PORT = '3001',
  DATABASE_URL,
  SMTP_HOST = 'localhost',
  SMTP_PORT = '1025',
  SMTP_SECURE = 'false',
  SMTP_USER = '',
  SMTP_PASS = '',
  EMAIL_FROM = 'Event System Pro <no-reply@eventsystempro.local>',
  APP_NAME = 'Event System Pro',
  CORS_ORIGINS = 'http://localhost:5173,http://127.0.0.1:5173',
} = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
});

const app = express();
app.use(
  cors({
    origin: CORS_ORIGINS.split(',').map((origin) => origin.trim()),
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/forgot-password/request', async (req, res) => {
  const identifier = typeof req.body?.identifier === 'string' ? req.body.identifier.trim() : '';

  if (!identifier) {
    res.status(400).json({ ok: false, message: 'Enter your email or username.' });
    return;
  }

  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      'SELECT api.mailer_issue_password_reset($1::text) AS result',
      [identifier],
    );
    const result = rows[0]?.result ?? {};

    if (result.verification_code && result.email) {
      const code = result.verification_code;
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: result.email,
        subject: `${APP_NAME} — password reset code`,
        text: [
          `Your ${APP_NAME} password reset verification code is: ${code}`,
          '',
          'This code expires in 15 minutes.',
          'If you did not request a reset, you can ignore this email.',
        ].join('\n'),
        html: [
          `<p>Your <strong>${APP_NAME}</strong> password reset verification code is:</p>`,
          `<p style="font-size:24px;letter-spacing:4px;"><strong>${code}</strong></p>`,
          `<p>This code expires in 15 minutes.</p>`,
          `<p>If you did not request a reset, you can ignore this email.</p>`,
        ].join('\n'),
      });
    }

    res.json({
      ok: result.ok ?? true,
      message:
        result.message ??
        'If an account exists for that email or username, a verification code has been sent.',
      email: result.email ?? undefined,
    });
  } catch (error) {
    console.error('forgot-password/request failed:', error);
    res.status(500).json({
      ok: false,
      message: 'Unable to send verification email right now. Please try again later.',
    });
  } finally {
    client?.release();
  }
});

app.listen(Number(PORT), () => {
  console.log(`Mailer listening on http://localhost:${PORT}`);
  console.log(`SMTP ${SMTP_HOST}:${SMTP_PORT}`);
});
