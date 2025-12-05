import { listDoctors } from "../doctors/doctor.service";
import { listHospitals } from "../hospitals/hospital.service";
import { listSpecializations } from "../specializations/specialization.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- DEBUGGING ADMIN APIs ---");

  try {
    console.log("1. Testing listHospitals...");
    const hospitals = await listHospitals({ page: 1, limit: 10 });
    console.log(`✅ Success. Found ${hospitals.data.length} hospitals.`);
  } catch (e) {
    console.error("❌ listHospitals FAILED:", e);
  }

  try {
    console.log("2. Testing listDoctors...");
    const doctors = await listDoctors({ page: 1, limit: 10 });
    console.log(`✅ Success. Found ${doctors.data.length} doctors.`);
  } catch (e) {
    console.error("❌ listDoctors FAILED:", e);
  }

  try {
    console.log("3. Testing listSpecializations...");
    const specs = await listSpecializations({ page: 1, limit: 10 });
    console.log(`✅ Success. Found ${specs.data.length} specializations.`);
  } catch (e) {
    console.error("❌ listSpecializations FAILED:", e);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
