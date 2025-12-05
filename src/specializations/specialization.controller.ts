import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as specializationService from "./specialization.service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const specialization = await specializationService.createSpecialization(req.body);
    res.sendSuccess(specialization, StatusCodes.CREATED);
  } catch (error) {
    console.error("Error in listSpecializations:", error);
    next(error);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await specializationService.listSpecializations(req.query as any);
    res.sendSuccess(result.data, StatusCodes.OK, result.meta);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const specialization = await specializationService.updateSpecialization(req.params.id, req.body);
    res.sendSuccess(specialization, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await specializationService.deleteSpecialization(req.params.id);
    res.sendSuccess(null, StatusCodes.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export {
  create,
  list,
  update,
  remove,
};
