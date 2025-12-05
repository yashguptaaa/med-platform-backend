/*
  Warnings:

  - You are about to drop the `_DoctorToHospital` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DoctorToSpecialization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_HospitalToSpecialization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DoctorToHospital" DROP CONSTRAINT "_DoctorToHospital_A_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToHospital" DROP CONSTRAINT "_DoctorToHospital_B_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToSpecialization" DROP CONSTRAINT "_DoctorToSpecialization_A_fkey";

-- DropForeignKey
ALTER TABLE "_DoctorToSpecialization" DROP CONSTRAINT "_DoctorToSpecialization_B_fkey";

-- DropForeignKey
ALTER TABLE "_HospitalToSpecialization" DROP CONSTRAINT "_HospitalToSpecialization_A_fkey";

-- DropForeignKey
ALTER TABLE "_HospitalToSpecialization" DROP CONSTRAINT "_HospitalToSpecialization_B_fkey";

-- DropTable
DROP TABLE "_DoctorToHospital";

-- DropTable
DROP TABLE "_DoctorToSpecialization";

-- DropTable
DROP TABLE "_HospitalToSpecialization";

-- CreateTable
CREATE TABLE "DoctorHospital" (
    "doctorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "DoctorHospital_pkey" PRIMARY KEY ("doctorId","hospitalId")
);

-- CreateTable
CREATE TABLE "DoctorSpecialization" (
    "doctorId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,

    CONSTRAINT "DoctorSpecialization_pkey" PRIMARY KEY ("doctorId","specializationId")
);

-- CreateTable
CREATE TABLE "HospitalSpecialization" (
    "hospitalId" TEXT NOT NULL,
    "specializationId" TEXT NOT NULL,

    CONSTRAINT "HospitalSpecialization_pkey" PRIMARY KEY ("hospitalId","specializationId")
);

-- AddForeignKey
ALTER TABLE "DoctorHospital" ADD CONSTRAINT "DoctorHospital_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHospital" ADD CONSTRAINT "DoctorHospital_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
