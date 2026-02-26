import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Tailwind,
  Font,
} from "@react-email/components";

interface AdminOtpEmailProps {
  otpCode: string;
}

export default function AdminOtpEmail({ otpCode }: AdminOtpEmailProps) {
  return (
    <Html>
      <Head>
        {/* Adding a reliable fallback font specifically for email clients */}
        <Font
          fontFamily="Helvetica Neue, Helvetica, Arial, sans-serif"
          fallbackFontFamily="sans-serif"
        />
      </Head>
      <Preview>Superior AI Admin Login Code</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans text-slate-900">
          <Container className="mx-auto my-12 w-full max-w-[480px] rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Enterprise Top Accent Line */}
            <div className="h-1.5 w-full bg-slate-900" />

            <div className="px-8 py-10">
              {/* Header */}
              <Section className="mb-8">
                <Text className="m-0 text-xl font-bold tracking-tight text-slate-900">
                  Superior AI <span className="text-slate-400 font-normal">Admin</span>
                </Text>
              </Section>

              {/* Context / Greeting */}
              <Section className="mb-6">
                <Text className="m-0 mb-2 text-lg font-semibold text-slate-900">
                  Authentication Required
                </Text>
                <Text className="m-0 text-sm leading-6 text-slate-600">
                  A login attempt requires further verification. Please use the following one-time passcode to access your administrator dashboard.
                </Text>
              </Section>

              {/* Prominent OTP Block - FIXED FOR EMAIL CLIENTS */}
              <Section className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-6 text-center">
                <Text className="m-0 mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 text-center">
                  Verification Code
                </Text>
                
                {/* Replaced flex with inline-block and line-height for vertical centering */}
                <div className="text-center">
                  {otpCode.split("").map((digit, index) => (
                    <div
                      key={`${digit}-${index}`}
                      className="inline-block mx-1.5 h-14 w-11 rounded-md border border-slate-300 bg-white text-2xl font-semibold text-slate-800"
                      style={{ lineHeight: '56px', textAlign: 'center' }}
                    >
                      {digit}
                    </div>
                  ))}
                </div>
                
                <Text className="m-0 mt-4 text-[13px] text-slate-500 text-center">
                  Valid for 10 minutes.
                </Text>
              </Section>

              {/* Security Warning */}
              <Section className="mb-8">
                <Text className="m-0 text-sm leading-6 text-slate-600">
                  If you did not initiate this request, please contact the security team immediately or safely ignore this email. Do not share this code with anyone.
                </Text>
              </Section>

              <Hr className="my-6 border-slate-200" />

              {/* Corporate Footer */}
              <Section>
                <Text className="m-0 mb-2 text-xs font-semibold text-slate-500">
                  Superior AI
                </Text>
                <Text className="m-0 mb-4 text-xs leading-5 text-slate-400">
                  Secure voice receptionist platform for universities and enterprises.
                  <br />
                  This is an automated message, please do not reply.
                </Text>
                <Text className="m-0 text-xs text-slate-400">
                  &copy; {new Date().getFullYear()} Superior AI. All rights reserved.
                </Text>
              </Section>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}