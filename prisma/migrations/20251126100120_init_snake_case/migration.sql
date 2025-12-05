/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `yearsOfExperience` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `adminFeedback` on the `DoctorChangeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `DoctorChangeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `DoctorChangeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `DoctorChangeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedChanges` on the `DoctorChangeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `DoctorChangeRequest` table. All the data in the column will be lost.
  - The primary key for the `DoctorHospital` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doctorId` on the `DoctorHospital` table. All the data in the column will be lost.
  - You are about to drop the column `hospitalId` on the `DoctorHospital` table. All the data in the column will be lost.
  - The primary key for the `DoctorSpecialization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `doctorId` on the `DoctorSpecialization` table. All the data in the column will be lost.
  - You are about to drop the column `specializationId` on the `DoctorSpecialization` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `googleMapLink` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Hospital` table. All the data in the column will be lost.
  - The primary key for the `HospitalSpecialization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hospitalId` on the `HospitalSpecialization` table. All the data in the column will be lost.
  - You are about to drop the column `specializationId` on the `HospitalSpecialization` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Specialization` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Specialization` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Specialization` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctor_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patient_id` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_of_week` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `years_of_experience` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `DoctorChangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requested_changes` to the `DoctorChangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `DoctorChangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `DoctorHospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_id` to the `DoctorHospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `DoctorSpecialization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization_id` to the `DoctorSpecialization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hospital_id` to the `HospitalSpecialization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialization_id` to the `HospitalSpecialization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Specialization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_userId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorChangeRequest" DROP CONSTRAINT "DoctorChangeRequest_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorHospital" DROP CONSTRAINT "DoctorHospital_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorHospital" DROP CONSTRAINT "DoctorHospital_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSpecialization" DROP CONSTRAINT "DoctorSpecialization_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSpecialization" DROP CONSTRAINT "DoctorSpecialization_specializationId_fkey";

-- DropForeignKey
ALTER TABLE "HospitalSpecialization" DROP CONSTRAINT "HospitalSpecialization_hospitalId_fkey";

-- DropForeignKey
ALTER TABLE "HospitalSpecialization" DROP CONSTRAINT "HospitalSpecialization_specializationId_fkey";

-- DropIndex
DROP INDEX "Doctor_userId_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "doctorId",
DROP COLUMN "hospitalId",
DROP COLUMN "patientId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "doctor_id" TEXT NOT NULL,
ADD COLUMN     "hospital_id" TEXT NOT NULL,
ADD COLUMN     "patient_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "createdAt",
DROP COLUMN "dayOfWeek",
DROP COLUMN "deletedAt",
DROP COLUMN "doctorId",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "day_of_week" INTEGER NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "doctor_id" TEXT NOT NULL,
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ContactMessage" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "hospitalId",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "yearsOfExperience",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "hospital_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "years_of_experience" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DoctorChangeRequest" DROP COLUMN "adminFeedback",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "doctorId",
DROP COLUMN "requestedChanges",
DROP COLUMN "updatedAt",
ADD COLUMN     "admin_feedback" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "doctor_id" TEXT NOT NULL,
ADD COLUMN     "requested_changes" JSONB NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DoctorHospital" DROP CONSTRAINT "DoctorHospital_pkey",
DROP COLUMN "doctorId",
DROP COLUMN "hospitalId",
ADD COLUMN     "doctor_id" TEXT NOT NULL,
ADD COLUMN     "hospital_id" TEXT NOT NULL,
ADD CONSTRAINT "DoctorHospital_pkey" PRIMARY KEY ("doctor_id", "hospital_id");

-- AlterTable
ALTER TABLE "DoctorSpecialization" DROP CONSTRAINT "DoctorSpecialization_pkey",
DROP COLUMN "doctorId",
DROP COLUMN "specializationId",
ADD COLUMN     "doctor_id" TEXT NOT NULL,
ADD COLUMN     "specialization_id" TEXT NOT NULL,
ADD CONSTRAINT "DoctorSpecialization_pkey" PRIMARY KEY ("doctor_id", "specialization_id");

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "googleMapLink",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "google_map_link" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HospitalSpecialization" DROP CONSTRAINT "HospitalSpecialization_pkey",
DROP COLUMN "hospitalId",
DROP COLUMN "specializationId",
ADD COLUMN     "hospital_id" TEXT NOT NULL,
ADD COLUMN     "specialization_id" TEXT NOT NULL,
ADD CONSTRAINT "HospitalSpecialization_pkey" PRIMARY KEY ("hospital_id", "specialization_id");

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Specialization" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "passwordHash",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_user_id_key" ON "Doctor"("user_id");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHospital" ADD CONSTRAINT "DoctorHospital_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHospital" ADD CONSTRAINT "DoctorHospital_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialization" ADD CONSTRAINT "DoctorSpecialization_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalSpecialization" ADD CONSTRAINT "HospitalSpecialization_specialization_id_fkey" FOREIGN KEY ("specialization_id") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "Hospital"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorChangeRequest" ADD CONSTRAINT "DoctorChangeRequest_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
