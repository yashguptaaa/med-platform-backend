import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as reviewService from "./review.service";

const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const review = await reviewService.createReview(userId, req.body);
    res.sendSuccess(review, StatusCodes.CREATED);
  } catch (error) {
    next(error);
  }
};

export { createReview };
