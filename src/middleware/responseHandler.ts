import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

// Extend Express Response interface
declare global {
  namespace Express {
    interface Response {
      sendSuccess: (data: any, statusCode?: number, meta?: any) => void;
    }
  }
}

export const responseHandler = (_req: Request, res: Response, next: NextFunction) => {
  res.sendSuccess = (data: any, statusCode: number = StatusCodes.OK, meta?: any) => {
    res.status(statusCode).json({
      success: true,
      data,
      meta,
    });
  };
  next();
};
