import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { AppointmentStatus } from "@prisma/client";
import { toCamelCase } from "@/utils/transform";
import { format, parseISO, getDay } from "date-fns";
import { generateTimeSlots } from "./appointment.helper";
import { sendEmail } from "@/utils/email";
import type { AppointmentQueryDto, CreateAppointmentDto } from "./appointment.validator";

const getAvailableSlots = async (doctorId: string, dateStr: string) => {
  const date = parseISO(dateStr);
  const dayOfWeek = getDay(date);

  // 1. Get Doctor's Availability for this day
  const availability = await prisma.availability.findFirst({
    where: {
      doctor_id: doctorId,
      day_of_week: dayOfWeek,
    },
  });

  if (!availability) {
    return [];
  }

  // 2. Get existing appointments for this date
  // We need to match the date part. Prisma date filtering can be tricky with timezones.
  // Best to use a range for the whole day.
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      doctor_id: doctorId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        not: "CANCELLED",
      },
    },
  });

  // 3. Extract booked times
  const bookedSlots = appointments.map((appt) => format(appt.date, "HH:mm"));

  // 4. Generate slots
  return generateTimeSlots(
    availability.start_time,
    availability.end_time,
    date,
    bookedSlots
  );
};

const createAppointment = async (userId: string, data: CreateAppointmentDto) => {
  // Verify doctor exists and get email
  const doctor = await prisma.doctor.findUnique({ 
    where: { id: data.doctorId },
    include: { user: true }
  });
  if (!doctor) throw new AppError("Doctor not found", StatusCodes.NOT_FOUND);

  // Verify hospital exists
  const hospital = await prisma.hospital.findUnique({ where: { id: data.hospitalId } });
  if (!hospital) throw new AppError("Hospital not found", StatusCodes.NOT_FOUND);

  // Conflict Check
  const dateStr = format(new Date(data.date), "yyyy-MM-dd");
  const timeStr = format(new Date(data.date), "HH:mm");
  const availableSlots = await getAvailableSlots(data.doctorId, dateStr);

  if (!availableSlots.includes(timeStr)) {
    throw new AppError("Selected slot is no longer available", StatusCodes.CONFLICT);
  }

  const appointment = await prisma.appointment.create({
    data: {
      patient_id: userId,
      doctor_id: data.doctorId,
      hospital_id: data.hospitalId,
      date: new Date(data.date),
      reason: data.reason,
      status: "PENDING",
    },
    include: {
      doctor: true,
      hospital: true,
      patient: { select: { id: true, name: true, email: true } },
    },
  });

  // Send Emails
  // 1. To Patient
  sendEmail(
    appointment.patient.email,
    "Appointment Request Received",
    `Your appointment with Dr. ${doctor.name} on ${format(appointment.date, "PPpp")} has been requested. We will notify you once it is confirmed.`
  );

  // 2. To Doctor
  if (doctor.user?.email) {
    sendEmail(
      doctor.user.email,
      "New Appointment Request",
      `You have a new appointment request from ${appointment.patient.name} for ${format(appointment.date, "PPpp")}. Please log in to your dashboard to approve or reject.`
    );
  }

  return toCamelCase(appointment);
};

const getMyAppointments = async (userId: string, role: string, query: AppointmentQueryDto) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  
  let where: any = {};

  if (role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({ where: { user_id: userId } });
    if (!doctor) return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
    where = { doctor_id: doctor.id };
  } else {
    where = { patient_id: userId };
  }

  const [total, appointments] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      include: {
        doctor: true,
        hospital: true,
        patient: role === "DOCTOR" ? { select: { id: true, name: true, email: true } } : undefined,
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
  ]);

  // Check which doctors the user has already reviewed
  let appointmentsWithReviewStatus = toCamelCase(appointments);

  if (role === "USER" && appointments.length > 0) {
    const doctorIds = [...new Set(appointments.map((a) => a.doctor_id))];
    
    const reviews = await prisma.review.findMany({
      where: {
        patient_id: userId,
        doctor_id: { in: doctorIds },
      },
      select: { doctor_id: true },
    });

    const reviewedDoctorIds = new Set(reviews.map((r) => r.doctor_id));

    appointmentsWithReviewStatus = appointmentsWithReviewStatus.map((appt: any) => ({
      ...appt,
      hasReviewedDoctor: reviewedDoctorIds.has(appt.doctor.id),
    }));
  }

  return {
    data: appointmentsWithReviewStatus,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateAppointmentStatus = async (
  appointmentId: string, 
  userId: string, 
  status: AppointmentStatus
) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { doctor: true },
  });

  if (!appointment) throw new AppError("Appointment not found", 404);

  // Verify ownership/permission
  // Only the assigned doctor can confirm/complete/cancel (or maybe patient can cancel)
  // For now, let's assume this is primarily for the doctor dashboard actions
  if (appointment.doctor.user_id !== userId) {
    throw new AppError("Unauthorized to update this appointment", StatusCodes.FORBIDDEN);
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: true,
    },
  });

  // Send Email to Patient
  const subject = status === "CONFIRMED" ? "Appointment Confirmed" : "Appointment Update";
  const message = status === "CONFIRMED" 
    ? `Your appointment with Dr. ${updatedAppointment.doctor.name} on ${format(updatedAppointment.date, "PPpp")} has been confirmed.`
    : `Your appointment status has been updated to: ${status}.`;

  sendEmail(
    updatedAppointment.patient.email,
    subject,
    message
  );

  return toCamelCase(updatedAppointment);
};

export {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  getAvailableSlots,
};
