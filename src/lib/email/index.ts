import { Resend } from "resend";
import type { ReactElement } from "react";

const apiKey = process.env.RESEND_API_KEY;

const resend = apiKey ? new Resend(apiKey) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html?: string;
  react?: ReactElement;
}

export async function sendEmail({ to, subject, html, react }: SendEmailParams) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not configured");
  }

  if (react) {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      react,
    });
    return result;
  }

  if (html) {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    return result;
  }

  throw new Error("Either html or react content is required");
}


