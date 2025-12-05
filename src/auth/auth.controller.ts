import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as authService from "./auth.service";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.register({
      ...req.body,
      image: (req.file as any)?.location,
    });
    res.sendSuccess(result, StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body);
    res.sendSuccess(result, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.refresh(req.body);
    res.sendSuccess(result, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Forgot password");
    await authService.forgotPassword(req.body.email);
    res.sendSuccess({ message: "If the email exists, a reset link has been sent." }, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    res.sendSuccess({ message: "Password reset successful" }, StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
};
