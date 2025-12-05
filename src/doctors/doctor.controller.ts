import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as doctorService from "./doctor.service";

const listDoctors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await doctorService.listDoctors(req.query as any);
    res.sendSuccess(result.data, StatusCodes.OK, result.meta);
  } catch (error) {
    console.error("Error in listDoctors:", error);
    next(error);
  }
};

const getDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.getDoctor(req.params.id);
    res.sendSuccess(doctor, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.createDoctor({
      ...req.body,
      image: (req.file as any)?.location,
    });
    res.sendSuccess(doctor, StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, {
      ...req.body,
      image: (req.file as any)?.location,
    });
    res.sendSuccess(doctor, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await doctorService.deleteDoctor(req.params.id);
    res.sendSuccess(null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

const listChangeRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await doctorService.listChangeRequests();
    res.sendSuccess(requests, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const processChangeRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const result = await doctorService.processChangeRequest(id, status, feedback);
    res.sendSuccess(result, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const getDoctorStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await doctorService.getDoctorStats();
    res.sendSuccess(stats, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export {
  listDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  listChangeRequests,
  processChangeRequest,
  getDoctorStats,
};
