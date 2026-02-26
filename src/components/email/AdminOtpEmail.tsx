import { Html, Head, Preview, Body, Container, Section, Text, Hr, Tailwind } from "@react-email/components";

interface AdminOtpEmailProps {
  otpCode: string;
}

export default function AdminOtpEmail({ otpCode }: AdminOtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Superior AI Admin Login Code</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-900">
          <Container className="mx-auto my-10 w-full max-w-md rounded-xl bg-white px-8 py-10 shadow-xl border border-gray-200">
            <Section className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-lg font-bold shadow-md">
                  <span>SA</span>
                </div>
                <div>
                  <Text className="m-0 text-lg font-bold text-gray-900">Superior AI</Text>
                  <Text className="m-0 text-xs uppercase tracking-widest text-gray-400">Admin Access</Text>
                </div>
              </div>
              <Text className="m-0 text-base font-semibold text-indigo-700">Admin Login Verification</Text>
            </Section>

            <Section className="mb-8 text-center">
              <Text className="m-0 mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                One-Time Passcode
              </Text>
              <Text className="m-0 mb-4 text-2xl font-bold text-gray-900">
                Enter this code to access your admin dashboard
              </Text>
              <Section className="flex justify-center gap-2 mb-4">
                {otpCode.split("").map((digit, index) => (
                  <div
                    key={`${digit}-${index}`}
                    className="flex h-14 w-12 items-center justify-center rounded-lg border border-indigo-200 bg-gray-50 text-2xl font-bold tracking-widest text-indigo-700 shadow"
                  >
                    {digit}
                  </div>
                ))}
              </Section>
              <Text className="m-0 text-xs text-gray-500">
                This code is valid for 10 minutes. Do not share it with anyone.
              </Text>
            </Section>

            <Section className="mb-6">
              <Text className="m-0 text-xs text-gray-600 text-center">
                If you did not request this code, you can safely ignore this email. The code will expire automatically.
              </Text>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Section className="text-center">
              <Text className="m-0 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Superior AI
              </Text>
              <Text className="m-0 text-xs text-gray-400">
                Secure voice receptionist platform for universities and enterprises.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

