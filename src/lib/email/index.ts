// Stub for transactional email utility
// Extend with Resend, SendGrid, or SMTP integration as needed

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  // TODO: Integrate real email provider
  return { success: true, message: "Email sent (stub)" };
}
