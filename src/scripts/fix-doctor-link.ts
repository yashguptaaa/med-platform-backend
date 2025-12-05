import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- FIXING DOCTOR LINK ---");
  const email = "doctor@example.com";
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log("❌ User 'doctor@example.com' NOT FOUND. Cannot fix.");
    return;
  }
  console.log(`✅ User found: ${user.id}`);

  // Try to find doctor by userId
  let doctor = await prisma.doctor.findUnique({ where: { user_id: user.id } });
  
  if (doctor) {
    console.log("✅ Doctor is ALREADY linked correctly.");
    return;
  }

  console.log("⚠️ Doctor not linked. Searching by name...");
  // Try to find by name (from seed)
  doctor = await prisma.doctor.findFirst({ where: { name: "Dr. Test User" } });

  if (doctor) {
    console.log(`✅ Found doctor by name: ${doctor.id}. Linking now...`);
    await prisma.doctor.update({
      where: { id: doctor.id },
      data: { user_id: user.id },
    });
    console.log("✅ Linked successfully!");
  } else {
    console.log("⚠️ Doctor not found by name. Creating NEW profile...");
    await prisma.doctor.create({
      data: {
        name: user.name,
        user_id: user.id,
        city: "New York",
        years_of_experience: 5,
        rating: 5.0,
        specializations: {
            create: [{ specialization: { connect: { name: "General Medicine" } } }]
        }
      }
    });
    console.log("✅ Created and linked new doctor profile!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
