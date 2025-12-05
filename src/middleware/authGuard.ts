import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserRole } from "@prisma/client";
import { verifyAccessToken } from "@/utils/jwt";
import { AppError } from "@/utils/appError";

export const authGuard = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", StatusCodes.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role as UserRole };
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED));
  }
};

