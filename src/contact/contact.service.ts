import { prisma } from "@/config/database";
import { appConfig } from "@/config/env";
import { sendEmail } from "@/utils/email";
import type { ContactRequestDto, ContactResponseDto } from "./contact.dto";

const submitContact = async (
  payload: ContactRequestDto
): Promise<ContactResponseDto> => {
  await prisma.contactMessage.create({
    data: payload,
  });

  await sendEmail(
    appConfig.email.supportAddress,
    `New contact message from ${payload.name}`,
    `${payload.message}\n\nFrom: ${payload.name}\nEmail: ${payload.email}`
  );

  return { success: true };
};

export {
  submitContact,
};
