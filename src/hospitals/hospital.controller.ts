import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as hospitalService from "./hospital.service";

const listHospitals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await hospitalService.listHospitals(req.query as any);
    res.sendSuccess(result.data, StatusCodes.OK, result.meta);
  } catch (error) {
    console.error("Error in listHospitals:", error);
    next(error);
  }
};

const getHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hospital = await hospitalService.getHospital(req.params.id);
    res.sendSuccess(hospital, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const createHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.files && Array.isArray(req.files)) {
      const images = (req.files as any[]).map((file) => file.location);
      req.body.images = images;
    }
    const hospital = await hospitalService.createHospital(req.body);
    res.sendSuccess(hospital, StatusCodes.CREATED);
  } catch (error) {
    console.error("Error creating hospital:", error);
    next(error);
  }
};

const updateHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.MulterS3.File[];
    const images = files?.map((file) => file.location);
    const hospital = await hospitalService.updateHospital(req.params.id, {
      ...req.body,
      images,
    });
    res.sendSuccess(hospital, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const deleteHospital = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await hospitalService.deleteHospital(req.params.id);
    res.sendSuccess(null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export {
  listHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
};
