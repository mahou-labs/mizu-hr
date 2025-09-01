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

type OrgInviteEmailProps = {
  name: string;
  invitedBy: string;
  invitedByEmail: string;
  organization: string;
  inviteLink: string;
};

export default function OrgInviteEmail({
  name,
  invitedBy,
  invitedByEmail,
  organization,
  inviteLink,
}: OrgInviteEmailProps) {
  return (
    <Html lang="en">
      <Tailwind>
        <Head>
          <style>{`
            .space-y-1 > * + * {
              margin-top: 0.25rem;
            }
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
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-2xl">🎉</span>
                </div>
                <Heading className="mb-2 font-bold text-3xl text-gray-900">
                  You're Invited!
                </Heading>
                <Text className="text-gray-600 text-lg">
                  Welcome to {organization}, {name}
                </Text>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="mb-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <Text className="mb-6 text-base text-gray-700 leading-relaxed">
                <strong>{invitedBy}</strong> ({invitedByEmail}) has invited you
                to join <strong>{organization}</strong> on Mizu HR. We're
                excited to have you as part of the team!
              </Text>

              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
                <Text className="mt-0 mb-2 font-medium text-blue-800 text-sm">
                  What happens next?
                </Text>
                <ul className="mb-0 space-y-1 text-blue-700 text-sm">
                  <li>Click the button below to accept your invitation</li>
                  <li>Complete your profile setup</li>
                  <li>Start collaborating with your new team</li>
                </ul>
              </div>

              <div className="text-center">
                <Button
                  className="btn-primary inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-decoration-none text-white shadow-sm transition-colors duration-200"
                  href={inviteLink}
                >
                  Accept Invitation
                </Button>
              </div>

              <Text className="mt-6 text-center text-gray-500 text-sm">
                Or copy and paste this link in your browser:
              </Text>
              <Link
                className="link-primary block break-all text-center text-blue-600 text-sm"
                href={inviteLink}
              >
                {inviteLink}
              </Link>
            </Section>

            {/* Footer */}
            <Section className="text-center">
              <Text className="text-gray-500 text-xs leading-relaxed">
                This invitation was sent by {invitedBy} ({invitedByEmail}) from{" "}
                {organization}.
                <br />
                If you weren't expecting this invitation, you can safely ignore
                this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

OrgInviteEmail.PreviewProps = {
  name: "John Doe",
  invitedBy: "Joanne Doe",
  invitedByEmail: "joanne@example.com",
  organization: "Organization",
  inviteLink: "https://example.com",
};
