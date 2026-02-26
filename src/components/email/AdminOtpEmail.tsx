import { Html, Head, Preview, Body, Container, Section, Text, Hr, Tailwind } from "@react-email/components";

interface AdminOtpEmailProps {
  otpCode: string;
}

export default function AdminOtpEmail({ otpCode }: AdminOtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Secure one-time code for your Superior AI admin login</Preview>
      <Tailwind>
        <Body className="bg-slate-50 text-slate-900">
          <Container className="mx-auto my-8 w-full max-w-xl rounded-2xl bg-white px-6 py-8 shadow-lg">
            <Section className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white text-sm font-semibold">
                  SA
                </div>
                <div>
                  <Text className="m-0 text-sm font-semibold text-slate-900">Superior AI</Text>
                  <Text className="m-0 text-xs uppercase tracking-[0.16em] text-slate-500">Admin Security</Text>
                </div>
              </div>
              <Text className="m-0 text-[11px] font-medium text-slate-500">One-time login code</Text>
            </Section>

            <Section className="mb-6">
              <Text className="m-0 mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                Verify admin access
              </Text>
              <Text className="m-0 mb-3 text-xl font-semibold text-slate-900">
                Your secure one-time verification code
              </Text>
              <Text className="m-0 text-sm leading-relaxed text-slate-600">
                Use the code below to complete your sign-in to the Superior AI admin dashboard. This code can only be
                used once and will expire in a few minutes.
              </Text>
            </Section>

            <Section className="mb-6 rounded-2xl bg-slate-50 px-5 py-6">
              <Text className="m-0 mb-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Your one-time code
              </Text>
              <Section className="mb-4 flex justify-between gap-2">
                {otpCode.split("").map((digit, index) => (
                  <div
                    key={`${digit}-${index}`}
                    className="flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-semibold tracking-[0.2em] text-slate-900 shadow-sm"
                  >
                    {digit}
                  </div>
                ))}
              </Section>
              <Text className="m-0 text-xs text-slate-500">
                For your security, never share this code with anyone. Superior AI will never ask you to send this code
                over chat or phone.
              </Text>
            </Section>

            <Section className="mb-6">
              <Text className="m-0 mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Session details
              </Text>
              <Text className="m-0 text-xs leading-relaxed text-slate-600">
                If you did not attempt to sign in to the Superior AI admin dashboard, you can safely ignore this
                message. The code will automatically expire shortly and no changes will be made to your account.
              </Text>
            </Section>

            <Hr className="my-5 border-slate-200" />

            <Section>
              <Text className="m-0 mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Superior AI
              </Text>
              <Text className="m-0 text-xs leading-relaxed text-slate-500">
                Secure voice receptionist infrastructure for universities and enterprises.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

