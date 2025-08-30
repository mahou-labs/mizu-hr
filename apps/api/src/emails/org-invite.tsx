import { Heading, Html, Link, Text } from "@react-email/components";

type OrgInviteEmailProps = {
  name: string;
  invitedBy: string;
  organization: string;
  inviteLink: string;
};

export default function OrgInviteEmail({
  name,
  invitedBy,
  organization,
  inviteLink,
}: OrgInviteEmailProps) {
  return (
    <Html lang="en">
      <Heading>Welcome, {name}!</Heading>
      <Text>
        You've been invited to join {organization} by {invitedBy}.
      </Text>
      <Link href={inviteLink}>Accept Invitation</Link>
    </Html>
  );
}

OrgInviteEmail.PreviewProps = {
  name: "John Doe",
  invitedBy: "Joanne Doe",
  organization: "Organization",
  inviteLink: "https://example.com",
};
