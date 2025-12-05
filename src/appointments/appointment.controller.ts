import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as appointmentService from "./appointment.service";

const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const appointment = await appointmentService.createAppointment(userId, req.body);
    res.sendSuccess(appointment, StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

const getMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role } = req.user!;
    const result = await appointmentService.getMyAppointments(id, role, req.query as any);
    res.sendSuccess(result.data, StatusCodes.OK, result.meta);
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await appointmentService.updateAppointmentStatus(id, userId, status);
    res.sendSuccess(appointment, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const getSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "doctorId and date are required" });
      return;
    }
    const slots = await appointmentService.getAvailableSlots(doctorId as string, date as string);
    res.sendSuccess(slots, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export {
  createAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  getSlots,
};
