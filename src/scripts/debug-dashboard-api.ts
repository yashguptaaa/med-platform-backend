import { getMyProfile } from "../doctor-dashboard/dashboard.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- DEBUGGING DASHBOARD API ---");

  const email = "doctor@example.com";
  console.log(`Looking for user: ${email}`);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("❌ User not found!");
    return;
  }
  console.log(`✅ User found: ${user.id} (${user.role})`);

  try {
    console.log("Calling getMyProfile...");
    const profile = await getMyProfile(user.id);
    console.log("✅ getMyProfile Success!");
    console.log("Profile Name:", profile.name);
    console.log("Hospitals:", profile.hospitals.length);
    console.log("Specializations:", profile.specializations.length);
  } catch (e) {
    console.error("❌ getMyProfile FAILED:", e);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
