import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type PasswordResetEmailProps = {
  name: string;
  resetLink: string;
};

export default function PasswordResetEmail({ name, resetLink }: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Tailwind>
        <Head>
          <style>{`
            .btn-primary:hover {
              background-color: rgb(29 78 216);
            }
            .link-primary:hover {
              color: rgb(30 64 175);
            }
          `}</style>
        </Head>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-2xl px-4 py-8">
            {/* Header */}
            <Section className="mb-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-2xl">🔐</span>
                </div>
                <Heading className="mb-2 font-bold text-3xl text-gray-900">
                  Reset Your Password
                </Heading>
                <Text className="text-gray-600 text-lg">Hi {name}, we received your request</Text>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="mb-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <Text className="mb-6 text-base text-gray-700 leading-relaxed">
                We received a request to reset your password for your Mizu HR account. Click the
                button below to choose a new password.
              </Text>

              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
                <Text className="mt-0 mb-2 font-medium text-amber-800 text-sm">
                  Important security information:
                </Text>
                <ul className="mb-0 list-disc space-y-1 pl-4 text-amber-700 text-sm">
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, you can safely ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  className="btn-primary inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-decoration-none text-white shadow-sm transition-colors duration-200"
                  href={resetLink}
                >
                  Reset Password
                </Button>
              </div>

              <Text className="mt-6 text-center text-gray-500 text-sm">
                Or copy and paste this link in your browser:
              </Text>
              <Link
                className="link-primary block break-all text-center text-blue-600 text-sm"
                href={resetLink}
              >
                {resetLink}
              </Link>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-gray-500 text-xs leading-relaxed">
                This email was sent because a password reset was requested for your Mizu HR account.
                <br />
                If you didn't make this request, please ignore this email or contact support if you
                have concerns.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

PasswordResetEmail.PreviewProps = {
  name: "John Doe",
  resetLink: "https://app.mizuhr.com/auth/reset-password?token=abc123",
};
