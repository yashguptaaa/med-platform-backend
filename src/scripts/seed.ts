import { prisma } from "@/config/database";
import { hashPassword } from "@/utils/password";
import { logger } from "@/utils/logger";

async function main() {
  logger.info("Resetting database...");
  await prisma.contactMessage.deleteMany();
  await prisma.job.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.specialization.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await hashPassword("Admin123!");
  const userPassword = await hashPassword("User123!");
  const doctorPassword = await hashPassword("Doctor123!");

  const [admin, user] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Yash",
        email: "ygupta9414@gmail.com",
        password: adminPassword,
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        name: "Patient User",
        email: "yashji1405@gmail.com",
        password: userPassword,
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Doctor User",
        email: "doctor@example,.com",
        password: doctorPassword,
        role: "DOCTOR",
      },
    }),
  ]);

  logger.info({ admin: admin.email, user: user.email }, "Seeded users");

  // Seed Specializations
  const specs = await Promise.all([
    prisma.specialization.create({ data: { name: "Cardiology", description: "Heart and blood vessel disorders" } }),
    prisma.specialization.create({ data: { name: "Emergency Care", description: "Immediate medical attention" } }),
    prisma.specialization.create({ data: { name: "Orthopedics", description: "Musculoskeletal system" } }),
    prisma.specialization.create({ data: { name: "Neurology", description: "Nervous system disorders" } }),
    prisma.specialization.create({ data: { name: "Dermatology", description: "Skin, hair, and nail conditions" } }),
    prisma.specialization.create({ data: { name: "General Medicine", description: "Primary care and general health" } }),
    prisma.specialization.create({ data: { name: "Pediatrics", description: "Medical care of infants, children, and adolescents" } }),
    prisma.specialization.create({ data: { name: "ENT", description: "Ear, Nose, and Throat" } }),
  ]);

  const specMap = specs.reduce((acc, spec) => {
    acc[spec.name] = spec.id;
    return acc;
  }, {} as Record<string, string>);

  // Seed Hospitals
  const hospitals = await Promise.all(
    [
      {
        name: "CityCare Medical Center",
        city: "San Francisco, CA",
        address: "455 Mission Street, San Francisco, CA",
        rating: 4.8,
        specializations: ["Cardiology", "Emergency Care", "Orthopedics"],
      },
      {
        name: "Harborview Specialty Clinic",
        city: "Seattle, WA",
        address: "801 Water Ave, Seattle, WA",
        rating: 4.7,
        specializations: ["Neurology", "Dermatology", "General Medicine"],
      },
      {
        name: "Green Valley Family Hospital",
        city: "Austin, TX",
        address: "32 Barton Springs Rd, Austin, TX",
        rating: 4.6,
        specializations: ["Pediatrics", "General Medicine", "ENT"],
      },
    ].map((hospital) => 
      prisma.hospital.create({ 
        data: {
          name: hospital.name,
          city: hospital.city,
          address: hospital.address,
          rating: hospital.rating,
          specializations_list: hospital.specializations, // Legacy
          specializations: {
            create: hospital.specializations.map(name => ({ 
              specialization: { connect: { id: specMap[name] } }
            }))
          }
        } 
      })
    )
  );

  logger.info({ count: hospitals.length }, "Seeded hospitals");

  // Seed Doctors
  await Promise.all([
    prisma.doctor.create({
      data: {
        name: "Dr. Priya Kapoor",
        specialization: "Cardiology", // Legacy
        years_of_experience: 14,
        rating: 4.9,
        city: "San Francisco, CA",
        hospitals: {
          create: [{ hospital: { connect: { id: hospitals[0].id } } }]
        },
        specializations: {
          create: [{ specialization: { connect: { id: specMap["Cardiology"] } } }]
        }
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. Marcus Hale",
        specialization: "Neurology", // Legacy
        years_of_experience: 11,
        rating: 4.8,
        city: "Seattle, WA",
        hospitals: {
          create: [{ hospital: { connect: { id: hospitals[1].id } } }]
        },
        specializations: {
          create: [{ specialization: { connect: { id: specMap["Neurology"] } } }]
        }
      },
    }),
    prisma.doctor.create({
      data: {
        name: "Dr. Aisha Noor",
        specialization: "Pediatrics", // Legacy
        years_of_experience: 10,
        rating: 4.7,
        city: "Austin, TX",
        hospitals: {
          create: [{ hospital: { connect: { id: hospitals[2].id } } }]
        },
        specializations: {
          create: [{ specialization: { connect: { id: specMap["Pediatrics"] } } }]
        }
      },
    }),
  ]);

  await prisma.job.createMany({
    data: [
      {
        title: "Senior Backend Engineer",
        location: "Remote (US)",
        description:
          "Own APIs that power doctor search, booking, and analytics.",
        department: "Engineering",
        is_active: true,
      },
      {
        title: "Frontend Engineer",
        location: "Hybrid · San Francisco",
        description:
          "Craft pixel-perfect experiences across web and mobile web.",
        department: "Engineering",
        is_active: true,
      },
      {
        title: "Product Manager",
        location: "Remote (US)",
        description: "Drive patient-facing roadmaps with providers and payers.",
        department: "Product",
        is_active: true,
      },
    ],
  });

  logger.info("Seed data inserted successfully");

  // Create Test Doctor
  const testDoctorEmail = "doctor@example.com";
  const testDoctorPassword = await hashPassword("password123");
  
  let testUser = await prisma.user.findUnique({ where: { email: testDoctorEmail } });
  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        email: testDoctorEmail,
        name: "Dr. Test User",
        password: testDoctorPassword,
        role: "DOCTOR",
      }
    });
    logger.info(`Created test user: ${testUser.email}`);
  }

  const testDoctor = await prisma.doctor.findUnique({ where: { user_id: testUser.id } });
  if (!testDoctor) {
    await prisma.doctor.create({
      data: {
        name: testUser.name,
        city: "New York",
        years_of_experience: 5,
        user_id: testUser.id,
        specializations: {
            create: [{ specialization: { connect: { name: "General Medicine" } } }]
        }
      }
    });
    logger.info(`Created test doctor profile for: ${testUser.name}`);
  }
}

main()
  .catch((error) => {
    logger.error({ error }, "Seed script failed");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
