import nodemailer, { type Transporter } from 'nodemailer'

// Reuse a single transporter instance across invocations.
let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP configuration missing. Set SMTP_HOST, SMTP_USER and SMTP_PASS in your environment.'
    )
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
    auth: { user, pass },
  })

  return transporter
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  const mailer = getTransporter()

  return mailer.sendMail({
    from,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    text,
    html,
  })
}
