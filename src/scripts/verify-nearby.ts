import { prisma } from "../config/database";
import { getNearbyHospitals } from "../hospitals/hospital.service";

async function main() {
  console.log("Starting verification for Nearby Hospitals...");

  // 1. Create Test Data
  // User location: 0, 0
  // Hospital Near: 0.1, 0 (~11km)
  // Hospital Far: 1.0, 0 (~111km)
  
  const hospitalNear = await prisma.hospital.create({
    data: {
      name: "Test Hospital Near",
      city: "Test City",
      address: "Near Address",
      latitude: 0.1,
      longitude: 0,
    }
  });

  const hospitalFar = await prisma.hospital.create({
    data: {
      name: "Test Hospital Far",
      city: "Test City",
      address: "Far Address",
      latitude: 1.0,
      longitude: 0,
    }
  });

  console.log("Created test hospitals:", { near: hospitalNear.id, far: hospitalFar.id });

  try {
    // 2. Call Service
    console.log("Fetching hospitals near 0,0...");
    const query = { lat: 0, lng: 0, page: 1, limit: 10, radius: 200 };
    const result = await getNearbyHospitals(query);

    console.log(`Found ${result.data.length} hospitals.`);
    
    // Filter to our test hospitals to check order
    const foundNear = result.data.find((h: any) => h.id === hospitalNear.id);
    const foundFar = result.data.find((h: any) => h.id === hospitalFar.id);

    if (foundNear && foundFar) {
      console.log(`Near Hospital Distance: ${foundNear.distance} km`);
      console.log(`Far Hospital Distance: ${foundFar.distance} km`);

      if (foundNear.distance < foundFar.distance) {
        console.log("SUCCESS: Near hospital is closer than Far hospital.");
      } else {
        console.error("FAILURE: Sorting logic is incorrect.");
      }
      
      // Check if they appear in correct order in the list (relative to each other)
      const indexNear = result.data.indexOf(foundNear);
      const indexFar = result.data.indexOf(foundFar);
      
      if (indexNear < indexFar) {
         console.log("SUCCESS: Near hospital appears before Far hospital in the list.");
      } else {
         console.error("FAILURE: List order is incorrect.");
      }

    } else {
      console.error("FAILURE: Could not find created test hospitals in the result.");
    }

  } catch (err) {
    console.error("Error during verification:", err);
  } finally {
    // 3. Cleanup
    console.log("Cleaning up...");
    await prisma.hospital.delete({ where: { id: hospitalNear.id } });
    await prisma.hospital.delete({ where: { id: hospitalFar.id } });
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
