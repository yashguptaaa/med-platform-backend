import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- CHECKING DOCTOR LINK ---");
  const email = "doctor@example.com";
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("❌ User NOT FOUND.");
    return;
  }
  console.log(`✅ User found: ${user.id} (${user.role})`);

  const doctor = await prisma.doctor.findUnique({ where: { user_id: user.id } });
  if (!doctor) {
    console.log("❌ Doctor profile with userId matching User ID NOT FOUND.");
    
    // Check if ANY doctor exists
    const anyDoctor = await prisma.doctor.findFirst();
    if (anyDoctor) {
      console.log(`⚠️ Found a doctor (ID: ${anyDoctor.id}), but user_id is: ${anyDoctor.user_id}`);
    } else {
      console.log("❌ No doctors found in database at all.");
    }
  } else {
    console.log(`✅ Doctor profile found: ${doctor.id}`);
    console.log(`   Linked to User ID: ${doctor.user_id}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
