import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Listing doctors...");
  try {
    console.log("Querying doctors with service-like query...");
    const doctors = await prisma.doctor.findMany({
      where: { deleted_at: null },
      include: {
        hospitals: { include: { hospital: true } },
        specializations: { include: { specialization: true } },
      },
    });
    console.log(`Found ${doctors.length} doctors.`);
    doctors.forEach((d: any) => {
      console.log(`- ${d.name}`);
      console.log(`  Hospitals: ${d.hospitals.map((h: any) => h.hospital.name).join(", ")}`);
      console.log(`  Specs: ${d.specializations.map((s: any) => s.specialization.name).join(", ")}`);
    });
  } catch (error) {
    console.error("Error listing doctors:", error);
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
