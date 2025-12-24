import { prisma } from "../config/database";

async function main() {
  console.log("Checking DB Content...");

  // 1. Check if we can count hospitals using Prisma Client
  try {
    const prismaCount = await prisma.hospital.count();
    console.log("Prisma Client Hospital Count:", prismaCount);
  } catch (e) {
    console.error("Prisma Client Count Failed:", e);
  }

  // 2. Check Raw Table presence and Name
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables in DB:", tables);
  } catch (e) {
    console.error("List tables failed:", e);
  }

  // 3. Check Count via Raw SQL with "Hospital" checks
  try {
    const rawCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "Hospital"`;
    console.log("Raw Count 'Hospital':", rawCount);
  } catch (e) {
    console.log("Raw Count 'Hospital' failed (Table likely doesn't exist with that Case)");
  }

  try {
    const rawCountLower = await prisma.$queryRaw`SELECT COUNT(*) FROM "hospital"`;
    console.log("Raw Count 'hospital':", rawCountLower);
  } catch (e) {
    console.log("Raw Count 'hospital' failed");
  }

  // 4. Check contents specifically for lat/lng
  try {
    const hospitals = await prisma.hospital.findMany({
      select: { id: true, name: true, latitude: true, longitude: true, deleted_at: true }
    });
    console.log("Actual Hospital Rows:", JSON.stringify(hospitals, null, 2));
  } catch (e) {
    console.error("Fetch hospitals failed:", e);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
