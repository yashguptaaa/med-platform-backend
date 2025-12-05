import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "doctor@example.com";
  console.log(`Checking for user with email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { doctor: true },
  });

  if (!user) {
    console.log("❌ User NOT found.");
  } else {
    console.log("✅ User found:");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    
    if (user.doctor) {
      console.log("✅ Linked Doctor Profile found:");
      console.log(`   Doctor ID: ${user.doctor.id}`);
      console.log(`   Doctor Name: ${user.doctor.name}`);
    } else {
      console.log("❌ Linked Doctor Profile NOT found.");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
