import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../utils/password";

const prisma = new PrismaClient();

async function main() {
  const email = "doctor@example.com";
  const password = "password123";
  const name = "Dr. Test User";

  console.log("Creating test doctor...");

  // Check if user exists
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const passwordHash = await hashPassword(password);
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
        role: UserRole.DOCTOR,
      },
    });
    console.log(`Created user: ${user.email}`);
  } else {
    // Update role if exists
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: UserRole.DOCTOR },
    });
    console.log(`Updated user role: ${user.email}`);
  }

  // Check if doctor profile exists
  let doctor = await prisma.doctor.findUnique({ where: { user_id: user.id } });

  if (!doctor) {
    doctor = await prisma.doctor.create({
      data: {
        name: user.name,
        city: "New York",
        years_of_experience: 10,
        user_id: user.id,
        // about: "Expert in general medicine.", // 'about' might not be in schema yet, let's check or omit
      },
    });
    console.log(`Created doctor profile for: ${user.name}`);
  } else {
    console.log(`Doctor profile already exists for: ${user.name}`);
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
