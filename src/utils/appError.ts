import { StatusCodes } from "http-status-codes";

class AppError extends Error {
  statusCode: number;
  details?: unknown;
  constructor(message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export {
  AppError,
};
