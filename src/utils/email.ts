import { Resend } from "resend";
import { appConfig } from "@/config/env";
import { logger } from "@/utils/logger";

const resend = new Resend(appConfig.email.resendApiKey);

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: appConfig.email.from,
      to,
      subject,
      text,
      html,
    });

    if (error) {
      logger.error({ error }, "Resend API returned error");
      // We log but don't throw to prevent blocking the main flow if email fails
      // or we can throw if critical. For notifications, usually better to log.
      return false;
    }

    logger.info({ id: data?.id }, "Email sent successfully");
    return true;
  } catch (error) {
    logger.warn({ error }, "Failed to send email");
    return false;
  }
};
