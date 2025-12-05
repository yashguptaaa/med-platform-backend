import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/utils/appError";
import { logger } from "@/utils/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

  if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
    logger.error({ err }, err.message);
  } else {
    logger.warn({ err }, err.message);
  }

  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    details: err instanceof AppError ? err.details : undefined,
  });
};

