import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { AppError } from "@/utils/appError";

export const requireRole =
  (roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    return next();
  };

