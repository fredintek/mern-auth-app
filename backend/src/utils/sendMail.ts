import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const getFromEmail = () =>
  NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;

const getRecipientEmail = (recipient: string | string[]) =>
  NODE_ENV === "development" ? "delivered@resend.dev" : recipient;

export const sendMail = async ({ to, subject, html, text }: Params) => {
  return await resend.emails.send({
    from: getFromEmail(),
    to: getRecipientEmail(to),
    subject,
    html,
    text,
  });
};
