import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { toCamelCase } from "@/utils/transform";
import type { CreateReviewDto } from "./review.validator";

const createReview = async (userId: string, data: CreateReviewDto) => {
  // 1. Verify appointment exists and belongs to user
  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
    include: { review: true },
  });

  if (!appointment) {
    throw new AppError("Appointment not found", StatusCodes.NOT_FOUND);
  }

  if (appointment.patient_id !== userId) {
    throw new AppError("Unauthorized to review this appointment", StatusCodes.FORBIDDEN);
  }

  if (appointment.status !== "COMPLETED") {
    throw new AppError("Only completed appointments can be reviewed", StatusCodes.BAD_REQUEST);
  }

  if (appointment.review) {
    throw new AppError("You have already reviewed this appointment", StatusCodes.CONFLICT);
  }

  // Check if user has already reviewed this doctor
  const existingReview = await prisma.review.findFirst({
    where: {
      patient_id: userId,
      doctor_id: appointment.doctor_id,
    },
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this doctor", StatusCodes.CONFLICT);
  }

  // 2. Create Review and Update Doctor Rating in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create Review
    const review = await tx.review.create({
      data: {
        patient_id: userId,
        doctor_id: appointment.doctor_id,
        appointment_id: appointment.id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Recalculate Doctor Average Rating and Count
    const aggregations = await tx.review.aggregate({
      where: { doctor_id: appointment.doctor_id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const newRating = aggregations._avg.rating || 0;
    const reviewCount = aggregations._count.rating || 0;

    // Update Doctor
    await tx.doctor.update({
      where: { id: appointment.doctor_id },
      data: { 
        rating: newRating,
        review_count: reviewCount,
      },
    });

    return review;
  });

  return toCamelCase(result);
};

export { createReview };
