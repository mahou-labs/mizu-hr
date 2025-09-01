import { Resend } from "resend";
import OrgInviteEmail from "@/emails/org-invite";
import { env } from "./env";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendOrgInvite = async ({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) => {
  await resend.emails.send({
    from: "Nicolas - Mizu HR <nicolas@mail.mizuhr.com>",
    to: [email],
    subject: "You've been invited to join an organization",
    react: (
      <OrgInviteEmail
        invitedBy={invitedByUsername}
        invitedByEmail={invitedByEmail}
        inviteLink={inviteLink}
        name={email}
        organization={teamName}
      />
    ),
  });
};
