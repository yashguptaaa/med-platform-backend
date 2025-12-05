import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/utils/appError";

type RequestPart = "body" | "query" | "params";

export const validateRequest =
  (schema: ZodSchema, part: RequestPart = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      return next(
        new AppError("Validation failed", StatusCodes.BAD_REQUEST, result.error.flatten())
      );
    }

    // req.query might be a getter, so we mutate the object properties
    Object.assign(req[part], result.data);

    return next();
  };
