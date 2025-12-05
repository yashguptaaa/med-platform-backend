import { Router } from "express";
import { authGuard } from "@/middleware/authGuard";
import { validateRequest } from "@/middleware/validateRequest";
import { createReviewSchema } from "./review.validator";
import * as reviewController from "./review.controller";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  authGuard,
  validateRequest(createReviewSchema),
  reviewController.createReview
);

export default reviewRouter;
