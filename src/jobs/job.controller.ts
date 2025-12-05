import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as jobService from "./job.service";

const listJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.listJobs(req.query as any);
    res.sendSuccess(result.data, StatusCodes.OK, result.meta);
  } catch (error) {
    next(error);
  }
};

const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.getJob(req.params.id);
    res.sendSuccess(job, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.createJob(req.body);
    res.sendSuccess(job, StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    res.sendSuccess(job, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.deleteJob(req.params.id);
    res.sendSuccess(job, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export {
  listJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
