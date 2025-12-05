import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as dashboardService from "./dashboard.service";

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("req.user:",req.user);
    const userId = req.user!.id;
    const profile = await dashboardService.getMyProfile(userId);
    console.log("profile:",profile);
    res.sendSuccess(profile, StatusCodes.OK);
  } catch (error) {
    console.error("Error in getMyProfile:", error);
    next(error);
  }
};

const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const availability = await dashboardService.updateAvailability(userId, req.body);
    res.sendSuccess(availability, StatusCodes.OK);
  } catch (error) {
    console.error("Error in updateAvailability:", error);
    next(error);
  }
};

const requestProfileChange = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const request = await dashboardService.requestProfileChange(userId, req.body);
    res.sendSuccess(request, StatusCodes.OK);
  } catch (error) {
    console.error("Error in requestProfileChange:", error);
    next(error);
  }
};

export {
  getMyProfile,
  updateAvailability,
  requestProfileChange,
};
