import { Resend } from "resend";
import EmailVerificationEmail from "@/emails/email-verification";
import OrgInviteEmail from "@/emails/org-invite";
import PasswordResetEmail from "@/emails/password-reset";
import { env } from "./env";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetLink,
}: {
  email: string;
  name: string;
  resetLink: string;
}) => {
  await resend.emails.send({
    from: "Mizu HR <no-reply@mail.mizuhr.com>",
    to: [email],
    subject: "Reset your password",
    react: <PasswordResetEmail name={name} resetLink={resetLink} />,
  });
};

export const sendVerificationEmail = async ({
  email,
  name,
  verificationLink,
}: {
  email: string;
  name: string;
  verificationLink: string;
}) => {
  await resend.emails.send({
    from: "Mizu HR <no-reply@mail.mizuhr.com>",
    to: [email],
    subject: "Verify your email address",
    react: <EmailVerificationEmail name={name} verificationLink={verificationLink} />,
  });
};

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
